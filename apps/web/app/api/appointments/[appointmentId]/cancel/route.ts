import { NextResponse } from "next/server";
import type { AppointmentCancelRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const token = await getRequiredSessionToken();
    const { appointmentId } = await params;
    const body = (await request.json()) as AppointmentCancelRequest;
    const payload = await apiFetch(`/v1/appointments/${appointmentId}/cancel`, {
      method: "POST",
      token,
      body: JSON.stringify(body)
    });

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Não foi possível cancelar a sessão." },
      { status: 400 }
    );
  }
}
