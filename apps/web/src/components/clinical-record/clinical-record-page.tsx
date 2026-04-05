"use client";

import Link from "next/link";
import { useState } from "react";
import type { PatientClinicalRecord } from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader, cn } from "@terapia/ui";
import { ArrowRight, Clock3, FileStack, History, UserRound } from "lucide-react";

import { OperationalHero } from "@/components/shared/operational-surface";

type ClinicalRecordPageProps = {
  initialRecord: PatientClinicalRecord;
};

export function ClinicalRecordPageView({ initialRecord }: ClinicalRecordPageProps) {
  const [selectedEntry, setSelectedEntry] = useState(initialRecord.selectedEntry);

  return (
    <div className="space-y-6">
      <nav className="text-sm text-[var(--color-text-muted)]">
        <Link className="font-medium text-[var(--color-primary)]" href="/app/patients">
          Pacientes
        </Link>
        <span className="mx-2">/</span>
        <Link className="font-medium text-[var(--color-primary)]" href={initialRecord.patientHref}>
          {initialRecord.patientName}
        </Link>
        <span className="mx-2">/</span>
        <span>Prontuário</span>
      </nav>

      <OperationalHero
        actions={
          <>
            <Button asChild variant="secondary">
              <Link href={initialRecord.patientHref}>
                <UserRound className="h-4 w-4" />
                Abrir ficha do paciente
              </Link>
            </Button>
            {initialRecord.pendingReviewMeta.exists ? (
              <Button asChild>
                <Link href={initialRecord.pendingReviewMeta.href}>
                  Abrir revisão pendente
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost">
              <Link href="/app/patients">Voltar para pacientes</Link>
            </Button>
          </>
        }
        badges={
          <>
            <Badge tone="info">Registro final do caso</Badge>
            <Badge tone="success">{initialRecord.totalApprovedRecords} entradas aprovadas</Badge>
            {initialRecord.pendingReviewMeta.exists ? <Badge tone="warning">Revisão pendente</Badge> : null}
          </>
        }
        description="Leitura histórica do caso com foco em registros finais aprovados. Transcript e rascunho continuam fora da visão principal desta tela."
        stats={[
          {
            detail: "Entradas finais já aprovadas.",
            label: "Aprovadas",
            tone: "success",
            value: String(initialRecord.totalApprovedRecords)
          },
          {
            detail: initialRecord.latestApprovedRecordMeta,
            label: "Última aprovada",
            tone: "info",
            value: selectedEntry.currentVersionLabel
          },
          {
            detail: initialRecord.pendingReviewMeta.exists
              ? initialRecord.pendingReviewMeta.label
              : "Nenhum material novo aguardando revisão.",
            label: "Nova revisão",
            tone: initialRecord.pendingReviewMeta.exists ? "warning" : "success",
            value: initialRecord.pendingReviewMeta.exists ? "Pendente" : "Em dia"
          }
        ]}
        title="Prontuário longitudinal"
      />

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <p className="text-lg font-semibold">Timeline clínica</p>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              Mais recente primeiro. Apenas entradas já aprovadas aparecem aqui.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {initialRecord.timeline.map((entry) => (
              <button
                className={cn(
                  "w-full rounded-3xl border px-4 py-4 text-left transition",
                  selectedEntry.id === entry.id
                    ? "border-[var(--color-primary)] bg-[rgba(15,76,92,0.06)]"
                    : "border-[var(--color-border)] bg-white hover:bg-[rgba(15,76,92,0.03)]"
                )}
                key={entry.id}
                onClick={() => {
                  const full = initialRecord.entries.find((item) => item.id === entry.id);
                  if (full) setSelectedEntry(full);
                }}
                type="button"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {entry.isLatest ? <Badge tone="success">Atual</Badge> : <Badge tone="neutral">Histórico</Badge>}
                </div>
                <p className="mt-3 font-semibold">{entry.sessionLabel}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {entry.approvalLabel} · {entry.approvedByLabel}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileStack className="h-4 w-4" />
                <p className="text-lg font-semibold">Entrada selecionada</p>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                {selectedEntry.sessionLabel} · {selectedEntry.currentVersionLabel}
              </p>
            </CardHeader>
            <CardContent className="grid gap-4">
              <EntryBlock label="Resumo" value={selectedEntry.content.summary} />
              <EntryBlock label="Tópicos" value={selectedEntry.content.topics} />
              <EntryBlock label="Continuidade do caso" value={selectedEntry.content.continuity} />
              <EntryBlock label="Pendências" value={selectedEntry.content.pending} />
            </CardContent>
          </Card>

          <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
            <Card>
              <CardHeader>
                <p className="text-lg font-semibold">Metadata de aprovação</p>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <InfoItem label="Sessão" value={selectedEntry.sessionLabel} />
                <InfoItem label="Aprovada em" value={selectedEntry.approvedAtLabel} />
                <InfoItem label="Autor" value={selectedEntry.approvedByLabel} />
                <InfoItem label="Versão atual" value={selectedEntry.currentVersionLabel} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  <p className="text-lg font-semibold">Versões aprovadas</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedEntry.versions.map((version) => (
                  <div
                    className="rounded-3xl border border-[var(--color-border)] bg-white p-4"
                    key={version.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{version.label}</p>
                      <Badge tone="neutral">{version.approvedByLabel}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                      {version.approvedAtLabel}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {initialRecord.pendingReviewMeta.exists ? (
            <Card>
              <CardHeader>
                <Badge tone="warning">Material novo aguardando revisão</Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                  {initialRecord.pendingReviewMeta.label}. O prontuário final atual continua sendo a
                  verdade vigente até nova aprovação.
                </p>
                <Button asChild variant="secondary">
                  <Link href={initialRecord.pendingReviewMeta.href}>Abrir revisão</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EntryBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--color-text-muted)]">
        {value}
      </p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{value}</p>
    </div>
  );
}
