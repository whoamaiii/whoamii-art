interface ParsedJsonResult {
  ok: boolean;
  status: number;
  error?: string;
  data?: unknown;
}

export function isJsonRequest(request: Request) {
  const contentType = request.headers.get("content-type");
  return Boolean(contentType && contentType.toLowerCase().includes("application/json"));
}

function getFirstForwardedIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return null;
}

export function getClientIp(request: Request): string | null {
  const forwarded = getFirstForwardedIp(request);
  if (forwarded) return forwarded;

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  return null;
}

function normalizeIdentityPart(value: string | null, fallback: string) {
  const normalized = (value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return normalized || fallback;
}

function hashIdentity(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function getRateLimitIdentity(request: Request) {
  const ip = getClientIp(request);
  if (ip) {
    return `ip:${ip}`;
  }

  const userAgent = normalizeIdentityPart(request.headers.get("user-agent"), "ua");
  const language = normalizeIdentityPart(request.headers.get("accept-language"), "lang");
  const host = normalizeIdentityPart(request.headers.get("host"), "host");
  const fingerprintSeed = `${userAgent}|${language}|${host}`;
  const fingerprint = hashIdentity(fingerprintSeed);
  const sizeTag = fingerprintSeed.length.toString(36);
  return `fp:${fingerprint}:${sizeTag}`;
}

export async function parseJsonBody(request: Request, maxBytes: number): Promise<ParsedJsonResult> {
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const parsed = Number(contentLength);
    if (Number.isFinite(parsed) && parsed > maxBytes) {
      return {
        ok: false,
        status: 413,
        error: `Payload too large. Maximum body size is ${maxBytes} bytes.`
      };
    }
  }

  const stream = request.body;
  if (!stream) {
    return {
      ok: false,
      status: 400,
      error: "Request body is required."
    };
  }

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let bytesRead = 0;
  let raw = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!value) {
        continue;
      }

      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return {
          ok: false,
          status: 413,
          error: `Payload too large. Maximum body size is ${maxBytes} bytes.`
        };
      }

      chunks.push(decoder.decode(value, { stream: true }));
    }

    chunks.push(decoder.decode());
    raw = chunks.join("");
  } catch {
    return {
      ok: false,
      status: 400,
      error: "Invalid request body."
    };
  } finally {
    reader.releaseLock();
  }

  if (!raw.trim()) {
    return {
      ok: false,
      status: 400,
      error: "Request body is required."
    };
  }

  try {
    return {
      ok: true,
      status: 200,
      data: JSON.parse(raw)
    };
  } catch {
    return {
      ok: false,
      status: 400,
      error: "Invalid JSON body."
    };
  }
}
