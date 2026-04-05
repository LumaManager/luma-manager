import type { ChargeDetail } from "@terapia/contracts";

import { ChargeDetailPageView } from "@/components/finance/charge-detail-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export default async function ChargeDetailPage({
  params
}: {
  params: Promise<{ chargeId: string }>;
}) {
  const token = await getRequiredSessionToken();
  const { chargeId } = await params;
  const detail = await apiFetch<ChargeDetail>(`/v1/finance/charges/${chargeId}`, {
    token
  });

  return <ChargeDetailPageView initialData={detail} />;
}
