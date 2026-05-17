import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const payload = await apiFetch(`/v1/public/consent/${token}/sign`, {
      method: "POST",
      body: JSON.stringify(body)
    });
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 400 });
  }
}
