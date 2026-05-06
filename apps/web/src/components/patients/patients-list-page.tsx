"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { PatientCreateRequest, PatientListResponse } from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader, cn } from "@terapia/ui";
import { Plus, Search, UserRoundPlus, X } from "lucide-react";

import { OperationalHero } from "@/components/shared/operational-surface";

type PatientsListPageProps = {
  initialData: PatientListResponse;
};

export function PatientsListPage({ initialData }: PatientsListPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialData.filters.query);
  const [status, setStatus] = useState(initialData.filters.status);
  const [documents, setDocuments] = useState(initialData.filters.documents);
  const [financial, setFinancial] = useState(initialData.filters.financial);
  const [upcomingOnly, setUpcomingOnly] = useState(initialData.filters.upcomingOnly);
  const [legalGuardianOnly, setLegalGuardianOnly] = useState(initialData.filters.legalGuardianOnly);

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (status !== "all") chips.push(`Status: ${status}`);
    if (documents !== "all") chips.push(`Documentos: ${documents}`);
    if (financial !== "all") chips.push(`Financeiro: ${financial}`);
    if (upcomingOnly) chips.push("Com sessão nos próximos 7 dias");
    if (legalGuardianOnly) chips.push("Com responsável legal");
    return chips;
  }, [documents, financial, legalGuardianOnly, status, upcomingOnly]);
  const documentsAttentionCount = initialData.items.filter((item) => item.documentsState !== "ok").length;
  const financialAttentionCount = initialData.items.filter((item) => item.financialState !== "ok").length;
  const upcomingCount = initialData.items.filter(
    (item) => item.nextSessionLabel.toLowerCase() !== "sem sessão agendada"
  ).length;

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    setOrDelete(params, "query", query);
    setOrDelete(params, "status", status === "all" ? "" : status);
    setOrDelete(params, "documents", documents === "all" ? "" : documents);
    setOrDelete(params, "financial", financial === "all" ? "" : financial);
    setOrDelete(params, "upcomingOnly", upcomingOnly ? "true" : "");
    setOrDelete(params, "legalGuardianOnly", legalGuardianOnly ? "true" : "");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setDocuments("all");
    setFinancial("all");
    setUpcomingOnly(false);
    setLegalGuardianOnly(false);
    router.replace(pathname);
  }

  return (
    <>
      <div className="space-y-6">
        <OperationalHero
          actions={
            <Button onClick={() => setIsDrawerOpen(true)} type="button">
              <Plus className="h-4 w-4" />
              Novo paciente
            </Button>
          }
          stats={[
            {
              detail: "Total de pacientes cadastrados.",
              label: "Pacientes",
              tone: "neutral",
              value: String(initialData.total)
            },
            {
              detail: "Precisam de atenção em documentos.",
              label: "Docs. pendentes",
              tone: documentsAttentionCount > 0 ? "warning" : "success",
              value: String(documentsAttentionCount)
            },
            {
              detail: "Com cobranças em aberto ou vencidas.",
              label: "Cobranças pendentes",
              tone: financialAttentionCount > 0 ? "warning" : "success",
              value: String(financialAttentionCount)
            },
            {
              detail: "Com sessão agendada.",
              label: "Com sessão",
              tone: "neutral",
              value: String(upcomingCount)
            }
          ]}
          title="Pacientes"
        />

        {/* Search + filter bar */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex h-11 flex-1 items-center gap-3 rounded-2xl border border-[var(--color-border-strong)] bg-white px-4">
              <Search className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                onChange={(event) => { setQuery(event.target.value); }}
                onKeyDown={(e) => { if (e.key === "Enter") applyFilters(); }}
                placeholder="Buscar por nome, e-mail ou telefone"
                value={query}
              />
            </span>
            <Button
              className={activeChips.length > 0 ? "border-[var(--color-primary)] text-[var(--color-primary)]" : ""}
              onClick={() => setIsFilterOpen((v) => !v)}
              type="button"
              variant="secondary"
            >
              Filtros {activeChips.length > 0 ? `(${activeChips.length})` : ""}
            </Button>
            <Button onClick={applyFilters} type="button">
              Buscar
            </Button>
          </div>

          {isFilterOpen ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <SelectField
                  label="Status"
                  onChange={(value) => setStatus(value as typeof status)}
                  value={status}
                  options={statusOptions}
                />
                <SelectField
                  label="Documentos"
                  onChange={(value) => setDocuments(value as typeof documents)}
                  value={documents}
                  options={documentOptions}
                />
                <SelectField
                  label="Financeiro"
                  onChange={(value) => setFinancial(value as typeof financial)}
                  value={financial}
                  options={financialOptions}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <ChipToggle checked={upcomingOnly} label="Sessão nos próximos 7 dias" onToggle={setUpcomingOnly} />
                <ChipToggle checked={legalGuardianOnly} label="Com responsável legal" onToggle={setLegalGuardianOnly} />
                {activeChips.length > 0 ? (
                  <button
                    className="text-xs text-[var(--color-text-muted)] underline underline-offset-2"
                    onClick={clearFilters}
                    type="button"
                  >
                    Limpar filtros
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">Tabela principal</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {initialData.total} pacientes encontrados · ordenação padrão por nome A-Z.
              </p>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden p-0">
            <div className="grid grid-cols-[minmax(0,2.1fr)_0.9fr_1fr_1fr_1fr] gap-4 border-b border-[var(--color-border)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              <span>Paciente</span>
              <span>Status</span>
              <span>Próxima sessão</span>
              <span>Documentos</span>
              <span>Financeiro</span>
            </div>

            {initialData.items.map((patient) => (
              <Link
                className="grid grid-cols-[minmax(0,2.1fr)_0.9fr_1fr_1fr_1fr] gap-4 border-b border-[var(--color-border)] px-6 py-5 transition hover:bg-[rgba(15,76,92,0.03)]"
                href={patient.patientHref}
                key={patient.id}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{patient.fullName}</p>
                    <span className="inline-flex h-6 items-center rounded-full bg-[rgba(15,76,92,0.08)] px-2.5 text-[11px] font-semibold leading-none whitespace-nowrap text-[var(--color-primary)]">
                      {patient.externalCode}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-[var(--color-text-muted)]">
                    {patient.primaryContact}
                  </p>
                </div>
                <div>
                  <StatusBadge status={patient.status} />
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">{patient.nextSessionLabel}</div>
                <div>
                  <StateBadge
                    label={patient.documentsCountLabel}
                    tone={
                      patient.documentsState === "ok"
                        ? "success"
                        : patient.documentsState === "pending"
                          ? "warning"
                          : "critical"
                    }
                  />
                </div>
                <div>
                  <StateBadge
                    label={patient.financialLabel}
                    tone={
                      patient.financialState === "ok"
                        ? "success"
                        : patient.financialState === "open"
                          ? "info"
                          : "critical"
                    }
                  />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <PatientCreateDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCreated={(redirectTo) => {
          setIsDrawerOpen(false);
          startTransition(() => {
            router.push(redirectTo);
            router.refresh();
          });
        }}
      />
    </>
  );
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value.length === 0) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
}

function SelectField({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </span>
      <select
        className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChipToggle({
  checked,
  label,
  onToggle
}: {
  checked: boolean;
  label: string;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold leading-none whitespace-nowrap transition",
        checked
          ? "border-[var(--color-primary)] bg-[rgba(15,76,92,0.08)] text-[var(--color-primary)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)]"
      )}
      onClick={() => onToggle(!checked)}
      type="button"
    >
      {label}
      {checked ? <X className="h-3.5 w-3.5" /> : null}
    </button>
  );
}

function StatusBadge({ status }: { status: PatientListResponse["items"][number]["status"] }) {
  const labelMap = {
    invited: "Convidado",
    active: "Ativo",
    inactive: "Inativo",
    archived: "Arquivado"
  } as const;

  const toneMap = {
    invited: "warning",
    active: "success",
    inactive: "neutral",
    archived: "neutral"
  } as const;

  return <Badge tone={toneMap[status]}>{labelMap[status]}</Badge>;
}

function StateBadge({
  label,
  tone
}: {
  label: string;
  tone: "critical" | "warning" | "info" | "success";
}) {
  if (tone === "success") {
    return <span className="text-sm text-[var(--color-text-muted)]">—</span>;
  }
  return <Badge tone={tone}>{label}</Badge>;
}

function PatientCreateDrawer({
  isOpen,
  onClose,
  onCreated
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (redirectTo: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PatientCreateRequest>({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    paymentOrigin: "private",
    sendInviteNow: true
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-[rgba(31,41,51,0.18)] backdrop-blur-sm">
      <div className="flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-[var(--color-border)] bg-[var(--color-surface-contrast)] px-6 py-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Novo paciente</h2>
          </div>
          <button className="rounded-2xl border border-[var(--color-border)] p-2" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="space-y-4 pb-6">
            <TextField
              label="Nome completo"
              onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
              value={form.fullName}
            />
            <TextField
              label="E-mail"
              onChange={(value) => setForm((current) => ({ ...current, email: value }))}
              value={form.email ?? ""}
            />
            <TextField
              label="Telefone"
              onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
              value={form.phone ?? ""}
            />
            <TextField
              label="Data de nascimento"
              onChange={(value) => setForm((current) => ({ ...current, birthDate: value }))}
              value={form.birthDate}
            />
            <SelectField
              label="Origem do pagamento"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  paymentOrigin: value as PatientCreateRequest["paymentOrigin"]
                }))
              }
              options={[
                { label: "Particular", value: "private" },
                { label: "Convênio", value: "insurance" }
              ]}
              value={form.paymentOrigin}
            />
            <label className="flex items-start gap-3 rounded-[24px] border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] px-4 py-3.5 transition hover:border-[rgba(15,76,92,0.22)]">
              <input
                checked={form.sendInviteNow}
                className="mt-1"
                onChange={(event) =>
                  setForm((current) => ({ ...current, sendInviteNow: event.target.checked }))
                }
                type="checkbox"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[var(--color-text)]">Enviar convite agora</span>
                <span className="mt-1 block text-sm leading-6 text-[var(--color-text-muted)]">
                  Cria o acesso inicial do paciente assim que o cadastro rápido for concluído.
                </span>
              </span>
            </label>
            {error ? (
              <p className="rounded-2xl bg-[rgba(178,74,58,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
                {error}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface-contrast)] pt-5">
          <Button onClick={onClose} type="button" variant="ghost">
            Cancelar
          </Button>
          <Button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                try {
                  setError(null);

                  if (!form.email && !form.phone) {
                    throw new Error("Informe pelo menos e-mail ou telefone.");
                  }

                  const response = await fetch("/api/patients", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                  });

                  if (!response.ok) {
                    throw new Error("Não foi possível criar o paciente.");
                  }

                  const payload = (await response.json()) as { redirectTo: string };
                  onCreated(payload.redirectTo);
                } catch (submitError) {
                  setError(
                    submitError instanceof Error
                      ? submitError.message
                      : "Erro inesperado ao criar paciente."
                  );
                }
              })
            }
            type="button"
          >
            <UserRoundPlus className="h-4 w-4" />
            {isPending ? "Criando..." : "Criar paciente"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none transition focus:border-[var(--color-primary)]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

const statusOptions = [
  { label: "Todos", value: "all" },
  { label: "Convidado", value: "invited" },
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
  { label: "Arquivado", value: "archived" }
];

const documentOptions = [
  { label: "Todos", value: "all" },
  { label: "Sem pendência", value: "ok" },
  { label: "Pendente", value: "pending" },
  { label: "Crítico", value: "critical" }
];

const financialOptions = [
  { label: "Todos", value: "all" },
  { label: "Sem pendência", value: "ok" },
  { label: "Em aberto", value: "open" },
  { label: "Vencido", value: "overdue" }
];
