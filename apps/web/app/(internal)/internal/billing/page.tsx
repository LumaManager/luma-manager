import type { InternalBillingResponse } from "@terapia/contracts";

import { InternalBillingPage } from "@/components/internal/internal-billing-page";
import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

export default async function InternalBillingRoute() {
  const token = await getSessionToken();
  const data = await apiFetch<InternalBillingResponse>("/v1/internal/billing", {
    token: token ?? undefined
  });

  return <InternalBillingPage data={data} />;
}
