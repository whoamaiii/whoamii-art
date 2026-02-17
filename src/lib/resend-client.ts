import { Resend } from "resend";

let cachedClient: Resend | null = null;
let cachedApiKey: string | null = null;

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (cachedClient && cachedApiKey === apiKey) {
    return cachedClient;
  }

  cachedClient = new Resend(apiKey);
  cachedApiKey = apiKey;
  return cachedClient;
}

export function getResendConfig() {
  const to = process.env.RESEND_TO_EMAIL?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim() || "Portfolio <onboarding@resend.dev>";
  return {
    to: to || undefined,
    from
  };
}
