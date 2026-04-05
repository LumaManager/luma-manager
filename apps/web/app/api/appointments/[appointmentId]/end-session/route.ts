import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const token = await getRequiredSessionToken();
  const { appointmentId } = await params;
  const payload = await apiFetch(`/v1/appointments/${appointmentId}/end-session`, {
    method: "POST",
    token
  });

  return NextResponse.json(payload);
}
