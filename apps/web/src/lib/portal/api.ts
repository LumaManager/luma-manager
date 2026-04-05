import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api/client";

import { PORTAL_DEMO_INVITE_PATH } from "./session";

export async function portalFetch<T>(path: string, portalToken: string) {
  try {
    return await apiFetch<T>(path, {
      headers: {
        "X-Portal-Token": portalToken
      }
    });
  } catch {
    redirect(PORTAL_DEMO_INVITE_PATH);
  }
}
