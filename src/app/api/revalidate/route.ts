import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

interface RevalidatePayload {
  token?: string;
  type?: "project" | "settings" | "all";
  slug?: string;
}

function getSecretFromRequest(request: Request, payload: RevalidatePayload) {
  const headerToken = request.headers.get("x-revalidate-token")?.trim();
  if (headerToken) return headerToken;
  return payload.token?.trim();
}

export async function POST(request: Request) {
  const configuredSecret = process.env.REVALIDATE_SECRET?.trim();
  if (!configuredSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "REVALIDATE_SECRET is not configured."
      },
      { status: 503 }
    );
  }

  let payload: RevalidatePayload;
  try {
    payload = (await request.json()) as RevalidatePayload;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid JSON body."
      },
      { status: 400 }
    );
  }

  const providedSecret = getSecretFromRequest(request, payload);
  if (!providedSecret || providedSecret !== configuredSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized revalidation request."
      },
      { status: 401 }
    );
  }

  const revalidateType = payload.type || "all";

  revalidateTag("projects", "max");

  if (revalidateType === "settings" || revalidateType === "all") {
    revalidateTag("site-settings", "max");
    revalidatePath("/", "page");
    revalidatePath("/about", "page");
    revalidatePath("/contact", "page");
  }

  if (revalidateType === "project" || revalidateType === "all") {
    revalidatePath("/work", "page");
    if (payload.slug) {
      revalidateTag(`project:${payload.slug}`, "max");
      revalidatePath(`/work/${payload.slug}`, "page");
    }
  }

  return NextResponse.json({
    ok: true,
    revalidated: true,
    type: revalidateType,
    slug: payload.slug || null
  });
}
