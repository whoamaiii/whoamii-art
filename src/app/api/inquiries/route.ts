import { NextResponse } from "next/server";
import { validateInquiryPayload } from "@/lib/inquiry-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getRateLimitIdentity, isJsonRequest, parseJsonBody } from "@/lib/request-guards";
import { getResendClient, getResendConfig } from "@/lib/resend-client";
import type { InquiryErrorResponse, InquirySuccessResponse } from "@/types/cms";

const parsedMaxBodyBytes = Number(process.env.INQUIRY_MAX_BODY_BYTES);
const parsedRateLimitWindowMs = Number(process.env.INQUIRY_RATE_LIMIT_WINDOW_MS);
const parsedRateLimitMax = Number(process.env.INQUIRY_RATE_LIMIT_MAX);

const MAX_JSON_BODY_BYTES = Number.isFinite(parsedMaxBodyBytes) ? parsedMaxBodyBytes : 12_000;
const RATE_LIMIT_WINDOW_MS = Number.isFinite(parsedRateLimitWindowMs) ? parsedRateLimitWindowMs : 60_000;
const RATE_LIMIT_MAX = Number.isFinite(parsedRateLimitMax) ? parsedRateLimitMax : 8;

function sanitizeMailText(value: string) {
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

function rateHeaders(rate: { retryAfterSeconds: number; remaining: number }) {
  const resetAtSeconds = Math.floor((Date.now() + rate.retryAfterSeconds * 1000) / 1000);
  return {
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
    "X-RateLimit-Remaining": String(Math.max(0, rate.remaining)),
    "X-RateLimit-Reset": String(resetAtSeconds)
  };
}

export async function POST(request: Request) {
  const identity = getRateLimitIdentity(request);
  const rate = await consumeRateLimit(`inquiries:${identity}`, {
    limit: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS
  });

  const headers = rateHeaders(rate);

  if (!rate.allowed) {
    const payload: InquiryErrorResponse = {
      ok: false,
      errors: [`Too many requests. Retry in ${rate.retryAfterSeconds}s.`]
    };

    return NextResponse.json(payload, {
      status: 429,
      headers: {
        ...headers,
        "Retry-After": String(rate.retryAfterSeconds)
      }
    });
  }

  if (!isJsonRequest(request)) {
    return NextResponse.json<InquiryErrorResponse>(
      {
        ok: false,
        errors: ["Content-Type must be application/json."]
      },
      {
        status: 415,
        headers
      }
    );
  }

  const parsedBody = await parseJsonBody(request, MAX_JSON_BODY_BYTES);
  if (!parsedBody.ok) {
    return NextResponse.json<InquiryErrorResponse>(
      {
        ok: false,
        errors: [parsedBody.error || "Invalid request body."]
      },
      {
        status: parsedBody.status,
        headers
      }
    );
  }

  const validation = validateInquiryPayload(parsedBody.data);
  if (!validation.valid) {
    return NextResponse.json<InquiryErrorResponse>(
      {
        ok: false,
        errors: validation.errors
      },
      {
        status: 400,
        headers
      }
    );
  }

  const resend = getResendClient();
  const resendConfig = getResendConfig();

  if (!resend || !resendConfig.to) {
    return NextResponse.json<InquiryErrorResponse>(
      {
        ok: false,
        errors: ["Inquiry backend is not configured yet."]
      },
      {
        status: 503,
        headers
      }
    );
  }

  try {
    await resend.emails.send({
      from: resendConfig.from,
      to: [resendConfig.to],
      subject: `[WHOAMIII Inquiry] ${sanitizeMailText(validation.data.projectType)} · ${sanitizeMailText(
        validation.data.budget
      )}`,
      replyTo: sanitizeMailText(validation.data.email),
      text:
        `Name: ${sanitizeMailText(validation.data.name)}\n` +
        `Email: ${sanitizeMailText(validation.data.email)}\n` +
        `Project Type: ${sanitizeMailText(validation.data.projectType)}\n` +
        `Budget: ${sanitizeMailText(validation.data.budget)}\n` +
        `Timeline: ${sanitizeMailText(validation.data.timeline)}\n\n` +
        `Brief:\n${sanitizeMailText(validation.data.message)}`
    });
  } catch (error) {
    console.error("Inquiry email send failed", error);
    return NextResponse.json<InquiryErrorResponse>(
      {
        ok: false,
        errors: ["Email delivery failed. Please try again shortly."]
      },
      {
        status: 502,
        headers
      }
    );
  }

  const payload: InquirySuccessResponse = {
    ok: true,
    message: "Inquiry received. You should hear back within 1-2 business days."
  };

  return NextResponse.json(payload, {
    headers
  });
}
