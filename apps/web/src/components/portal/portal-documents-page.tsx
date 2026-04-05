import Link from "next/link";
import type { PortalDocumentsResponse } from "@terapia/contracts";
import { Badge } from "@terapia/ui";

import { PortalHero, PortalPanel } from "./portal-surface";

export function PortalDocumentsPage({ data }: { data: PortalDocumentsResponse }) {
  return (
    <div className="space-y-6">
      <PortalHero
        badges={
          <>
            <Badge tone="info">Documentos</Badge>
            <Badge tone="warning">{data.summary.pendingCount} pendente(s)</Badge>
            <Badge tone="success">{data.summary.signedCount} concluído(s)</Badge>
          </>
        }
        description="Revise o que precisa ser aceito antes do atendimento e mantenha as políticas do cuidado sempre acessíveis."
        stats={[
          {
            detail: "Aguardam sua assinatura ou aceite.",
            label: "Pendentes",
            tone: data.summary.pendingCount > 0 ? "warning" : "success",
            value: String(data.summary.pendingCount)
          },
          {
            detail: "Já concluídos neste portal.",
            label: "Concluídos",
            tone: "success",
            value: String(data.summary.signedCount)
          }
        ]}
        title="Aceites e políticas do seu atendimento"
      />

      <PortalPanel description="Abra cada item para ler, assinar e acompanhar o estado do documento." title="Lista de documentos">
          {data.items.map((item) => (
            <Link key={item.id} className="block rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-5 transition hover:bg-white" href={item.href}>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-lg font-semibold">{item.title}</p>
                <Badge tone={item.canSign ? "warning" : "success"}>{item.statusLabel}</Badge>
              </div>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.kindLabel}</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.issuedAtLabel} · {item.dueLabel}</p>
            </Link>
          ))}
      </PortalPanel>
    </div>
  );
}
