import type { InternalWaitlistResponse } from "@terapia/contracts";

import { InternalWaitlistPage } from "@/components/internal/internal-waitlist-page";
import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

export default async function InternalWaitlistRoute() {
  const token = await getSessionToken();
  const data = await apiFetch<InternalWaitlistResponse>("/v1/internal/waitlist", {
    token: token ?? undefined
  });

  return <InternalWaitlistPage data={data} />;
}
