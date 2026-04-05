import Link from "next/link";
import type { PortalAppointmentDetail } from "@terapia/contracts";
import { Badge } from "@terapia/ui";

import { PortalHero, PortalPanel } from "./portal-surface";

export function PortalAppointmentDetailPage({ detail }: { detail: PortalAppointmentDetail }) {
  return (
    <div className="space-y-6">
      <PortalHero
        actions={
          <Link
            className={`inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold ${
              detail.primaryCta.enabled ? "bg-[var(--color-primary)] text-white" : "bg-[rgba(22,42,56,0.08)] text-[var(--color-text-muted)]"
            }`}
            href={detail.primaryCta.href}
          >
            {detail.primaryCta.label}
          </Link>
        }
        badges={
          <>
            <Badge tone="info">Detalhe da sessão</Badge>
            <Badge tone={detail.primaryCta.enabled ? "success" : "warning"}>{detail.statusLabel}</Badge>
          </>
        }
        description={`${detail.therapistName} · ${detail.practiceName} · ${detail.modalityLabel}`}
        stats={[
          {
            detail: "Janela do atendimento.",
            label: "Horário",
            tone: "info",
            value: `${detail.dateLabel} · ${detail.timeLabel}`
          },
          {
            detail: "Momento certo para entrar na call.",
            label: "Entrada",
            tone: detail.primaryCta.enabled ? "success" : "warning",
            value: detail.primaryCta.label
          }
        ]}
        title="Sessão em detalhe"
      />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.95fr]">
        <PortalPanel description="Confira o que já está pronto e o que ainda precisa ser resolvido antes do atendimento." title="Checklist antes da sessão">
            {detail.prepItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">{item.label}</p>
                  <Badge tone={item.tone}>{item.statusLabel}</Badge>
                </div>
              </div>
            ))}
        </PortalPanel>

        <PortalPanel description="Tudo o que você precisa saber para acessar a sessão com tranquilidade." title="Acesso e contexto">
          <div className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
            <p>{detail.locationLabel}</p>
            <p>{detail.joinWindowLabel}</p>
            {detail.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </PortalPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <PortalPanel title="Documentos vinculados">
            {detail.documents.map((item) => (
              <Link key={item.id} className="block rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-4" href={item.href}>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.statusLabel}</p>
              </Link>
            ))}
        </PortalPanel>

        <PortalPanel title="Pagamentos vinculados">
            {detail.payments.map((item) => (
              <Link key={item.id} className="block rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-4" href={item.href}>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.amountLabel} · {item.statusLabel}</p>
              </Link>
            ))}
        </PortalPanel>
      </section>
    </div>
  );
}
