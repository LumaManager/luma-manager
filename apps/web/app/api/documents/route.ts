import { NextResponse } from "next/server";
import type { DocumentCreateRequest } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const token = await getRequiredSessionToken();
  const body = (await request.json()) as DocumentCreateRequest;

  const payload = await apiFetch("/v1/documents", {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });

  return NextResponse.json(payload);
}
