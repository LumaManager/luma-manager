import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST() {
  const token = await getRequiredSessionToken();
  const payload = await apiFetch("/v1/account/onboarding/start", {
    method: "POST",
    token
  });

  return NextResponse.json(payload);
}
