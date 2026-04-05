import type { PortalPaymentDetail } from "@terapia/contracts";
import { Badge } from "@terapia/ui";

import { PortalActionButton } from "./portal-action-button";
import { PortalHero, PortalPanel } from "./portal-surface";

export function PortalPaymentDetailPage({ detail }: { detail: PortalPaymentDetail }) {
  return (
    <div className="space-y-6">
      <PortalHero
        actions={
          detail.canPay ? (
            <PortalActionButton actionPath={`/api/portal/payments/${detail.id}/confirm`} pendingLabel="Confirmando pagamento...">
              Confirmar pagamento dummy
            </PortalActionButton>
          ) : undefined
        }
        badges={
          <>
            <Badge tone="info">Pagamento</Badge>
            <Badge tone={detail.canPay ? "warning" : "success"}>{detail.statusLabel}</Badge>
          </>
        }
        description={`${detail.amountLabel} · ${detail.methodLabel}`}
        stats={[
          {
            detail: "Prazo operacional desta cobrança.",
            label: "Vencimento",
            tone: detail.canPay ? "warning" : "success",
            value: detail.dueLabel
          },
          {
            detail: "Forma ou canal de pagamento.",
            label: "Método",
            tone: "info",
            value: detail.methodLabel
          }
        ]}
        title={detail.title}
      />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <PortalPanel description="Use estes dados para identificar a cobrança e confirmar o pagamento." title="Referência da cobrança">
          <div className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
            <p>{detail.beneficiaryLabel}</p>
            <p>{detail.referenceLabel}</p>
          </div>
        </PortalPanel>

        <PortalPanel description="Trilha simples para o paciente acompanhar o estado da cobrança." title="Timeline">
            {detail.timeline.map((item) => (
              <div key={item.id} className="rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-4">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{item.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{item.occurredAtLabel}</p>
              </div>
            ))}
        </PortalPanel>
      </section>
    </div>
  );
}
