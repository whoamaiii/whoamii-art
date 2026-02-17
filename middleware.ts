import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/media/instagram-raw/")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const host = request.headers.get("host")?.toLowerCase();
  if (host === "www.whoamiii.art") {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.host = "whoamiii.art";
    canonicalUrl.protocol = "https";
    return NextResponse.redirect(canonicalUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
