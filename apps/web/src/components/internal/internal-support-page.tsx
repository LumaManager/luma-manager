import type { ReactNode } from "react";
import type { InternalSupportQueueResponse } from "@terapia/contracts";
import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

export function InternalSupportPage({ data }: { data: InternalSupportQueueResponse }) {
  return (
    <InternalSimpleTable
      badge="Suporte"
      title="Fila de suporte interno"
      description="Tickets operacionais com metadata do fluxo afetado, sem payload clínico."
      columns={["Tenant", "Categoria", "Prioridade", "Status", "Último evento"]}
      gridTemplate="1.8fr 1fr 0.7fr 1.1fr 1fr"
      rows={data.items.map((item) => [
        <div key={`${item.ticketId}-tenant`}><p className="font-semibold">{item.tenantName}</p><p className="mt-1 text-sm text-[rgba(255,255,255,0.62)]">{item.ticketId} · {item.flowLabel}</p></div>,
        item.categoryLabel,
        item.priorityLabel,
        <Badge key={`${item.ticketId}-status`} tone={item.priorityLabel === "Alta" ? "critical" : "warning"}>{item.statusLabel}</Badge>,
        <div key={`${item.ticketId}-event`}><p>{item.lastEventLabel}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-[rgba(255,255,255,0.46)]">{item.lastEventAtLabel}</p></div>
      ])}
    />
  );
}

function InternalSimpleTable({
  badge,
  title,
  description,
  columns,
  rows,
  gridTemplate
}: {
  badge: string;
  title: string;
  description: string;
  columns: string[];
  rows: ReactNode[][];
  gridTemplate?: string;
}) {
  gridTemplate ??= `repeat(${columns.length}, minmax(0, 1fr))`;
  return (
    <div className="space-y-6 text-white">
      <section className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-7">
        <Badge tone="warning">{badge}</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[rgba(255,255,255,0.7)]">{description}</p>
      </section>

      <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
        <CardHeader>
          <p className="text-lg font-semibold">Lista operacional</p>
        </CardHeader>
        <CardContent className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <div style={{ minWidth: "640px" }}>
              <div
                className="grid gap-4 border-b border-[rgba(255,255,255,0.08)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.5)]"
                style={{ gridTemplateColumns }}
              >
                {columns.map((column) => (
                  <span key={column}>{column}</span>
                ))}
              </div>
              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid items-center gap-4 border-b border-[rgba(255,255,255,0.08)] px-6 py-5 text-sm text-[rgba(255,255,255,0.72)]"
                  style={{ gridTemplateColumns }}
                >
                  {row.map((cell, cellIndex) => (
                    <div key={cellIndex}>{cell}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
