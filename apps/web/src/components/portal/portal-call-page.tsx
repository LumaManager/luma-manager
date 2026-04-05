import type { PortalCall } from "@terapia/contracts";
import { Badge } from "@terapia/ui";

import { PortalHero, PortalPanel } from "./portal-surface";

export function PortalCallPage({ call }: { call: PortalCall }) {
  return (
    <div className="space-y-6">
      <PortalHero
        badges={
          <>
            <Badge tone="info">Entrada da sessão</Badge>
            <Badge tone={call.status === "waiting_room" ? "success" : "warning"}>
              {call.status === "waiting_room" ? "Waiting room" : "Pré-entrada"}
            </Badge>
          </>
        }
        description={`${call.patientName}, sua sessão com ${call.therapistName} está preparada para o web.`}
        stats={[
          {
            detail: "Sala preparada para o atendimento.",
            label: "Sala",
            tone: "info",
            value: call.roomLabel
          },
          {
            detail: "Momento atual da entrada.",
            label: "Estado",
            tone: call.status === "waiting_room" ? "success" : "warning",
            value: call.status === "waiting_room" ? "Waiting room" : "Pré-entrada"
          }
        ]}
        title={call.sessionLabel}
      />

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.95fr]">
        <PortalPanel description="Confira câmera, áudio e ambiente antes de entrar na sessão." title="Checklist técnico">
            {call.deviceChecklist.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-4">
                <p className="font-semibold">{item.label}</p>
                <Badge tone={item.tone}>{item.statusLabel}</Badge>
              </div>
            ))}
        </PortalPanel>

        <PortalPanel description="Combinados e lembretes que devem estar visíveis antes da entrada." title="Avisos do portal">
            {call.notices.map((notice) => (
              <div key={notice.id} className="rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-4">
                <Badge tone={notice.tone}>{notice.title}</Badge>
                <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{notice.description}</p>
              </div>
            ))}
        </PortalPanel>
      </section>
    </div>
  );
}
