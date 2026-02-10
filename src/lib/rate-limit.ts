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
  if (buckets.size < 5000) {
    return;
  }

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
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
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(args),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Upstash request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as UpstashResponse<T>;
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
