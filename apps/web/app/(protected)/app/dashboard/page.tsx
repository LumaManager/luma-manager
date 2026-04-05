import type { TherapistDashboard } from "@terapia/contracts";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export default async function TherapistDashboardPage() {
  const sessionToken = await getRequiredSessionToken();
  const data = await apiFetch<TherapistDashboard>("/v1/dashboard/therapist", {
    token: sessionToken
  });

  return <DashboardPage data={data} />;
}
