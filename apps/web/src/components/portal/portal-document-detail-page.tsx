import type { PortalDocumentDetail } from "@terapia/contracts";
import { Badge } from "@terapia/ui";

import { PortalActionButton } from "./portal-action-button";
import { PortalHero, PortalPanel } from "./portal-surface";

export function PortalDocumentDetailPage({ detail }: { detail: PortalDocumentDetail }) {
  return (
    <div className="space-y-6">
      <PortalHero
        actions={
          detail.canSign ? (
            <PortalActionButton actionPath={`/api/portal/documents/${detail.id}/sign`} pendingLabel="Assinando...">
              {detail.signCtaLabel}
            </PortalActionButton>
          ) : undefined
        }
        badges={
          <>
            <Badge tone="info">{detail.kindLabel}</Badge>
            <Badge tone={detail.canSign ? "warning" : "success"}>{detail.statusLabel}</Badge>
          </>
        }
        description={`Emitido para ${detail.patientName} · terapeuta ${detail.therapistName}`}
        stats={[
          {
            detail: "Data de emissão do documento.",
            label: "Emitido em",
            tone: "info",
            value: detail.issuedAtLabel
          },
          {
            detail: "Prazo para concluir este aceite.",
            label: "Prazo",
            tone: detail.canSign ? "warning" : "success",
            value: detail.dueLabel
          }
        ]}
        title={detail.title}
      />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.95fr]">
        <PortalPanel description="Leia os pontos principais antes de assinar." title="Resumo do documento">
            {detail.previewSections.map((section) => (
              <div key={section.id} className="rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-5">
                <p className="font-semibold">{section.heading}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{section.body}</p>
              </div>
            ))}
        </PortalPanel>

        <PortalPanel description="Veja o que já foi aceito e o que ainda depende da sua ação." title="Aceite e trilha">
            {detail.consentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-4">
                <p className="font-semibold">{item.label}</p>
                <Badge tone={item.statusLabel === "Concluído" ? "success" : "warning"}>{item.statusLabel}</Badge>
              </div>
            ))}
        </PortalPanel>
      </section>
    </div>
  );
}
