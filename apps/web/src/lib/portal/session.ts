import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PORTAL_SESSION_COOKIE_NAME } from "@/lib/auth/cookie-names";

export const PORTAL_DEMO_INVITE_PATH = "/invite/invite_maria_001";

export async function getPortalSessionToken() {
  return (await cookies()).get(PORTAL_SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getRequiredPortalSessionToken() {
  const token = await getPortalSessionToken();

  if (!token) {
    redirect(PORTAL_DEMO_INVITE_PATH);
  }

  return token;
}
