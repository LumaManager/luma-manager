import type { PatientDetail } from "@terapia/contracts";

import { PatientDetailPageView } from "@/components/patients/patient-detail-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export default async function PatientDetailPage({
  params
}: {
  params: Promise<{ patientId: string }>;
}) {
  const token = await getRequiredSessionToken();
  const { patientId } = await params;
  const data = await apiFetch<PatientDetail>(`/v1/patients/${patientId}`, {
    token
  });

  return <PatientDetailPageView patient={data} />;
}
