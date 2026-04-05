import { redirect } from "next/navigation";

import type { AppShellBootstrap, AuthSession } from "@terapia/contracts";

import { AppShell } from "@/components/shell/app-shell";
import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { isInternalOperatorSession } from "@/lib/auth/session-destination";

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/login");
  }

  const session = await apiFetch<AuthSession>("/v1/auth/me", {
    token: sessionToken
  });

  if (isInternalOperatorSession(session)) {
    redirect("/internal");
  }

  const bootstrap = await apiFetch<AppShellBootstrap>("/v1/app-shell/bootstrap", {
    token: sessionToken
  });

  return <AppShell bootstrap={bootstrap}>{children}</AppShell>;
}
