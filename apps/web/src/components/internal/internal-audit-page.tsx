import type { InternalAuditResponse } from "@terapia/contracts";
import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

export function InternalAuditPage({ data }: { data: InternalAuditResponse }) {
  return (
    <div className="space-y-6 text-white">
      <section className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-7">
        <Badge tone="warning">Auditoria</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">Eventos sensiveis sem replicar dado clinico</h2>
        <p className="mt-3 text-sm leading-7 text-[rgba(255,255,255,0.7)]">
          O log mostra metadata de acesso e alteracao, nao o conteudo acessado.
        </p>
      </section>

      <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
        <CardHeader>
          <p className="text-lg font-semibold">Eventos recentes</p>
        </CardHeader>
        <CardContent className="space-y-2 p-4">
          {data.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">{item.eventLabel}</p>
                  <p className="mt-1 text-sm text-[rgba(255,255,255,0.62)]">
                    {item.actorLabel} · {item.moduleLabel} · {item.tenantLabel}
                  </p>
                  <p className="mt-1 text-sm text-[rgba(255,255,255,0.62)]">{item.targetLabel}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge tone={item.sensitivityLabel === "Interno" ? "info" : "warning"}>{item.sensitivityLabel}</Badge>
                  <p className="text-xs uppercase tracking-[0.12em] text-[rgba(255,255,255,0.38)]">{item.occurredAtLabel}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
