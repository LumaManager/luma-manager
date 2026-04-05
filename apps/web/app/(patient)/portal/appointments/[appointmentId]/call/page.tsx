import type { PortalCall } from "@terapia/contracts";

import { PortalCallPage } from "@/components/portal/portal-call-page";
import { portalFetch } from "@/lib/portal/api";
import { getRequiredPortalSessionToken } from "@/lib/portal/session";

export default async function PortalAppointmentCallRoute({
  params
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const portalToken = await getRequiredPortalSessionToken();
  const { appointmentId } = await params;
  const call = await portalFetch<PortalCall>(
    `/v1/portal/appointments/${appointmentId}/call`,
    portalToken
  );

  return <PortalCallPage call={call} />;
}
