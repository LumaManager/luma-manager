"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition, type ReactNode } from "react";
import type {
  ChargeCreateRequest,
  ChargeCreateResponse,
  FinanceExportResponse,
  FinanceListResponse
} from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader, cn } from "@terapia/ui";
import {
  ArrowRight,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";

import { OperationalHero, ToolbarPanel } from "@/components/shared/operational-surface";

type FinancePageProps = {
  initialData: FinanceListResponse;
};

export function FinancePageView({ initialData }: FinancePageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState(initialData.filters.search);
  const [status, setStatus] = useState(initialData.filters.status);
  const [originType, setOriginType] = useState(initialData.filters.originType);
  const [period, setPeriod] = useState(initialData.filters.period);
  const [overdueOnly, setOverdueOnly] = useState(initialData.filters.overdueOnly);
  const [withoutAppointmentOnly, setWithoutAppointmentOnly] = useState(
    initialData.filters.withoutAppointmentOnly
  );
  const [isPending, startTransition] = useTransition();
  const [createForm, setCreateForm] = useState({
    patientId: initialData.patientOptions[0]?.value ?? "",
    amount: "220,00",
    dueDate: "03/04/2026",
    originType: "private" as ChargeCreateRequest["originType"],
    appointmentId: ""
  });

  const appointmentOptions = useMemo(
    () =>
      initialData.appointmentOptions.filter(
        (option) => option.patientId === createForm.patientId || option.patientId.length === 0
      ),
    [createForm.patientId, initialData.appointmentOptions]
  );

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (status !== "all") chips.push(`Status: ${labelForStatus(status)}`);
    if (originType !== "all") chips.push(`Origem: ${labelForOrigin(originType)}`);
    if (period !== "current_month") chips.push(`Período: ${labelForPeriod(period)}`);
    if (overdueOnly) chips.push("Apenas vencidas");
    if (withoutAppointmentOnly) chips.push("Sem sessão vinculada");
    return chips;
  }, [originType, overdueOnly, period, status, withoutAppointmentOnly]);

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    setOrDelete(params, "search", search);
    setOrDelete(params, "status", status === "all" ? "" : status);
    setOrDelete(params, "originType", originType === "all" ? "" : originType);
    setOrDelete(params, "period", period === "current_month" ? "" : period);
    setOrDelete(params, "overdueOnly", overdueOnly ? "true" : "");
    setOrDelete(params, "withoutAppointmentOnly", withoutAppointmentOnly ? "true" : "");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setOriginType("all");
    setPeriod("current_month");
    setOverdueOnly(false);
    setWithoutAppointmentOnly(false);
    router.replace(pathname);
  }

  async function handleExport() {
    setFeedback(null);
    startTransition(async () => {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (originType !== "all") params.set("originType", originType);
      if (period !== "current_month") params.set("period", period);
      if (overdueOnly) params.set("overdueOnly", "true");
      if (withoutAppointmentOnly) params.set("withoutAppointmentOnly", "true");

      const response = await fetch(`/api/finance/export${params.toString() ? `?${params.toString()}` : ""}`);

      if (!response.ok) {
        setFeedback("Não foi possível preparar a exportação agora.");
        return;
      }

      const payload = (await response.json()) as FinanceExportResponse;
      setFeedback(`Exportacao pronta: ${payload.filename} com ${payload.rowCount} linha(s).`);
    });
  }

  async function handleCreateCharge() {
    setFeedback(null);
    startTransition(async () => {
      const amountCents = parseCurrencyToCents(createForm.amount);
      const dueDate = parseDisplayDateToIso(createForm.dueDate);

      if (!Number.isFinite(amountCents) || amountCents < 1) {
        setFeedback("Informe um valor válido em reais.");
        return;
      }

      if (!dueDate) {
        setFeedback("Informe o vencimento em dd/mm/aaaa.");
        return;
      }

      const response = await fetch("/api/charges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patientId: createForm.patientId,
          amountCents,
          dueDate,
          originType: createForm.originType,
          appointmentId: createForm.appointmentId
        } satisfies ChargeCreateRequest)
      });

      if (!response.ok) {
        setFeedback("Não foi possível criar a cobrança agora.");
        return;
      }

      const payload = (await response.json()) as ChargeCreateResponse;
      setIsCreateOpen(false);
      router.push(payload.redirectTo);
      router.refresh();
    });
  }

  return (
    <>
      <div className="space-y-6">
        <OperationalHero
          actions={
            <>
              <Button onClick={() => setIsCreateOpen(true)} type="button">
                <Plus className="h-4 w-4" />
                Nova cobrança
              </Button>
              <Button onClick={() => void handleExport()} type="button" variant="secondary">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </>
          }
          badges={
            <>
              <Badge tone="info">Cobrança-first</Badge>
              {initialData.summary.totalOverdueCents > 0 ? (
                <Badge tone="critical">Vencidas exigem ataque hoje</Badge>
              ) : (
                <Badge tone="success">Sem vencidas críticas no período</Badge>
              )}
            </>
          }
          description="Acompanhe cobranças, pagamentos e pendências financeiras do consultório sem cair em contabilidade pesada."
          stats={[
            {
              detail: `Período: ${initialData.summary.periodLabel}.`,
              label: "Total cobrado",
              tone: "info",
              value: initialData.summary.totalChargedLabel
            },
            {
              detail: "Baixas registradas no recorte atual.",
              label: "Recebido",
              tone: "success",
              value: initialData.summary.totalReceivedLabel
            },
            {
              detail: "Cobranças ainda dentro do prazo.",
              label: "Em aberto",
              tone: initialData.summary.totalOpenCents > 0 ? "warning" : "neutral",
              value: initialData.summary.totalOpenLabel
            },
            {
              detail: "Fila crítica de tratativa financeira.",
              label: "Vencido",
              tone: initialData.summary.totalOverdueCents > 0 ? "critical" : "neutral",
              value: initialData.summary.totalOverdueLabel
            }
          ]}
          supportingText={`Resumo atual: ${initialData.summary.periodLabel}.`}
          title="Financeiro"
        />

        <ToolbarPanel
          actions={
            <>
              <Button onClick={applyFilters} type="button" variant="secondary">
                Aplicar
              </Button>
              <Button onClick={() => setIsAdvancedOpen(true)} type="button" variant="ghost">
                <SlidersHorizontal className="h-4 w-4" />
                Extras
              </Button>
            </>
          }
          description="Filtre a fila por estado da cobrança, origem e período sem esconder o recorte de atraso e itens sem sessão vinculada."
          footer={
            <>
              <div className="flex flex-wrap gap-3">
                {activeChips.map((chip) => (
                  <Badge key={chip} tone="neutral">
                    {chip}
                  </Badge>
                ))}
                {activeChips.length > 0 ? (
                  <button
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 text-[11px] font-semibold leading-none whitespace-nowrap text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-raised)]"
                    onClick={clearFilters}
                    type="button"
                  >
                    <X className="h-3.5 w-3.5" />
                    Limpar filtros
                  </button>
                ) : null}
              </div>

              {feedback ? (
                <div className="rounded-2xl border border-[rgba(15,76,92,0.12)] bg-[rgba(15,76,92,0.04)] px-4 py-3 text-sm text-[var(--color-primary)]">
                  {feedback}
                </div>
              ) : null}
            </>
          }
          title="Triar e cobrar"
        >
          <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
            <label className="flex h-12 items-center gap-3 rounded-2xl border border-[var(--color-border-strong)] bg-white px-4">
              <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                className="w-full bg-transparent outline-none"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por paciente, referencia ou valor"
                value={search}
              />
            </label>
            <SelectField
              label="Status"
              onChange={(value) => setStatus(value as typeof status)}
              options={statusOptions}
              value={status}
            />
            <SelectField
              label="Origem"
              onChange={(value) => setOriginType(value as typeof originType)}
              options={originOptions}
              value={originType}
            />
            <SelectField
              label="Período"
              onChange={(value) => setPeriod(value as typeof period)}
              options={periodOptions}
              value={period}
            />
            <div className="flex gap-3">
              <Button className="xl:hidden" onClick={applyFilters} type="button" variant="secondary">
                Aplicar
              </Button>
              <Button className="xl:hidden" onClick={() => setIsAdvancedOpen(true)} type="button" variant="ghost">
                <SlidersHorizontal className="h-4 w-4" />
                Extras
              </Button>
            </div>
          </div>
        </ToolbarPanel>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">Fila de cobranças</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {initialData.total} cobrança(s) no filtro atual, ordenadas por urgência operacional.
              </p>
            </div>
            <Badge tone="neutral">
              <SlidersHorizontal className="mr-2 inline h-3.5 w-3.5" />
              Lista-first
            </Badge>
          </CardHeader>
          <CardContent className="overflow-hidden p-0">
            {initialData.items.length === 0 ? (
              <div className="p-6">
                <div className="rounded-[28px] border border-dashed border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-6">
                  <p className="text-lg font-semibold">
                    {activeChips.length > 0
                      ? "Nenhuma cobrança corresponde aos filtros atuais."
                      : "Ainda não há cobranças registradas."}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {activeChips.length > 0
                      ? "Ajuste os filtros ou limpe a busca para voltar a ver a fila completa."
                      : "Use o drawer de nova cobrança para iniciar a operação financeira do consultório."}
                  </p>
                  <div className="mt-4 flex gap-3">
                    {activeChips.length > 0 ? (
                      <Button onClick={clearFilters} type="button" variant="secondary">
                        Limpar filtros
                      </Button>
                    ) : (
                      <Button onClick={() => setIsCreateOpen(true)} type="button">
                        Nova cobrança
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1.45fr)_0.9fr_0.95fr_0.85fr_1.15fr] gap-4 border-b border-[var(--color-border)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  <span>Paciente</span>
                  <span>Cobranca</span>
                  <span>Origem</span>
                  <span>Vencimento</span>
                  <span>Valor</span>
                  <span>Status</span>
                </div>
                {initialData.items.map((item) => (
                  <div
                    className={cn(
                      "grid cursor-pointer grid-cols-[minmax(0,1.3fr)_minmax(0,1.45fr)_0.9fr_0.95fr_0.85fr_1.15fr] gap-4 border-b border-[var(--color-border)] px-6 py-5 transition hover:bg-[rgba(15,76,92,0.03)]",
                      item.status === "overdue" && "bg-[rgba(178,74,58,0.04)]"
                    )}
                    key={item.chargeId}
                    onClick={() => router.push(item.chargeHref)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(item.chargeHref);
                      }
                    }}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{item.patientName}</p>
                      <p className="mt-1 truncate text-sm text-[var(--color-text-muted)]">
                        {item.code}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{item.appointmentLabel}</p>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        {item.lastEventLabel} · {item.lastEventAtLabel}
                      </p>
                    </div>
                    <div>
                      <Badge tone={item.originType === "private" ? "info" : "warning"}>
                        {item.originLabel}
                      </Badge>
                    </div>
                    <div className="text-sm text-[var(--color-text-muted)]">{item.dueAtLabel}</div>
                    <div className="font-semibold">{item.amountLabel}</div>
                    <div className="space-y-3">
                      <StatusBadge status={item.status} text={item.statusLabel} />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            router.push(item.patientHref);
                          }}
                          type="button"
                          variant="ghost"
                        >
                          Paciente
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <SidePanel
        description="Use recortes simples para destacar cobranças vencidas ou itens sem sessão vinculada."
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        title="Filtros extras"
      >
        <div className="space-y-3">
          <ChipToggle checked={overdueOnly} label="Apenas vencidas" onToggle={setOverdueOnly} />
          <ChipToggle
            checked={withoutAppointmentOnly}
            label="Sem sessão vinculada"
            onToggle={setWithoutAppointmentOnly}
          />
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => {
              setIsAdvancedOpen(false);
              applyFilters();
            }}
            type="button"
            variant="secondary"
          >
            Aplicar filtros
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              setIsAdvancedOpen(false);
            }}
            type="button"
            variant="ghost"
          >
            Limpar
          </Button>
        </div>
      </SidePanel>

      <SidePanel
        description="Crie cobranças operacionais sem transformar a tela em billing enterprise."
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nova cobrança"
      >
        <div className="space-y-4">
          <SelectField
            label="Paciente"
            onChange={(value) => setCreateForm((current) => ({ ...current, patientId: value, appointmentId: "" }))}
            options={initialData.patientOptions}
            value={createForm.patientId}
          />
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Valor
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--color-text-muted)]">
                R$
              </span>
              <input
                className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] pl-12 pr-4 outline-none"
                inputMode="decimal"
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, amount: formatCurrencyInput(event.target.value) }))
                }
                placeholder="0,00"
                type="text"
                value={createForm.amount}
              />
            </div>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Vencimento
            </span>
            <input
              className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] px-4 outline-none"
              inputMode="numeric"
              onChange={(event) =>
                setCreateForm((current) => ({ ...current, dueDate: formatDateInput(event.target.value) }))
              }
              placeholder="dd/mm/aaaa"
              type="text"
              value={createForm.dueDate}
            />
          </label>
          <SelectField
            label="Origem do pagamento"
            onChange={(value) =>
              setCreateForm((current) => ({
                ...current,
                originType: value as ChargeCreateRequest["originType"]
              }))
            }
            options={originOptions.filter((option) => option.value !== "all")}
            value={createForm.originType}
          />
          <SelectField
            label="Sessão relacionada"
            onChange={(value) => setCreateForm((current) => ({ ...current, appointmentId: value }))}
            options={[{ label: "Sem sessão vinculada", value: "" }, ...appointmentOptions]}
            value={createForm.appointmentId}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={() => void handleCreateCharge()} type="button" disabled={isPending}>
            <ArrowRight className="h-4 w-4" />
            Criar e abrir cobrança
          </Button>
          <Button onClick={() => setIsCreateOpen(false)} type="button" variant="ghost">
            Fechar
          </Button>
        </div>
      </SidePanel>
    </>
  );
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value.length === 0) params.delete(key);
  else params.set(key, value);
}

