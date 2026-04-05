import { NextResponse } from "next/server";
import type { SettingsPracticeUpdateRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const token = await getRequiredSessionToken();
  const body = (await request.json()) as SettingsPracticeUpdateRequest;

  const payload = await apiFetch("/v1/settings/practice", {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });

  return NextResponse.json(payload);
}
