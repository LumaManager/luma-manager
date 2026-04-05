import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE_NAME } from "./cookie-names";

export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getRequiredSessionToken() {
  const token = await getSessionToken();

  if (!token) {
    redirect("/login");
  }

  return token;
}
