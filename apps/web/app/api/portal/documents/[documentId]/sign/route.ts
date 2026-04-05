import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { PORTAL_SESSION_COOKIE_NAME } from "@/lib/auth/cookie-names";

function getApiBaseUrl() {
  return process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await context.params;
  const portalToken = (await cookies()).get(PORTAL_SESSION_COOKIE_NAME)?.value;

  if (!portalToken) {
    return NextResponse.json({ message: "Sessao do portal ausente." }, { status: 401 });
  }

  const response = await fetch(`${getApiBaseUrl()}/v1/portal/documents/${documentId}/sign`, {
    method: "POST",
    headers: {
      "X-Portal-Token": portalToken
    }
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as { message?: string } | null;
    return NextResponse.json(
      { message: errorPayload?.message ?? "Nao foi possivel assinar o documento." },
      { status: response.status }
    );
  }

  return NextResponse.json(await response.json());
}
