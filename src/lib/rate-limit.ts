interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface NormalizedRateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateBucket {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

interface UpstashResponse<T = unknown> {
  result?: T;
  error?: string;
}

const buckets = new Map<string, RateBucket>();
let loggedUpstashFailure = false;
let lastCleanupAt = 0;

const MAX_IN_MEMORY_BUCKETS = Number.isFinite(Number(process.env.RATE_LIMIT_MAX_IN_MEMORY_BUCKETS))
  ? Math.max(500, Math.floor(Number(process.env.RATE_LIMIT_MAX_IN_MEMORY_BUCKETS)))
  : 10_000;
const CLEANUP_INTERVAL_MS = Number.isFinite(Number(process.env.RATE_LIMIT_CLEANUP_INTERVAL_MS))
  ? Math.max(500, Math.floor(Number(process.env.RATE_LIMIT_CLEANUP_INTERVAL_MS)))
  : 5_000;
const UPSTASH_TIMEOUT_MS = Number.isFinite(Number(process.env.UPSTASH_REDIS_TIMEOUT_MS))
  ? Math.max(1_000, Math.floor(Number(process.env.UPSTASH_REDIS_TIMEOUT_MS)))
  : 8_000;

function getUpstashConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    return null;
  }
  return { url, token };
}

function normalizeOptions(options: RateLimitOptions): NormalizedRateLimitOptions {
  const limit = Number.isFinite(options.limit) ? Math.max(1, Math.floor(options.limit)) : 1;
  const windowMs = Number.isFinite(options.windowMs)
    ? Math.max(1000, Math.floor(options.windowMs))
    : 60_000;
  return { limit, windowMs };
}

function cleanExpiredBuckets(now: number) {
  const shouldRunScheduledCleanup = now - lastCleanupAt >= CLEANUP_INTERVAL_MS;
  const shouldEnforceCap = buckets.size > MAX_IN_MEMORY_BUCKETS;

  if (!shouldRunScheduledCleanup && !shouldEnforceCap) {
    return;
  }
  lastCleanupAt = now;

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }

  if (buckets.size <= MAX_IN_MEMORY_BUCKETS) {
    return;
  }

  const entriesByReset = Array.from(buckets.entries()).sort(
    (left, right) => left[1].resetAt - right[1].resetAt
  );
  const overflow = buckets.size - MAX_IN_MEMORY_BUCKETS;
  for (let index = 0; index < overflow; index += 1) {
    const candidate = entriesByReset[index];
    if (!candidate) break;
    buckets.delete(candidate[0]);
  }
}

function consumeInMemoryRateLimit(
  key: string,
  { limit, windowMs }: NormalizedRateLimitOptions
): RateLimitResult {
  const now = Date.now();
  cleanExpiredBuckets(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
      remaining: limit - 1
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      remaining: 0
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    remaining: Math.max(0, limit - existing.count)
  };
}

async function runUpstashCommand<T>(
  config: { url: string; token: string },
  args: Array<string | number>
): Promise<T> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), UPSTASH_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(args),
      cache: "no-store",
      signal: abortController.signal
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Upstash request timed out after ${UPSTASH_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Upstash request failed with status ${response.status}`);
  }

  let payload: UpstashResponse<T>;
  try {
    payload = (await response.json()) as UpstashResponse<T>;
  } catch {
    throw new Error("Upstash returned a non-JSON response");
  }
  if (payload.error) {
    throw new Error(payload.error);
  }
  return payload.result as T;
}

async function consumeUpstashRateLimit(
  key: string,
  { limit, windowMs }: NormalizedRateLimitOptions
): Promise<RateLimitResult> {
  const config = getUpstashConfig();
  if (!config) {
    throw new Error("Missing Upstash configuration");
  }

  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const bucketKey = `rl:${key}:${windowStart}`;
  const count = Number(await runUpstashCommand<number | string>(config, ["INCR", bucketKey]));

  if (!Number.isFinite(count)) {
    throw new Error("Upstash returned a non-numeric counter value");
  }

  if (count === 1) {
    await runUpstashCommand(config, ["PEXPIRE", bucketKey, windowMs]);
  }

  let ttlMs = Number(await runUpstashCommand<number | string>(config, ["PTTL", bucketKey]));
  if (!Number.isFinite(ttlMs) || ttlMs < 0) {
    ttlMs = Math.max(1000, windowMs - (now - windowStart));
  }

  const retryAfterSeconds = Math.max(1, Math.ceil(ttlMs / 1000));
  if (count > limit) {
    return {
      allowed: false,
      retryAfterSeconds,
      remaining: 0
    };
  }

  return {
    allowed: true,
    retryAfterSeconds,
    remaining: Math.max(0, limit - count)
  };
}

export async function consumeRateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const normalizedOptions = normalizeOptions(options);

  if (getUpstashConfig()) {
    try {
      return await consumeUpstashRateLimit(key, normalizedOptions);
    } catch (error) {
      if (!loggedUpstashFailure) {
        console.error("Distributed rate limit failed; falling back to in-memory limiter.", error);
        loggedUpstashFailure = true;
      }
    }
  }

  return consumeInMemoryRateLimit(key, normalizedOptions);
}
