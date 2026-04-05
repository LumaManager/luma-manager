import { NextResponse } from "next/server";
import type { ScheduleBlockUpdateRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(
  request: Request,
  context: {
    params: Promise<{ blockId: string }>;
  }
) {
  const token = await getRequiredSessionToken();
  const { blockId } = await context.params;
  const body = (await request.json()) as ScheduleBlockUpdateRequest;

  try {
    const payload = await apiFetch(`/v1/appointments/blocks/${blockId}`, {
      method: "POST",
      token,
      body: JSON.stringify(body)
    });

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Não foi possível atualizar o bloqueio."
      },
      {
        status: 400
      }
    );
  }
}
