import { NextResponse } from "next/server";
import { getResendClient, getResendConfig } from "@/lib/resend-client";
import { validateContactPayload } from "@/lib/submission-validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { valid, errors, data } = validateContactPayload(body);
  if (!valid) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const resend = getResendClient();
  const config = getResendConfig();
  if (!resend || !config.to) {
    return NextResponse.json(
      { ok: false, errors: ["Contact backend is not configured yet."] },
      { status: 503 }
    );
  }

  await resend.emails.send({
    from: config.from,
    to: [config.to],
    subject: `[Portfolio Contact] ${data.subject}`,
    replyTo: data.email,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
  });

  return NextResponse.json({ ok: true });
}
