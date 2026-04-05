import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ chargeId: string }> }
) {
  const token = await getRequiredSessionToken();
  const { chargeId } = await params;

  const payload = await apiFetch(`/v1/charges/${chargeId}/cancel`, {
    method: "POST",
    token
  });

  return NextResponse.json(payload);
}
