import { NextResponse } from "next/server";
import type { SettingsPoliciesUpdateRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const token = await getRequiredSessionToken();
  const body = (await request.json()) as SettingsPoliciesUpdateRequest;

  const payload = await apiFetch("/v1/settings/policies", {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });

  return NextResponse.json(payload);
}
