import { NextResponse } from "next/server";
import type { SettingsProfileUpdateRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const token = await getRequiredSessionToken();
  const body = (await request.json()) as SettingsProfileUpdateRequest;

  const payload = await apiFetch("/v1/settings/profile", {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });

  return NextResponse.json(payload);
}
