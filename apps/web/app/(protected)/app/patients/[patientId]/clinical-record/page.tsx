import type { PatientClinicalRecord } from "@terapia/contracts";

import { ClinicalRecordPageView } from "@/components/clinical-record/clinical-record-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export default async function ClinicalRecordPage({
  params
}: {
  params: Promise<{ patientId: string }>;
}) {
  const token = await getRequiredSessionToken();
  const { patientId } = await params;
  const record = await apiFetch<PatientClinicalRecord>(
    `/v1/clinical-records/patients/${patientId}`,
    {
      token
    }
  );

  return <ClinicalRecordPageView initialRecord={record} />;
}
