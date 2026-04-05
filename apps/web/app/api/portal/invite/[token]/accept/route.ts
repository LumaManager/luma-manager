import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { PortalInviteAcceptRequest, PortalInviteAcceptResponse } from "@terapia/contracts";

import { PORTAL_SESSION_COOKIE_NAME } from "@/lib/auth/cookie-names";

function getApiBaseUrl() {
  return process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const payload = (await request.json()) as PortalInviteAcceptRequest;

  const response = await fetch(`${getApiBaseUrl()}/v1/portal/invite/${token}/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as { message?: string } | null;
    return NextResponse.json(
      { message: errorPayload?.message ?? "Nao foi possivel ativar o portal." },
      { status: response.status }
    );
  }

  const result = (await response.json()) as PortalInviteAcceptResponse;
  const cookieStore = await cookies();

  cookieStore.set({
    name: PORTAL_SESSION_COOKIE_NAME,
    value: result.portalToken,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });

  return NextResponse.json(result);
}
