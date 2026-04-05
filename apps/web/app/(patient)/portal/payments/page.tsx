import type { PortalPaymentsResponse } from "@terapia/contracts";

import { PortalPaymentsPage } from "@/components/portal/portal-payments-page";
import { portalFetch } from "@/lib/portal/api";
import { getRequiredPortalSessionToken } from "@/lib/portal/session";

export default async function PortalPaymentsRoute() {
  const portalToken = await getRequiredPortalSessionToken();
  const data = await portalFetch<PortalPaymentsResponse>("/v1/portal/payments", portalToken);

  return <PortalPaymentsPage data={data} />;
}
