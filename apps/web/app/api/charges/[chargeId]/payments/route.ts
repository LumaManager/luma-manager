import { NextResponse } from "next/server";
import type { ChargePaymentRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chargeId: string }> }
) {
  const token = await getRequiredSessionToken();
  const { chargeId } = await params;
  const body = (await request.json()) as ChargePaymentRequest;

  const payload = await apiFetch(`/v1/charges/${chargeId}/payments`, {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });

  return NextResponse.json(payload);
}
