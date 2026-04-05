import { NextResponse } from "next/server";
import type { ClinicalReviewDraftUpdateRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const token = await getRequiredSessionToken();
  const { appointmentId } = await params;
  const body = (await request.json()) as ClinicalReviewDraftUpdateRequest;
  const payload = await apiFetch(`/v1/clinical-review/${appointmentId}/draft`, {
    method: "PATCH",
    token,
    body: JSON.stringify(body)
  });

  return NextResponse.json(payload);
}
