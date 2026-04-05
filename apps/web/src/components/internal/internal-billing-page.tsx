import type { InternalBillingResponse } from "@terapia/contracts";
import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

export function InternalBillingPage({ data }: { data: InternalBillingResponse }) {
  return (
    <div className="space-y-6 text-white">
      <section className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-7">
        <Badge tone="warning">Billing interno</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">Operacao financeira SaaS</h2>
        <p className="mt-3 text-sm leading-7 text-[rgba(255,255,255,0.7)]">
          Esta area trata assinatura da plataforma e inadimplencia do cliente, nao cobranca do paciente final.
        </p>
      </section>

      <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
        <CardHeader>
          <p className="text-lg font-semibold">Fila de billing ops</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.items.map((item) => (
            <div key={item.id} className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{item.tenantName}</p>
                  <p className="mt-1 text-sm text-[rgba(255,255,255,0.62)]">{item.planLabel} · {item.invoiceLabel}</p>
                </div>
                <Badge tone={item.subscriptionStatusLabel === "Inadimplente" ? "critical" : "warning"}>
                  {item.subscriptionStatusLabel}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <InfoItem label="Valor" value={item.amountLabel} />
                <InfoItem label="Ultimo evento" value={item.lastEventLabel} />
                <InfoItem label="Atualizado" value={item.lastEventAtLabel} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.68)]">{value}</p>
    </div>
  );
}
