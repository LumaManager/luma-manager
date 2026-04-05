import type { DocumentsListResponse } from "@terapia/contracts";

import { DocumentsPageView } from "@/components/documents/documents-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

function toSearchParams(input: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      params.set(key, value);
    }
  });

  return params.toString();
}

export default async function DocumentsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const token = await getRequiredSessionToken();
  const resolved = await searchParams;
  const query = toSearchParams(resolved);
  const data = await apiFetch<DocumentsListResponse>(`/v1/documents${query ? `?${query}` : ""}`, {
    token
  });

  return <DocumentsPageView initialData={data} />;
}
