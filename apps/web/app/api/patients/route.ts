import { NextResponse } from "next/server";
import type { PatientCreateRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const token = await getRequiredSessionToken();
  const body = (await request.json()) as PatientCreateRequest;

  const payload = await apiFetch("/v1/patients", {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });

  return NextResponse.json(payload);
}
