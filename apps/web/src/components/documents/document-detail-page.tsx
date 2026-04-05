"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  DocumentCreateResponse,
  DocumentDetail,
  DocumentOperationalImpact
} from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";
import { ArrowRight, Clock3, FilePlus2, FolderOpen, RotateCcw, ShieldAlert } from "lucide-react";

import { OperationalHero } from "@/components/shared/operational-surface";

type DocumentDetailPageProps = {
  initialData: DocumentDetail;
};

export function DocumentDetailPageView({ initialData }: DocumentDetailPageProps) {
  const router = useRouter();
  const [detail, setDetail] = useState(initialData);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function applyDetail(payload: DocumentDetail, message: string) {
    setDetail(payload);
    setFeedback(message);
    router.refresh();
  }

  async function postAction(
    path: string,
    message: string,
    confirmation?: string
  ) {
    if (confirmation && !window.confirm(confirmation)) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const response = await fetch(path, { method: "POST" });

      if (!response.ok) {
        setFeedback("Não foi possível concluir a ação agora.");
        return;
      }

      const payload = (await response.json()) as DocumentDetail;
      applyDetail(payload, message);
    });
  }

  async function generateNewVersion() {
    setFeedback(null);
    startTransition(async () => {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(detail.nextGenerationDefaults)
      });

      if (!response.ok) {
        setFeedback("Não foi possível gerar a nova versão agora.");
        return;
      }

      const payload = (await response.json()) as DocumentCreateResponse;
      router.push(payload.redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <nav className="text-sm text-[var(--color-text-muted)]">
        <Link className="font-medium text-[var(--color-primary)]" href="/app/documents">
          Documentos
        </Link>
        <span className="mx-2">/</span>
        <span>{detail.code}</span>
      </nav>

      <OperationalHero
        actions={
          <>
            <Button
              onClick={() =>
                void postAction(
                  `/api/documents/${detail.id}/resend`,
                  "Documento reenviado com sucesso."
                )
              }
              type="button"
              variant="secondary"
              disabled={!detail.primaryActions.canResend || isPending}
            >
              <RotateCcw className="h-4 w-4" />
              Reenviar
            </Button>
            <Button
              onClick={() => void generateNewVersion()}
              type="button"
              disabled={!detail.primaryActions.canGenerateNewVersion || isPending}
            >
              <FilePlus2 className="h-4 w-4" />
              Gerar nova versão
            </Button>
            <Button asChild type="button" variant="secondary">
              <Link href={detail.patientHref}>
                <FolderOpen className="h-4 w-4" />
                Abrir paciente
              </Link>
            </Button>
            <Button
              className="border-[rgba(178,74,58,0.22)] text-[var(--color-danger)]"
              onClick={() =>
                void postAction(
                  `/api/documents/${detail.id}/revoke`,
                  "Consentimento revogado e histórico preservado.",
                  "Revogar este documento e marcar o consentimento como revogado?"
                )
              }
              type="button"
              variant="secondary"
              disabled={!detail.primaryActions.canRevoke || isPending}
            >
              Revogar
            </Button>
          </>
        }
        badges={
          <>
            <Badge tone="info">{detail.documentTitle}</Badge>
            <Badge tone={detail.criticality === "critical" ? "critical" : detail.criticality === "attention" ? "warning" : "success"}>
              {detail.criticalityLabel}
            </Badge>
            <StatusBadge status={detail.signatureStatus} text={detail.signatureStatusLabel} />
            <StatusBadge status={detail.consentStatus} text={detail.consentStatusLabel} />
          </>
        }
        description={detail.criticalReason}
        stats={[
          {
            detail: detail.generatedAtLabel,
            label: "Código",
            tone: "neutral",
            value: detail.code
          },
          {
            detail: "Último disparo ou reenviado registrado.",
            label: "Envio",
            tone: "info",
            value: detail.lastSentAtLabel
          },
          {
            detail: "Leitura atual de risco operacional.",
            label: "Impacto",
            tone: detail.criticality === "critical" ? "critical" : detail.criticality === "attention" ? "warning" : "success",
            value: detail.criticalityLabel
          }
        ]}
        title={`${detail.documentTitle} · ${detail.templateVersion}`}
      />

      {detail.blockedFlowLabels.length > 0 ? (
        <Card className="border-[rgba(178,74,58,0.16)] bg-[rgba(178,74,58,0.04)]">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[var(--color-danger)]" />
                <p className="font-semibold text-[var(--color-danger)]">Impacto operacional ativo</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                Este documento afeta agora: {detail.blockedFlowLabels.join(" · ")}.
              </p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/app/documents">
                Voltar para a fila
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {feedback ? (
        <div className="rounded-2xl border border-[rgba(15,76,92,0.12)] bg-[rgba(15,76,92,0.04)] px-4 py-3 text-sm text-[var(--color-primary)]">
          {feedback}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="text-lg font-semibold">Visualizacao do documento</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {detail.fileReferenceLabel}. No MVP visual, o foco e contexto e rastreabilidade, nao
                edicao juridica inline.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {detail.previewSections.map((section) => (
                <div
                  className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4"
                  key={section.title}
                >
                  <p className="text-sm font-semibold">{section.title}</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--color-text-muted)]">
                    {section.body}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-lg font-semibold">Impactos operacionais</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Estados que precisam refletir em dashboard, agenda, ficha do paciente e call.
              </p>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {detail.operationalImpacts.map((impact) => (
                <ImpactCard impact={impact} key={impact.id} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                <p className="text-lg font-semibold">Historico de eventos</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {detail.timeline.map((event) => (
                <div
                  className="rounded-3xl border border-[var(--color-border)] bg-white p-4"
                  key={event.id}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">{event.title}</p>
                    <Badge tone="neutral">{event.actorLabel}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {event.description}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                    {event.occurredAtLabel}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="text-lg font-semibold">Contexto</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem label="Paciente" value={detail.patientName} />
              <InfoItem label="Contato" value={detail.patientContactLabel} />
              <InfoItem label="Contexto" value={detail.sessionContextLabel} />
              <InfoItem label="Canal" value={detail.deliveryChannelLabel} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-lg font-semibold">Estados</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem label="Assinatura" value={detail.signatureStatusLabel} />
              <InfoItem label="Consentimento" value={detail.consentStatusLabel} />
              <InfoItem label="Assinado por" value={detail.signedByLabel} />
              <InfoItem label="Responsavel legal" value={detail.legalRepresentativeLabel} />
              <InfoItem label="Ultimo evento" value={`${detail.lastEventLabel} · ${detail.lastEventAtLabel}`} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  text
}: {
  status: DocumentDetail["signatureStatus"] | DocumentDetail["consentStatus"];
  text: string;
}) {
  const tone =
    status === "signed" || status === "valid"
      ? "success"
      : status === "pending"
        ? "warning"
        : status === "expired" || status === "revoked"
          ? "critical"
          : "neutral";

  return <Badge tone={tone}>{text}</Badge>;
}

function ImpactCard({ impact }: { impact: DocumentOperationalImpact }) {
  const toneClass =
    impact.tone === "critical"
      ? "border-[rgba(178,74,58,0.16)] bg-[rgba(178,74,58,0.04)]"
      : impact.tone === "warning"
        ? "border-[rgba(198,122,69,0.16)] bg-[rgba(198,122,69,0.06)]"
        : impact.tone === "success"
          ? "border-[rgba(63,107,97,0.16)] bg-[rgba(63,107,97,0.06)]"
          : "border-[var(--color-border)] bg-[rgba(15,76,92,0.03)]";

  return (
    <div className={`rounded-3xl border p-4 ${toneClass}`}>
      <p className="font-semibold">{impact.title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{impact.description}</p>
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
