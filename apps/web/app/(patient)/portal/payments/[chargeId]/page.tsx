import type { PortalPaymentDetail } from "@terapia/contracts";

import { PortalPaymentDetailPage } from "@/components/portal/portal-payment-detail-page";
import { portalFetch } from "@/lib/portal/api";
import { getRequiredPortalSessionToken } from "@/lib/portal/session";

export default async function PortalPaymentDetailRoute({
  params
}: {
  params: Promise<{ chargeId: string }>;
}) {
  const portalToken = await getRequiredPortalSessionToken();
  const { chargeId } = await params;
  const detail = await portalFetch<PortalPaymentDetail>(
    `/v1/portal/payments/${chargeId}`,
    portalToken
  );

  return <PortalPaymentDetailPage detail={detail} />;
}
