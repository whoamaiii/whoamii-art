import { Resend } from "resend";

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function getResendConfig() {
  return {
    to: process.env.RESEND_TO_EMAIL,
    from: process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>"
  };
}
