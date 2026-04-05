import { NextResponse } from "next/server";
import type { WaitlistJoinRequest } from "@terapia/contracts";

const API_BASE_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function POST(request: Request) {
  const payload = (await request.json()) as WaitlistJoinRequest;

  const response = await fetch(`${API_BASE_URL}/v1/marketing/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    return NextResponse.json(
      {
        message: "Não foi possível registrar sua entrada na waitlist."
      },
      {
        status: response.status
      }
    );
  }

  return NextResponse.json(body);
}
