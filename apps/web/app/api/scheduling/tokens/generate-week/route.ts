import { NextResponse } from "next/server";
import type { GenerateWeekTokensRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const token = await getRequiredSessionToken();
    const body = (await request.json()) as GenerateWeekTokensRequest;

    const payload = await apiFetch("/v1/scheduling/tokens/generate-week", {
      method: "POST",
      token,
      body: JSON.stringify(body)
    });

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro ao gerar links." },
      { status: 400 }
    );
  }
}
