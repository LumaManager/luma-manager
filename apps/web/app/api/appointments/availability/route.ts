import { NextResponse } from "next/server";
import type { AgendaAvailabilityUpdateRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const token = await getRequiredSessionToken();
  const body = (await request.json()) as AgendaAvailabilityUpdateRequest;

  try {
    const payload = await apiFetch("/v1/appointments/availability", {
      method: "POST",
      token,
      body: JSON.stringify(body)
    });

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Não foi possível atualizar a disponibilidade."
      },
      {
        status: 400
      }
    );
  }
}
