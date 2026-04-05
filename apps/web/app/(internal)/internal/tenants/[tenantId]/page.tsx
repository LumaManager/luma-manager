import type { InternalTenantDetail } from "@terapia/contracts";

import { InternalTenantDetailPage } from "@/components/internal/internal-tenant-detail-page";
import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

export default async function InternalTenantDetailRoute({
  params
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const token = await getSessionToken();
  const { tenantId } = await params;
  const data = await apiFetch<InternalTenantDetail>(`/v1/internal/tenants/${tenantId}`, {
    token: token ?? undefined
  });

  return <InternalTenantDetailPage detail={data} />;
}
