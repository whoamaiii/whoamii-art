import { NextResponse } from "next/server";
import { getResendClient, getResendConfig } from "@/lib/resend-client";
import { validateCommissionPayload } from "@/lib/submission-validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { valid, errors, data } = validateCommissionPayload(body);
  if (!valid) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const resend = getResendClient();
  const config = getResendConfig();
  if (!resend || !config.to) {
    return NextResponse.json(
      { ok: false, errors: ["Commissions backend is not configured yet."] },
      { status: 503 }
    );
  }

  await resend.emails.send({
    from: config.from,
    to: [config.to],
    subject: `[Portfolio Commission] ${data.name} - ${data.budget}`,
    replyTo: data.email,
    text:
      `Name: ${data.name}\nEmail: ${data.email}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n` +
      `References: ${data.references || "None"}\n\nConcept:\n${data.idea}`
  });

  return NextResponse.json({ ok: true });
}
