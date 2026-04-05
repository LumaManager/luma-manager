import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(
  _request: Request,
  context: {
    params: Promise<{ blockId: string }>;
  }
) {
  const token = await getRequiredSessionToken();
  const { blockId } = await context.params;

  try {
    const payload = await apiFetch(`/v1/appointments/blocks/${blockId}/delete`, {
      method: "POST",
      token
    });

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Não foi possível excluir o bloqueio."
      },
      {
        status: 400
      }
    );
  }
}
