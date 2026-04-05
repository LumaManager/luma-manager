"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { InternalTenantListResponse } from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";
import { Search, SlidersHorizontal } from "lucide-react";

export function InternalTenantsPage({ initialData }: { initialData: InternalTenantListResponse }) {
  type OperationalFilter = InternalTenantListResponse["filters"]["operationalStatus"];
  type OnboardingFilter = InternalTenantListResponse["filters"]["onboardingStatus"];
  type BillingFilter = InternalTenantListResponse["filters"]["billingStatus"];

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialData.filters.search);
  const [operationalStatus, setOperationalStatus] = useState<OperationalFilter>(
    initialData.filters.operationalStatus
  );
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingFilter>(
    initialData.filters.onboardingStatus
  );
  const [billingStatus, setBillingStatus] = useState<BillingFilter>(initialData.filters.billingStatus);

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (operationalStatus !== "all") chips.push(`Operacao: ${operationalStatus}`);
    if (onboardingStatus !== "all") chips.push(`Onboarding: ${onboardingStatus}`);
    if (billingStatus !== "all") chips.push(`Billing: ${billingStatus}`);
    return chips;
  }, [billingStatus, onboardingStatus, operationalStatus]);

  function setOrDelete(params: URLSearchParams, key: string, value: string) {
    if (value.length === 0) params.delete(key);
    else params.set(key, value);
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    setOrDelete(params, "search", search);
    setOrDelete(params, "operationalStatus", operationalStatus === "all" ? "" : operationalStatus);
    setOrDelete(params, "onboardingStatus", onboardingStatus === "all" ? "" : onboardingStatus);
    setOrDelete(params, "billingStatus", billingStatus === "all" ? "" : billingStatus);
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    setSearch("");
    setOperationalStatus("all");
    setOnboardingStatus("all");
    setBillingStatus("all");
    router.replace(pathname);
  }

  return (
    <div className="space-y-6 text-white">
      <section className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-7">
        <Badge tone="warning">Tenants</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">Contas da plataforma</h2>
        <p className="mt-3 text-sm leading-7 text-[rgba(255,255,255,0.7)]">
          Liste tenants por estado operacional, onboarding e billing sem transformar o backoffice em risco regulatorio.
        </p>
      </section>

      <section className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] px-4">
            <Search className="h-4 w-4 text-[rgba(255,255,255,0.5)]" />
            <input
              className="w-full bg-transparent outline-none placeholder:text-[rgba(255,255,255,0.38)]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar tenant ou plano"
            />
          </label>
          <SelectField<OperationalFilter>
            label="Operação"
            onChange={setOperationalStatus}
            options={[
              ["all", "Todos"],
              ["active", "Ativo"],
              ["attention", "Atenção"],
              ["restricted", "Restrito"],
              ["inactive", "Inativo"]
            ]}
            value={operationalStatus}
          />
          <SelectField<OnboardingFilter>
            label="Onboarding"
            onChange={setOnboardingStatus}
            options={[
              ["all", "Todos"],
              ["complete", "Completo"],
              ["pending", "Pendente"],
              ["blocked", "Bloqueado"]
            ]}
            value={onboardingStatus}
          />
          <SelectField<BillingFilter>
            label="Billing"
            onChange={setBillingStatus}
            options={[
              ["all", "Todos"],
              ["ok", "OK"],
              ["attention", "Atenção"],
              ["delinquent", "Inadimplente"]
            ]}
            value={billingStatus}
          />
          <div className="flex gap-3">
            <Button onClick={applyFilters} type="button" variant="secondary" className="border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.14)]">Aplicar</Button>
            <Button onClick={clearFilters} type="button" variant="ghost" className="text-white hover:bg-[rgba(255,255,255,0.08)]">Limpar</Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {activeChips.map((chip) => (
            <Badge key={chip} tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
              {chip}
            </Badge>
          ))}
        </div>
      </section>

      <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">Lista operacional</p>
            <p className="text-sm text-[rgba(255,255,255,0.66)]">{initialData.total} tenant(s) no filtro atual.</p>
          </div>
          <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
            <SlidersHorizontal className="mr-2 inline h-3.5 w-3.5" />
            Metadata-first
          </Badge>
        </CardHeader>
        <CardContent className="overflow-hidden p-0">
          <div className="grid grid-cols-[minmax(0,1.6fr)_0.9fr_0.9fr_0.9fr_1fr] gap-4 border-b border-[rgba(255,255,255,0.08)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.5)]">
            <span>Tenant</span>
            <span>Operacao</span>
            <span>Onboarding</span>
            <span>Billing</span>
            <span>Ultimo evento</span>
          </div>
          {initialData.items.map((item) => (
            <Link
              key={item.tenantId}
              href={item.detailHref}
              className="grid grid-cols-[minmax(0,1.6fr)_0.9fr_0.9fr_0.9fr_1fr] gap-4 border-b border-[rgba(255,255,255,0.08)] px-6 py-5 transition hover:bg-[rgba(255,255,255,0.05)]"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-[rgba(255,255,255,0.62)]">{item.planLabel} · {item.createdAtLabel}</p>
              </div>
              <TenantBadge kind="ops" value={item.operationalStatus} />
              <TenantBadge kind="onboarding" value={item.onboardingStatus} />
              <TenantBadge kind="billing" value={item.billingStatus} />
              <div className="text-sm text-[rgba(255,255,255,0.68)]">
                <p>{item.lastEventLabel}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[rgba(255,255,255,0.46)]">{item.lastEventAtLabel}</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SelectField<TValue extends string>({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: TValue) => void;
  options: Array<readonly [TValue, string]>;
  value: TValue;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.48)]">{label}</span>
      <select className="h-12 w-full rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] px-4 outline-none" value={value} onChange={(event) => onChange(event.target.value as TValue)}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue} className="text-black">
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function TenantBadge({ kind, value }: { kind: "ops" | "onboarding" | "billing"; value: string }) {
  if (kind === "ops") {
    const map = {
      active: ["success", "Ativo"],
      attention: ["warning", "Atenção"],
      restricted: ["critical", "Restrito"],
      inactive: ["neutral", "Inativo"]
    } as const;
    return <Badge tone={map[value as keyof typeof map][0] as "success"}>{map[value as keyof typeof map][1]}</Badge>;
  }

  if (kind === "onboarding") {
    const map = {
      complete: ["success", "Completo"],
      pending: ["warning", "Pendente"],
      blocked: ["critical", "Bloqueado"]
    } as const;
    return <Badge tone={map[value as keyof typeof map][0] as "success"}>{map[value as keyof typeof map][1]}</Badge>;
  }

  const map = {
    ok: ["success", "OK"],
    attention: ["warning", "Atenção"],
    delinquent: ["critical", "Inadimplente"]
  } as const;
  return <Badge tone={map[value as keyof typeof map][0] as "success"}>{map[value as keyof typeof map][1]}</Badge>;
}
