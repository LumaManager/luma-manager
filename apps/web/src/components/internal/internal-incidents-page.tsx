import type { InternalIncidentsResponse } from "@terapia/contracts";
import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

export function InternalIncidentsPage({ data }: { data: InternalIncidentsResponse }) {
  return (
    <div className="space-y-6 text-white">
      <section className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-7">
        <Badge tone="warning">Incidentes</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">Controle operacional de incidentes</h2>
        <p className="mt-3 text-sm leading-7 text-[rgba(255,255,255,0.7)]">
          Centraliza abertura, mitigacao e acompanhamento sem substituir observabilidade tecnica.
        </p>
      </section>

      <div className="space-y-4">
        {data.items.map((item) => (
          <Card key={item.incidentId} className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-[rgba(255,255,255,0.66)]">
                  {item.ownerLabel} · {item.impactedTenantsLabel}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge tone={item.severityLabel === "Alta" ? "critical" : "warning"}>{item.severityLabel}</Badge>
                <Badge tone="info">{item.statusLabel}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.timeline.map((event) => (
                <div key={event.id} className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
                  <p className="font-semibold">{event.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.68)]">{event.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[rgba(255,255,255,0.46)]">{event.occurredAtLabel}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
