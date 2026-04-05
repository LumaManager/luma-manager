import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const token = await getRequiredSessionToken();
  const { documentId } = await params;
  const payload = await apiFetch(`/v1/documents/${documentId}/revoke`, {
    method: "POST",
    token
  });

  return NextResponse.json(payload);
}
