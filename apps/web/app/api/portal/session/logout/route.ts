import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { PORTAL_SESSION_COOKIE_NAME } from "@/lib/auth/cookie-names";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(PORTAL_SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true, redirectTo: "/invite/invite_maria_001" });
}
