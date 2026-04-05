import type { InternalTenantListResponse } from "@terapia/contracts";

import { InternalTenantsPage } from "@/components/internal/internal-tenants-page";
import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";

function toSearchParams(input: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      params.set(key, value);
    }
  });

  return params.toString();
}

export default async function InternalTenantsRoute({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const token = await getSessionToken();
  const resolved = await searchParams;
  const query = toSearchParams(resolved);
  const data = await apiFetch<InternalTenantListResponse>(
    `/v1/internal/tenants${query ? `?${query}` : ""}`,
    {
      token: token ?? undefined
    }
  );

  return <InternalTenantsPage initialData={data} />;
}
