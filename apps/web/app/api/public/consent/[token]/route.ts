import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const payload = await apiFetch(`/v1/public/consent/${token}`, { method: "GET" });
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}