function formatCurrencyInput(value: string) {
  const sanitized = value.replace(/[^\d,.\s]/g, "").replace(/\./g, ",").replace(/\s/g, "");
  const [rawWhole = "", rawDecimals = ""] = sanitized.split(",");
  const whole = rawWhole.replace(/\D/g, "");
  const decimals = rawDecimals.replace(/\D/g, "").slice(0, 2);

  if (!sanitized.includes(",")) {
    return whole;
  }

  return `${whole.length > 0 ? whole : "0"},${decimals}`;
}

function parseCurrencyToCents(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.round(amount * 100) : Number.NaN;
}

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseDisplayDateToIso(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const isoDate = `${year}-${month}-${day}`;
  const parsed = new Date(`${isoDate}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  if (
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCDate() !== Number(day)
  ) {
    return null;
  }

  return isoDate;
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
  onToggle: (value: boolean) => void;
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

function SidePanel({
  children,
  description,
  isOpen,
  onClose,
  title
}: {
  children: ReactNode;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(12,24,27,0.24)] p-4">
      <button aria-label="Fechar painel" className="absolute inset-0" onClick={onClose} type="button" />
      <div className="relative h-full w-full max-w-xl overflow-y-auto rounded-[32px] border border-[var(--color-border)] bg-white p-6 shadow-[0_30px_90px_rgba(12,24,27,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.02em]">{title}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
          </div>
          <Button onClick={onClose} type="button" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  text
}: {
  status: FinanceListResponse["items"][number]["status"];
  text: string;
}) {
  const tone =
    status === "paid" ? "success" : status === "pending" ? "warning" : status === "overdue" ? "critical" : "neutral";

  return <Badge tone={tone}>{text}</Badge>;
}

function labelForStatus(value: string) {
  const map = {
    pending: "Pendente",
    paid: "Pago",
    overdue: "Vencido",
    canceled: "Cancelado"
  } as const;

  return map[value as keyof typeof map] ?? value;
}

function labelForOrigin(value: string) {
  const map = {
    private: "Particular",
    insurance: "Convenio"
  } as const;

  return map[value as keyof typeof map] ?? value;
}

function labelForPeriod(value: string) {
  const map = {
    all: "Tudo",
    current_month: "Mes atual",
    next_30_days: "Proximos 30 dias",
    last_30_days: "Ultimos 30 dias"
  } as const;

  return map[value as keyof typeof map] ?? value;
}

const statusOptions = [
  { label: "Todos", value: "all" },
  { label: "Pendente", value: "pending" },
  { label: "Pago", value: "paid" },
  { label: "Vencido", value: "overdue" },
  { label: "Cancelado", value: "canceled" }
];

const originOptions = [
  { label: "Todas", value: "all" },
  { label: "Particular", value: "private" },
  { label: "Convenio", value: "insurance" }
];

const periodOptions = [
  { label: "Mes atual", value: "current_month" },
  { label: "Proximos 30 dias", value: "next_30_days" },
  { label: "Ultimos 30 dias", value: "last_30_days" },
  { label: "Tudo", value: "all" }
];
