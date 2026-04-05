import Link from "next/link";
import type { PortalAppointmentsResponse } from "@terapia/contracts";
import { Badge } from "@terapia/ui";

import { PortalHero, PortalPanel } from "./portal-surface";

export function PortalAppointmentsPage({ data }: { data: PortalAppointmentsResponse }) {
  return (
    <div className="space-y-6">
      <PortalHero
        badges={
          <>
            <Badge tone="info">Sessões</Badge>
            <Badge tone={data.pendingTasks.length > 0 ? "warning" : "success"}>
              {data.pendingTasks.length > 0 ? `${data.pendingTasks.length} pendência(s)` : "Tudo em dia"}
            </Badge>
          </>
        }
        description="Revise pendências operacionais, abra o detalhe da sessão e entre na call sem depender de app nativo."
        stats={[
          {
            detail: "Sessões visíveis para o paciente.",
            label: "Agenda",
            tone: "info",
            value: String(data.items.length)
          },
          {
            detail: "Itens a concluir antes da próxima sessão.",
            label: "Pendências",
            tone: data.pendingTasks.length > 0 ? "warning" : "success",
            value: String(data.pendingTasks.length)
          }
        ]}
        title="Tudo o que você precisa para a próxima sessão está aqui."
      />

      <section className="grid gap-4 lg:grid-cols-[0.95fr_minmax(0,1.35fr)]">
        <PortalPanel
          description="Resolva primeiro o que pode bloquear sua entrada, confirmação ou preparo."
          title="Pendências atuais"
        >
            {data.pendingTasks.map((task) => (
              <Link
                key={task.id}
                className="block rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-4 transition hover:bg-white"
                href={task.href}
              >
                <p className="font-semibold">{task.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{task.description}</p>
                <p className="mt-3 text-sm font-semibold text-[var(--color-primary)]">{task.ctaLabel}</p>
              </Link>
            ))}
        </PortalPanel>

        <PortalPanel
          description="Abra o detalhe da sessão, confira o checklist e entre na call no momento certo."
          title="Agenda do paciente"
        >
            {data.items.map((item) => (
              <Link
                key={item.id}
                className="grid gap-4 rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-5 transition hover:bg-white lg:grid-cols-[minmax(0,1fr)_auto]"
                href={item.href}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold">{item.dateLabel}</p>
                    <Badge tone={item.callHref ? "success" : "neutral"}>{item.statusLabel}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    {item.timeLabel} · {item.modalityLabel} · {item.therapistName}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.locationLabel}</p>
                  <p className="mt-3 text-sm font-semibold text-[var(--color-primary)]">{item.checklistLabel}</p>
                </div>
                <div className="flex items-center">
                  <span className="rounded-2xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white">
                    Abrir sessão
                  </span>
                </div>
              </Link>
            ))}
        </PortalPanel>
      </section>
    </div>
  );
}
