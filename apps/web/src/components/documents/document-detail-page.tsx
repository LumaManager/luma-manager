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
import { Clock3, FilePlus2, FolderOpen, RotateCcw, ShieldAlert } from "lucide-react";

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

  async function postAction(path: string, message: string, confirmation?: string) {
    if (confirmation && !window.confirm(confirmation)) return;
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
        headers: { "Content-Type": "application/json" },
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
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--color-text-muted)]">
        <Link className="font-medium text-[var(--color-primary)]" href="/app/documents">
          Documentos
        </Link>
        <span className="mx-2">/</span>
        <span>{detail.code}</span>
      </nav>

      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--color-text)]">{detail.documentTitle}</h1>
            <StatusBadge status={detail.signatureStatus} text={detail.signatureStatusLabel} />
            {detail.criticality === "critical" || detail.criticality === "attention" ? (
              <Badge tone={detail.criticality === "critical" ? "critical" : "warning"}>
                {detail.criticalityLabel}
              </Badge>
            ) : null}
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            {detail.patientName} · {detail.code} · v{detail.templateVersion}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={!detail.primaryActions.canResend || isPending}
            onClick={() =>
              void postAction(`/api/documents/${detail.id}/resend`, "Documento reenviado com sucesso.")
            }
            type="button"
            variant="secondary"
          >
            <RotateCcw className="h-4 w-4" />
            Reenviar
          </Button>
          <Button
            disabled={!detail.primaryActions.canGenerateNewVersion || isPending}
            onClick={() => void generateNewVersion()}
            type="button"
          >
            <FilePlus2 className="h-4 w-4" />
            Nova versão
          </Button>
          <Button asChild type="button" variant="secondary">
            <Link href={detail.patientHref}>
              <FolderOpen className="h-4 w-4" />
              Paciente
            </Link>
          </Button>
          <Button
            className="border-[rgba(178,74,58,0.22)] text-[var(--color-danger)]"
            disabled={!detail.primaryActions.canRevoke || isPending}
            onClick={() =>
              void postAction(
                `/api/documents/${detail.id}/revoke`,
                "Consentimento revogado e histórico preservado.",
                "Revogar este documento e marcar o consentimento como revogado?"
              )
            }
            type="button"
            variant="secondary"
          >
            Revogar
          </Button>
        </div>
      </div>

      {/* Operational block alert */}
      {detail.blockedFlowLabels.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(178,74,58,0.22)] bg-[rgba(178,74,58,0.05)] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-[var(--color-danger)]" />
            <p className="text-sm font-medium text-[var(--color-danger)]">
              Bloqueia: {detail.blockedFlowLabels.join(" · ")}
            </p>
          </div>
          <Button asChild variant="ghost" className="h-8 px-3 text-xs">
            <Link href="/app/documents">Ver fila de pendências</Link>
          </Button>
        </div>
      ) : null}

      {/* Feedback toast */}
      {feedback ? (
        <div className="rounded-2xl border border-[rgba(15,76,92,0.12)] bg-[rgba(15,76,92,0.04)] px-4 py-3 text-sm text-[var(--color-primary)]">
          {feedback}
        </div>
      ) : null}

      {/* Main content */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Left: preview + timeline */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="text-base font-semibold">Conteúdo do documento</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {detail.previewSections.map((section) => (
                <div
                  className="rounded-2xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.02)] p-4"
                  key={section.title}
                >
                  <p className="text-sm font-semibold">{section.title}</p>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-[var(--color-text-muted)]">
                    {section.body}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[var(--color-text-muted)]" />
                <p className="text-base font-semibold">Histórico</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {detail.timeline.map((event) => (
                <div
                  className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-4"
                  key={event.id}
                >
                  <div>
                    <p className="text-sm font-semibold">{event.title}</p>
                    <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">
                      {event.description}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                      {event.occurredAtLabel}
                    </p>
                  </div>
                  <Badge tone="neutral">{event.actorLabel}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: context sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="text-base font-semibold">Sobre este documento</p>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <SidebarRow label="Paciente" value={detail.patientName} />
                <SidebarRow label="Contato" value={detail.patientContactLabel} />
                <SidebarRow label="Canal" value={detail.deliveryChannelLabel} />
                <SidebarRow label="Enviado" value={detail.lastSentAtLabel} />
                <SidebarRow label="Gerado" value={detail.generatedAtLabel} />
                <div className="h-px bg-[var(--color-border)]" />
                <SidebarRow label="Assinatura" value={detail.signatureStatusLabel} />
                <SidebarRow label="Consentimento" value={detail.consentStatusLabel} />
                {detail.signedByLabel ? (
                  <SidebarRow label="Assinado por" value={detail.signedByLabel} />
                ) : null}
                {detail.legalRepresentativeLabel ? (
                  <SidebarRow label="Responsável legal" value={detail.legalRepresentativeLabel} />
                ) : null}
              </dl>
            </CardContent>
          </Card>

          {detail.operationalImpacts.length > 0 ? (
            <Card>
              <CardHeader>
                <p className="text-base font-semibold">Impactos</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {detail.operationalImpacts.map((impact) => (
                  <ImpactCard impact={impact} key={impact.id} />
                ))}
              </CardContent>
            </Card>
          ) : null}
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
    <div className={`rounded-2xl border p-3 ${toneClass}`}>
      <p className="text-sm font-semibold">{impact.title}</p>
      <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">{impact.description}</p>
    </div>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-[var(--color-text-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--color-text)]">{value}</dd>
    </div>
  );
}
