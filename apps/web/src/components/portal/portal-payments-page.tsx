import Link from "next/link";
import type { PortalPaymentsResponse } from "@terapia/contracts";
import { Badge } from "@terapia/ui";

import { PortalHero, PortalPanel } from "./portal-surface";

export function PortalPaymentsPage({ data }: { data: PortalPaymentsResponse }) {
  return (
    <div className="space-y-6">
      <PortalHero
        badges={
          <>
            <Badge tone="info">Pagamentos</Badge>
            <Badge tone="warning">{data.summary.openAmountLabel} em aberto</Badge>
            <Badge tone="success">{data.summary.paidAmountLabel} pagos</Badge>
          </>
        }
        description="Veja o que está em aberto, confirme pagamentos e acompanhe o histórico financeiro ligado ao seu atendimento."
        stats={[
          {
            detail: "Total ainda em aberto.",
            label: "Em aberto",
            tone: "warning",
            value: data.summary.openAmountLabel
          },
          {
            detail: "Já confirmado no portal.",
            label: "Pagos",
            tone: "success",
            value: data.summary.paidAmountLabel
          }
        ]}
        title="Cobranças ligadas ao seu atendimento"
      />

      <PortalPanel description="Abra cada cobrança para ver detalhes e confirmar quando o pagamento já foi feito." title="Histórico financeiro">
          {data.items.map((item) => (
            <Link key={item.id} className="block rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-5 transition hover:bg-white" href={item.href}>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-lg font-semibold">{item.title}</p>
                <Badge tone={item.canPay ? "warning" : "success"}>{item.statusLabel}</Badge>
              </div>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.amountLabel} · {item.methodLabel}</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.dueLabel}</p>
            </Link>
          ))}
      </PortalPanel>
    </div>
  );
}
