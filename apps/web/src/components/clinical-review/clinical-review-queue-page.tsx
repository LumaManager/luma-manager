"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { ClinicalReviewQueueResponse } from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader, cn } from "@terapia/ui";
import { ArrowRight, Search, SlidersHorizontal, Sparkles, TriangleAlert } from "lucide-react";

import { OperationalHero, ToolbarPanel } from "@/components/shared/operational-surface";

type ClinicalReviewQueuePageProps = {
  initialData: ClinicalReviewQueueResponse;
};

export function ClinicalReviewQueuePageView({
  initialData
}: ClinicalReviewQueuePageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialData.filters.search);
  const [reviewState, setReviewState] = useState(initialData.filters.reviewState);
  const [transcriptStatus, setTranscriptStatus] = useState(initialData.filters.transcriptStatus);
  const [draftStatus, setDraftStatus] = useState(initialData.filters.draftStatus);
  const [slaState, setSlaState] = useState(initialData.filters.slaState);
  const [failuresOnly, setFailuresOnly] = useState(initialData.filters.failuresOnly);
  const [thisWeekOnly, setThisWeekOnly] = useState(initialData.filters.thisWeekOnly);
  const [transcriptDisabledOnly, setTranscriptDisabledOnly] = useState(
    initialData.filters.transcriptDisabledOnly
  );

  const chips = useMemo(() => {
    const values: string[] = [];
    if (reviewState !== "all") values.push(`Estado: ${reviewState}`);
    if (transcriptStatus !== "all") values.push(`Transcript: ${transcriptStatus}`);
    if (draftStatus !== "all") values.push(`Rascunho: ${draftStatus}`);
    if (slaState !== "all") values.push(`SLA: ${slaState}`);
    if (failuresOnly) values.push("Só falhas");
    if (thisWeekOnly) values.push("Desta semana");
    if (transcriptDisabledOnly) values.push("Transcript desativado");
    return values;
  }, [draftStatus, failuresOnly, reviewState, slaState, thisWeekOnly, transcriptDisabledOnly, transcriptStatus]);
  const readyCount = initialData.items.filter((item) => item.reviewState === "ready_for_review").length;
  const blockedCount = initialData.items.filter((item) => item.reviewState === "blocked").length;
  const overdueCount = initialData.items.filter((item) => item.slaState === "overdue").length;
  const failedPipelineCount = initialData.items.filter(
    (item) => item.transcriptStatus === "failed" || item.draftStatus === "failed"
  ).length;

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    setOrDelete(params, "search", search);
    setOrDelete(params, "reviewState", reviewState === "all" ? "" : reviewState);
    setOrDelete(params, "transcriptStatus", transcriptStatus === "all" ? "" : transcriptStatus);
    setOrDelete(params, "draftStatus", draftStatus === "all" ? "" : draftStatus);
    setOrDelete(params, "slaState", slaState === "all" ? "" : slaState);
    setOrDelete(params, "failuresOnly", failuresOnly ? "true" : "");
    setOrDelete(params, "thisWeekOnly", thisWeekOnly ? "true" : "");
    setOrDelete(params, "transcriptDisabledOnly", transcriptDisabledOnly ? "true" : "");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    setSearch("");
    setReviewState("all");
    setTranscriptStatus("all");
    setDraftStatus("all");
    setSlaState("all");
    setFailuresOnly(false);
    setThisWeekOnly(false);
    setTranscriptDisabledOnly(false);
    router.replace(pathname);
  }

  return (
    <div className="space-y-6">
      <OperationalHero
        actions={
          <Button
            asChild
            className="text-white visited:text-white active:text-white hover:text-white [&_svg]:text-white"
            disabled={initialData.nextItemHref.length === 0}
          >
            <Link href={initialData.nextItemHref || "#"}>
              Abrir próximo item
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
        badges={
          <>
            <Badge tone="info">Inbox pós-sessão</Badge>
            <Badge tone={initialData.total > 0 ? "warning" : "success"}>
              {initialData.total > 0 ? `${initialData.total} itens pendentes` : "Fila limpa"}
            </Badge>
          </>
        }
        description="Revise sessões pendentes e feche o registro clínico com segurança, sem expor texto clínico sensível na lista."
        stats={[
          {
            detail: "Prontas para virar prontuário aprovado.",
            label: "Prontas",
            tone: readyCount > 0 ? "success" : "neutral",
            value: String(readyCount)
          },
          {
            detail: "Itens bloqueados por dependência ou falha.",
            label: "Bloqueadas",
            tone: blockedCount > 0 ? "critical" : "neutral",
            value: String(blockedCount)
          },
          {
            detail: "Sessões fora do prazo de revisão.",
            label: "SLA",
            tone: overdueCount > 0 ? "critical" : "success",
            value: String(overdueCount)
          },
          {
            detail: "Transcript ou rascunho pedindo retry.",
            label: "Pipeline",
            tone: failedPipelineCount > 0 ? "warning" : "success",
            value: String(failedPipelineCount)
          }
        ]}
        title="Revisão Clínica"
      />

      <ToolbarPanel
        actions={
          <>
            <Button onClick={applyFilters} type="button" variant="secondary">
              Aplicar
            </Button>
            <Button onClick={clearFilters} type="button" variant="ghost">
              Limpar filtros
            </Button>
          </>
        }
        description="Recorte a fila por estado de revisão, transcript, rascunho e SLA sem perder visibilidade dos casos que exigem retry."
        footer={
          <div className="flex flex-wrap gap-3">
            <Chip checked={failuresOnly} label="Apenas falhas" onToggle={setFailuresOnly} />
            <Chip checked={thisWeekOnly} label="Apenas esta semana" onToggle={setThisWeekOnly} />
            <Chip
              checked={transcriptDisabledOnly}
              label="Transcript desativado"
              onToggle={setTranscriptDisabledOnly}
            />
            {chips.map((chip) => (
              <Badge key={chip} tone="neutral">
                {chip}
              </Badge>
            ))}
          </div>
        }
        title="Filtrar e priorizar"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_repeat(4,minmax(0,1fr))]">
          <label className="flex h-12 min-w-0 items-center gap-3 rounded-2xl border border-[var(--color-border-strong)] bg-white px-4">
            <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
            <input
              className="w-full bg-transparent outline-none"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por paciente ou data da sessão"
              value={search}
            />
          </label>
          <SelectField
            label="Estado"
            onChange={(value) => setReviewState(value as typeof reviewState)}
            options={[
              ["all", "Todos"],
              ["ready_for_review", "Pronto para revisar"],
              ["in_review", "Em revisão"],
              ["blocked", "Bloqueado"],
              ["processing", "Processando"]
            ]}
            value={reviewState}
          />
          <SelectField
            label="Transcript"
            onChange={(value) => setTranscriptStatus(value as typeof transcriptStatus)}
            options={[
              ["all", "Todos"],
              ["ready", "Pronto"],
              ["processing", "Processando"],
              ["failed", "Falha"],
              ["disabled", "Desativado"]
            ]}
            value={transcriptStatus}
          />
          <SelectField
            label="Rascunho"
            onChange={(value) => setDraftStatus(value as typeof draftStatus)}
            options={[
              ["all", "Todos"],
              ["ready", "Pronto"],
              ["generating", "Gerando"],
              ["failed", "Falha"],
              ["disabled", "Desativado"]
            ]}
            value={draftStatus}
          />
          <SelectField
            label="SLA"
            onChange={(value) => setSlaState(value as typeof slaState)}
            options={[
              ["all", "Todos"],
              ["within_sla", "Dentro do prazo"],
              ["attention", "Atenção"],
              ["overdue", "Atrasado"]
            ]}
            value={slaState}
          />
        </div>
        <div className="flex gap-3 xl:hidden">
          <Button onClick={applyFilters} type="button" variant="secondary">
            Aplicar
          </Button>
          <Button onClick={clearFilters} type="button" variant="ghost">
            Limpar filtros
          </Button>
        </div>
      </ToolbarPanel>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">Fila principal</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Ordenação operacional por prioridade atual, não alfabética.
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
                <p className="text-lg font-semibold">Nenhuma sessão aguardando revisão agora.</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  A fila principal ficou limpa. Quando novas sessões entrarem no pipeline pós-sessão,
                  elas aparecerão aqui com prioridade e SLA visuais.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[minmax(0,1.9fr)_1.1fr_0.9fr_0.9fr_0.8fr_1fr] items-center gap-4 border-b border-[var(--color-border)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                <span>Paciente</span>
                <span>Sessão</span>
                <span>Transcript</span>
                <span>Rascunho IA</span>
                <span>SLA</span>
                <span>Estado</span>
              </div>
              {initialData.items.map((item) => (
                <Link
                  className="grid grid-cols-[minmax(0,1.9fr)_1.1fr_0.9fr_0.9fr_0.8fr_1fr] items-center gap-4 border-b border-[var(--color-border)] px-6 py-5 transition hover:bg-[rgba(15,76,92,0.03)]"
                  href={item.openHref}
                  key={item.appointmentId}
                >
                  <div className="flex min-h-[84px] min-w-0 flex-col justify-center">
                    <p className="truncate font-semibold">{item.patientName}</p>
                    <p className="mt-1 truncate text-sm text-[var(--color-text-muted)]">
                      {item.endedAtLabel}
                    </p>
                  </div>
                  <div className="flex min-h-[84px] flex-col justify-center text-sm text-[var(--color-text-muted)]">
                    <p className="font-medium text-[var(--color-text)]">{item.sessionLabel}</p>
                    <div className="mt-1">{item.modalityLabel}</div>
                  </div>
                  <div className="flex min-h-[84px] items-center">
                    <StateBadge kind="transcript" value={item.transcriptStatus} />
                  </div>
                  <div className="flex min-h-[84px] items-center">
                    <StateBadge kind="draft" value={item.draftStatus} />
                  </div>
                  <div className="flex min-h-[84px] items-center">
                    <SlaBadge value={item.slaState} label={item.slaLabel} />
                  </div>
                  <div className="flex min-h-[84px] items-center">
                    <StateBadge kind="review" value={item.reviewState} />
                  </div>
                </Link>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
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
  options: Array<[string, string]>;
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
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function Chip({
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
      {checked ? <Sparkles className="h-3.5 w-3.5" /> : <TriangleAlert className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}

function StateBadge({
  kind,
  value
}: {
  kind: "transcript" | "draft" | "review";
  value: string;
}) {
  if (kind === "transcript") {
    const map = {
      not_started: { tone: "neutral", label: "Não iniciado" },
      processing: { tone: "info", label: "Processando" },
      ready: { tone: "success", label: "Pronto" },
      failed: { tone: "critical", label: "Falha" },
      disabled: { tone: "warning", label: "Desativado" }
    } as const;
    const status = map[value as keyof typeof map] ?? { tone: "neutral", label: value };
    return <Badge className="w-full justify-center px-4 text-center" tone={status.tone}>{status.label}</Badge>;
  }

  if (kind === "draft") {
    const map = {
      not_started: { tone: "neutral", label: "Não iniciado" },
      waiting_transcript: { tone: "warning", label: "Aguardando transcript" },
      generating: { tone: "info", label: "Gerando" },
      ready: { tone: "success", label: "Pronto" },
      failed: { tone: "critical", label: "Falha" },
      disabled: { tone: "warning", label: "Desativado" }
    } as const;
    const status = map[value as keyof typeof map] ?? { tone: "neutral", label: value };
    return <Badge className="w-full justify-center px-4 text-center" tone={status.tone}>{status.label}</Badge>;
  }

  const map = {
    processing: { tone: "info", label: "Processando" },
    ready_for_review: { tone: "success", label: "Pronto para revisar" },
    in_review: { tone: "warning", label: "Em revisão" },
    blocked: { tone: "critical", label: "Bloqueado" },
    approved: { tone: "success", label: "Aprovado" },
    discarded: { tone: "neutral", label: "Descartado" }
  } as const;
  const status = map[value as keyof typeof map] ?? { tone: "neutral", label: value };
  return <Badge className="w-full justify-center px-4 text-center" tone={status.tone}>{status.label}</Badge>;
}

function SlaBadge({
  label,
  value
}: {
  label: string;
  value: ClinicalReviewQueueResponse["items"][number]["slaState"];
}) {
  const tone = value === "overdue" ? "critical" : value === "attention" ? "warning" : "success";
  return <Badge className="w-full justify-center px-4 text-center" tone={tone}>{label}</Badge>;
}
