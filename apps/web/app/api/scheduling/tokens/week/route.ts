import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function GET(request: Request) {
  const token = await getRequiredSessionToken();
  try {
    const url = new URL(request.url);
    const weekStart = url.searchParams.get("weekStart") ?? "";
    const payload = await apiFetch(`/v1/scheduling/tokens/week?weekStart=${weekStart}`, {
      method: "GET",
      token
    });
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro ao buscar tokens." },
      { status: 400 }
    );
  }
}
