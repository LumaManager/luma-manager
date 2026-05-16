import { NextResponse } from "next/server";
import type { BookSlotRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const body = (await request.json()) as BookSlotRequest;
    const payload = await apiFetch(`/v1/public/scheduling/${params.token}/book`, {
      method: "POST",
      body: JSON.stringify(body)
    });
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "slot_taken",
        message: error instanceof Error ? error.message : "Erro ao confirmar agendamento."
      },
      { status: 400 }
    );
  }
}
