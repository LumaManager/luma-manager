import type { InternalAuditResponse } from "@terapia/contracts";

import { InternalAuditPage } from "@/components/internal/internal-audit-page";
import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

export default async function InternalAuditRoute() {
  const token = await getSessionToken();
  const data = await apiFetch<InternalAuditResponse>("/v1/internal/audit", {
    token: token ?? undefined
  });

  return <InternalAuditPage data={data} />;
}
