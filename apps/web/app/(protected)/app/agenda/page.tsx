import type {
  AgendaResponse,
  AppShellBootstrap,
  AppointmentDetail,
  PatientListResponse
} from "@terapia/contracts";

import { AgendaPageView } from "@/components/agenda/agenda-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

function toSearchParams(input: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      params.set(key, value);
    }
  });

  return params.toString();
}

export default async function AgendaPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const token = await getRequiredSessionToken();
  const resolved = await searchParams;
  const query = toSearchParams(resolved);
  const selectedAppointmentId =
    typeof resolved.appointment === "string" && resolved.appointment.length > 0
      ? resolved.appointment
      : null;
  const bootstrap = await apiFetch<AppShellBootstrap>("/v1/app-shell/bootstrap", {
    token
  });

  if (bootstrap.tenant.status === "pending_setup") {
    return null;
  }

  const [agenda, patients, appointment] = await Promise.all([
    apiFetch<AgendaResponse>(`/v1/appointments${query ? `?${query}` : ""}`, { token }),
    apiFetch<PatientListResponse>("/v1/patients", { token }),
    selectedAppointmentId
      ? apiFetch<AppointmentDetail>(`/v1/appointments/${selectedAppointmentId}`, { token })
      : Promise.resolve(null)
  ]);

  return (
    <AgendaPageView
      initialData={agenda}
      initialSelectedAppointment={appointment}
      patientOptions={patients.items.map((item) => ({
        id: item.id,
        label: item.fullName,
        meta: `${item.externalCode} · ${item.nextSessionLabel}`
      }))}
    />
  );
}
