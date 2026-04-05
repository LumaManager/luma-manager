import type { SettingsBootstrap } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function getSettingsBootstrap() {
  const token = await getRequiredSessionToken();
  return apiFetch<SettingsBootstrap>("/v1/settings", {
    token
  });
}
