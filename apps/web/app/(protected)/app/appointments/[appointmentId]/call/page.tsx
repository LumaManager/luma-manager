import type { AppointmentCall, AppShellBootstrap } from "@terapia/contracts";

import { AppointmentCallPageView } from "@/components/agenda/appointment-call-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export default async function AppointmentCallPage({
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

  const call = await apiFetch<AppointmentCall>(`/v1/appointments/${appointmentId}/call`, {
    token
  });

  return <AppointmentCallPageView initialCall={call} />;
}
