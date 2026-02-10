import { NextResponse } from "next/server";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getRateLimitIdentity, isJsonRequest, parseJsonBody } from "@/lib/request-guards";
import { getResendClient, getResendConfig } from "@/lib/resend-client";
import { validateCommissionPayload } from "@/lib/submission-validation";

const parsedMaxBodyBytes = Number(process.env.SUBMISSION_MAX_BODY_BYTES);
const parsedRateLimitWindowMs = Number(process.env.SUBMISSION_RATE_LIMIT_WINDOW_MS);
const parsedRateLimitMax = Number(process.env.SUBMISSION_RATE_LIMIT_MAX);
const MAX_JSON_BODY_BYTES = Number.isFinite(parsedMaxBodyBytes) ? parsedMaxBodyBytes : 12_000;
const RATE_LIMIT_WINDOW_MS = Number.isFinite(parsedRateLimitWindowMs) ? parsedRateLimitWindowMs : 60_000;
const RATE_LIMIT_MAX = Number.isFinite(parsedRateLimitMax) ? parsedRateLimitMax : 8;

function rateHeaders(rate: { retryAfterSeconds: number; remaining: number }) {
  const resetAtSeconds = Math.floor((Date.now() + rate.retryAfterSeconds * 1000) / 1000);
  return {
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
    "X-RateLimit-Remaining": String(Math.max(0, rate.remaining)),
    "X-RateLimit-Reset": String(resetAtSeconds)
  };
}

export async function POST(request: Request) {
  if (!isJsonRequest(request)) {
    return NextResponse.json(
      { ok: false, errors: ["Content-Type must be application/json."] },
      { status: 415 }
    );
  }

  const identity = getRateLimitIdentity(request);
  const rate = await consumeRateLimit(`commissions:${identity}`, {
    limit: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS
  });
  const headers = rateHeaders(rate);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, errors: [`Too many requests. Retry in ${rate.retryAfterSeconds}s.`] },
      {
        status: 429,
        headers: {
          ...headers,
          "Retry-After": String(rate.retryAfterSeconds)
        }
      }
    );
  }

  const parsedBody = await parseJsonBody(request, MAX_JSON_BODY_BYTES);
  if (!parsedBody.ok) {
    return NextResponse.json(
      { ok: false, errors: [parsedBody.error ?? "Invalid request body."] },
      { status: parsedBody.status, headers }
    );
  }

  const body = parsedBody.data;
  const { valid, errors, data } = validateCommissionPayload(body);
  if (!valid) {
    return NextResponse.json({ ok: false, errors }, { status: 400, headers });
  }

  const resend = getResendClient();
  const config = getResendConfig();
  if (!resend || !config.to) {
    return NextResponse.json(
      { ok: false, errors: ["Commissions backend is not configured yet."] },
      { status: 503, headers }
    );
  }

  try {
    await resend.emails.send({
      from: config.from,
      to: [config.to],
      subject: `[Portfolio Commission] ${data.name} - ${data.budget}`,
      replyTo: data.email,
      text:
        `Name: ${data.name}\nEmail: ${data.email}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n` +
        `References: ${data.references || "None"}\n\nConcept:\n${data.idea}`
    });
  } catch (error) {
    console.error("Commission email send failed", error);
    return NextResponse.json(
      { ok: false, errors: ["Email delivery failed. Please try again shortly."] },
      { status: 502, headers }
    );
  }

  return NextResponse.json({ ok: true }, { headers });
}
