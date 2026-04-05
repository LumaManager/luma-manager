"use client";

import Link from "next/link";
import { useState } from "react";
import type { ClinicalReviewDetail, ClinicalReviewDraftUpdateRequest } from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";
import { FileStack, History, WandSparkles } from "lucide-react";

import { OperationalHero } from "@/components/shared/operational-surface";

type ClinicalReviewDetailPageProps = {
  initialDetail: ClinicalReviewDetail;
};

export function ClinicalReviewDetailPageView({
  initialDetail
}: ClinicalReviewDetailPageProps) {
  const [detail, setDetail] = useState(initialDetail);
  const [draft, setDraft] = useState<ClinicalReviewDraftUpdateRequest>(initialDetail.draftContent);
  const [isBusy, setIsBusy] = useState<null | "save" | "approve" | "discard" | "retry-transcript" | "retry-draft">(null);
  const [error, setError] = useState<string | null>(null);

  async function runAction(action: NonNullable<typeof isBusy>) {
    setIsBusy(action);
    setError(null);

    const routeMap = {
      save: {
        method: "PATCH",
        url: `/api/clinical-review/${detail.appointmentId}/draft`,
        body: JSON.stringify(draft)
      },
      approve: {
        method: "POST",
        url: `/api/clinical-review/${detail.appointmentId}/approve`
      },
      discard: {
        method: "POST",
        url: `/api/clinical-review/${detail.appointmentId}/discard`
      },
      "retry-transcript": {
        method: "POST",
        url: `/api/clinical-review/${detail.appointmentId}/retry-transcript`
      },
      "retry-draft": {
        method: "POST",
        url: `/api/clinical-review/${detail.appointmentId}/retry-draft`
      }
    } as const;

    const config = routeMap[action];
    const body = "body" in config ? config.body : undefined;
    const response = await fetch(config.url, {
      method: config.method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(payload?.message ?? "Não foi possível concluir a ação.");
      setIsBusy(null);
      return;
    }

    const payload = (await response.json()) as ClinicalReviewDetail;
    setDetail(payload);
    setDraft(payload.draftContent);
    setIsBusy(null);
  }

  return (
    <div className="space-y-6">
      <nav className="text-sm text-[var(--color-text-muted)]">
        <Link className="font-medium text-[var(--color-primary)]" href="/app/clinical-review">
          Revisão Clínica
        </Link>
        <span className="mx-2">/</span>
        <span>{detail.patientName}</span>
      </nav>

      <OperationalHero
        actions={
          <>
            <Button asChild variant="secondary">
              <Link href={detail.patientHref}>Abrir paciente</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/app/clinical-review">Voltar para fila</Link>
            </Button>
          </>
        }
        badges={
          <>
            <Badge tone={statusTone(detail.reviewState)}>{detail.reviewStateLabel}</Badge>
            <Badge tone={statusTone(detail.transcriptStatus)}>{detail.transcriptStatusLabel}</Badge>
            <Badge tone={statusTone(detail.draftStatus)}>{detail.draftStatusLabel}</Badge>
          </>
        }
        description={detail.sessionLabel}
        stats={[
          {
            detail: "Estado atual da fila clínica.",
            label: "Revisão",
            tone: statusTone(detail.reviewState),
            value: detail.reviewStateLabel
          },
          {
            detail: "Disponibilidade do insumo bruto processado.",
            label: "Transcript",
            tone: statusTone(detail.transcriptStatus),
            value: detail.transcriptStatusLabel
          },
          {
            detail: "Estado do rascunho antes da aprovação humana.",
            label: "Rascunho",
            tone: statusTone(detail.draftStatus),
            value: detail.draftStatusLabel
          }
        ]}
        title={detail.patientName}
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr_320px]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileStack className="h-4 w-4" />
              <p className="text-lg font-semibold">Transcript</p>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              O transcript é insumo. Ele não é editável nesta fase.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {detail.transcriptBlocks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--color-border)] p-4 text-sm leading-6 text-[var(--color-text-muted)]">
                Nenhum bloco disponível. A tela continua útil para revisão manual ou retry do
                pipeline.
              </div>
            ) : (
              detail.transcriptBlocks.map((block) => (
                <div
                  className="rounded-3xl border border-[var(--color-border)] bg-white p-4"
                  key={block.id}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    {block.timestampLabel} · {block.speakerLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{block.text}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <WandSparkles className="h-4 w-4" />
              <p className="text-lg font-semibold">Rascunho IA</p>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              A edição humana é central. Nada vira prontuário sem aprovação explícita.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditorField
              label="Resumo"
              onChange={(value) => setDraft((current) => ({ ...current, summary: value }))}
              value={draft.summary}
            />
            <EditorField
              label="Tópicos"
              onChange={(value) => setDraft((current) => ({ ...current, topics: value }))}
              value={draft.topics}
            />
            <EditorField
              label="Continuidade do caso"
              onChange={(value) => setDraft((current) => ({ ...current, continuity: value }))}
              value={draft.continuity}
            />
            <EditorField
              label="Pendências"
              onChange={(value) => setDraft((current) => ({ ...current, pending: value }))}
              value={draft.pending}
            />

            {error ? (
              <div className="rounded-3xl border border-[rgba(178,74,58,0.24)] bg-[rgba(178,74,58,0.08)] p-4 text-sm leading-6 text-[var(--color-danger)]">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button
                disabled={isBusy !== null || !detail.primaryActions.saveDraftEnabled}
                onClick={() => runAction("save")}
                type="button"
              >
                Salvar rascunho
              </Button>
              <Button
                disabled={isBusy !== null || !detail.primaryActions.approveEnabled}
                onClick={() => runAction("approve")}
                type="button"
                variant="secondary"
              >
                Aprovar como prontuário
              </Button>
              <Button
                disabled={isBusy !== null || !detail.primaryActions.discardEnabled}
                onClick={() => runAction("discard")}
                type="button"
                variant="ghost"
              >
                Descartar rascunho
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="text-lg font-semibold">Pipeline</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {detail.pipelineHighlights.map((item) => (
                <div
                  className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4"
                  key={item.label}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{item.value}</p>
                </div>
              ))}
              <Button
                className="w-full"
                disabled={isBusy !== null}
                onClick={() => runAction("retry-transcript")}
                type="button"
                variant="secondary"
              >
                Retry transcript
              </Button>
              <Button
                className="w-full"
                disabled={isBusy !== null}
                onClick={() => runAction("retry-draft")}
                type="button"
                variant="ghost"
              >
                Retry rascunho
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <p className="text-lg font-semibold">Histórico de versões</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {detail.versionHistory.map((version) => (
                <div
                  className="rounded-3xl border border-[var(--color-border)] bg-white p-4"
                  key={version.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{version.label}</p>
                    <Badge tone="neutral">{version.statusLabel}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {version.authorLabel} · {version.createdAtLabel}
                  </p>
                </div>
              ))}
              <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
                <p className="text-sm font-semibold">Última versão aprovada</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {detail.latestApprovedRecordMeta}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EditorField({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      <textarea
        className="min-h-[120px] w-full rounded-[24px] border border-[var(--color-border-strong)] bg-white px-4 py-4 outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function statusTone(status: string) {
  if (status === "ready" || status === "ready_for_review" || status === "approved") return "success";
  if (status === "processing" || status === "generating") return "info";
  if (status === "failed" || status === "blocked") return "critical";
  return "warning";
}
