import type { FinanceListResponse } from "@terapia/contracts";

import { FinancePageView } from "@/components/finance/finance-page";
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

export default async function FinancePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const token = await getRequiredSessionToken();
  const resolved = await searchParams;
  const query = toSearchParams(resolved);
  const data = await apiFetch<FinanceListResponse>(`/v1/finance/charges${query ? `?${query}` : ""}`, {
    token
  });

  return <FinancePageView initialData={data} />;
}
