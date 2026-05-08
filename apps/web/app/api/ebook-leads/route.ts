import { NextResponse } from "next/server";
import type { EbookLeadRequest } from "@terapia/contracts";

const API_BASE_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function POST(request: Request) {
  let payload: EbookLeadRequest;

  try {
    payload = (await request.json()) as EbookLeadRequest;
  } catch {
    return NextResponse.json({ message: "Payload inválido." }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/ebook-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const body = (await response.json().catch(() => null)) as unknown;

    if (!response.ok) {
      console.error("[ebook-leads] API error", { status: response.status, email: payload.email });
      return NextResponse.json({ message: "Erro ao registrar. Tente novamente." }, { status: response.status });
    }

    return NextResponse.json(body);
  } catch (err) {
    console.error("[ebook-leads] Unexpected error", err);
    return NextResponse.json({ message: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
