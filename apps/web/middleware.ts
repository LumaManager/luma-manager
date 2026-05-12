import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/cookie-names";

function decodeJwtPayload(token: string): { accountStatus?: string } | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    return JSON.parse(Buffer.from(segment, "base64url").toString("utf8")) as { accountStatus?: string };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/app") || pathname.startsWith("/internal");

  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/app") && sessionToken) {
    const payload = decodeJwtPayload(sessionToken);
    const isOnboarding = pathname.startsWith("/app/onboarding");
    if (!isOnboarding && payload?.accountStatus !== "ready_for_operations") {
      return NextResponse.redirect(new URL("/app/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/internal/:path*", "/login"]
};
