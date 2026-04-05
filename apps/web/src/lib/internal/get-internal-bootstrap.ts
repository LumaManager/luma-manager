import { redirect } from "next/navigation";
import type { InternalBootstrap } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

export async function getInternalBootstrap() {
  const token = await getSessionToken();

  if (!token) {
    redirect("/login");
  }

  try {
    return await apiFetch<InternalBootstrap>("/v1/internal/bootstrap", {
      token
    });
  } catch {
    redirect("/app/dashboard");
  }
}
