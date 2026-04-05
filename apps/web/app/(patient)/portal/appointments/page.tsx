import type { PortalAppointmentsResponse } from "@terapia/contracts";

import { PortalAppointmentsPage } from "@/components/portal/portal-appointments-page";
import { portalFetch } from "@/lib/portal/api";
import { getRequiredPortalSessionToken } from "@/lib/portal/session";

export default async function PortalAppointmentsRoute() {
  const portalToken = await getRequiredPortalSessionToken();
  const data = await portalFetch<PortalAppointmentsResponse>("/v1/portal/appointments", portalToken);

  return <PortalAppointmentsPage data={data} />;
}
