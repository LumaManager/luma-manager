import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AuthSession } from "@terapia/contracts";

import { SESSION_COOKIE_NAME } from "@/lib/auth/cookie-names";

export async function POST(request: Request) {
  const session = (await request.json()) as AuthSession;
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: session.accessToken,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    expires: new Date(session.expiresAt)
  });

  return NextResponse.json({ success: true });
}
