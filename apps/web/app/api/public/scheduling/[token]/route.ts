import { NextResponse } from "next/server";

import { apiFetch } from "@/lib/api/client";

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const payload = await apiFetch(`/v1/public/scheduling/${params.token}`, {
      method: "GET"
    });
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ state: "not_found" }, { status: 404 });
  }
}
