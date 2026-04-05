import type { InternalIncidentsResponse } from "@terapia/contracts";

import { InternalIncidentsPage } from "@/components/internal/internal-incidents-page";
import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

export default async function InternalIncidentsRoute() {
  const token = await getSessionToken();
  const data = await apiFetch<InternalIncidentsResponse>("/v1/internal/incidents", {
    token: token ?? undefined
  });

  return <InternalIncidentsPage data={data} />;
}
