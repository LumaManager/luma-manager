import type { PortalAppointmentDetail } from "@terapia/contracts";

import { PortalAppointmentDetailPage } from "@/components/portal/portal-appointment-detail-page";
import { portalFetch } from "@/lib/portal/api";
import { getRequiredPortalSessionToken } from "@/lib/portal/session";

export default async function PortalAppointmentDetailRoute({
  params
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const portalToken = await getRequiredPortalSessionToken();
  const { appointmentId } = await params;
  const detail = await portalFetch<PortalAppointmentDetail>(
    `/v1/portal/appointments/${appointmentId}`,
    portalToken
  );

  return <PortalAppointmentDetailPage detail={detail} />;
}
