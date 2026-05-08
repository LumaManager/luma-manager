import type { InternalEbookLeadsResponse } from "@terapia/contracts";

import { InternalEbookLeadsPage } from "@/components/internal/internal-ebook-leads-page";
import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

export default async function InternalEbookLeadsRoute() {
  const token = await getSessionToken();
  const data = await apiFetch<InternalEbookLeadsResponse>("/v1/internal/ebook-leads", {
    token: token ?? undefined
  });

  return <InternalEbookLeadsPage data={data} />;
}
