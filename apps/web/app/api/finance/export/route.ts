import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function GET(request: Request) {
  const token = await getRequiredSessionToken();
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  const payload = await apiFetch(`/v1/finance/export${query ? `?${query}` : ""}`, {
    token
  });

  return NextResponse.json(payload);
}
