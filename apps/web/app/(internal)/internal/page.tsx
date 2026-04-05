import type { InternalBootstrap } from "@terapia/contracts";

import { InternalOverviewPage } from "@/components/internal/internal-overview-page";
import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

export default async function InternalOverviewRoute() {
  const token = await getSessionToken();
  const bootstrap = await apiFetch<InternalBootstrap>("/v1/internal/bootstrap", { token: token ?? undefined });

  return <InternalOverviewPage bootstrap={bootstrap} />;
}
