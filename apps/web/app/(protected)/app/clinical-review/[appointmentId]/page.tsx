import type { ClinicalReviewDetail } from "@terapia/contracts";

import { ClinicalReviewDetailPageView } from "@/components/clinical-review/clinical-review-detail-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export default async function ClinicalReviewDetailPage({
  params
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const token = await getRequiredSessionToken();
  const { appointmentId } = await params;
  const detail = await apiFetch<ClinicalReviewDetail>(`/v1/clinical-review/${appointmentId}`, {
    token
  });

  return <ClinicalReviewDetailPageView initialDetail={detail} />;
}
