import type { AppointmentDetail, AppShellBootstrap } from "@terapia/contracts";

import { AppointmentDetailPageView } from "@/components/agenda/appointment-detail-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export default async function AppointmentPage({
  params
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const token = await getRequiredSessionToken();
  const { appointmentId } = await params;
  const bootstrap = await apiFetch<AppShellBootstrap>("/v1/app-shell/bootstrap", {
    token
  });

  if (bootstrap.tenant.status === "pending_setup") {
    return null;
  }

  const appointment = await apiFetch<AppointmentDetail>(`/v1/appointments/${appointmentId}`, {
    token
  });

  return <AppointmentDetailPageView appointment={appointment} />;
}
