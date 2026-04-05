import type { InternalSupportQueueResponse } from "@terapia/contracts";

import { InternalSupportPage } from "@/components/internal/internal-support-page";
import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

export default async function InternalSupportRoute() {
  const token = await getSessionToken();
  const data = await apiFetch<InternalSupportQueueResponse>("/v1/internal/support", {
    token: token ?? undefined
  });

  return <InternalSupportPage data={data} />;
}
