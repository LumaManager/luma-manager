import type { TherapistDashboard } from "@terapia/contracts";

import { DashboardHeader } from "./dashboard-header";
import { ActionItemsList, AgendaList, RecentActivityList } from "./operational-list";
import { QuickActions } from "./quick-actions";
import { SummaryCard } from "./summary-card";

type DashboardPageProps = {
  data: TherapistDashboard;
};

export function DashboardPage({ data }: DashboardPageProps) {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <QuickActions actions={data.quickActions} />

      <section className="space-y-4">
        <div className="grid gap-4 2xl:grid-cols-3">
          <SummaryCard state={data.cards.upcomingAppointments}>
            {data.upcomingAppointments.map((item) => (
              <div className="flex items-center justify-between gap-4" key={item.id}>
                <div className="min-w-0">
                  <p className="font-medium">{item.patientName}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {new Date(item.startsAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}{" "}
                    · {item.paymentLabel}
                  </p>
                </div>
                <a className="text-sm font-semibold text-[var(--color-primary)]" href={item.ctaHref}>
                  {item.ctaLabel}
                </a>
              </div>
            ))}
          </SummaryCard>

          <SummaryCard state={data.cards.clinicalReview}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-[rgba(178,74,58,0.08)] p-4">
                <p className="text-sm font-semibold text-[var(--color-danger)]">Atrasados</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--color-danger)]">
                  {data.clinicalReviewSummary.overdueCount}
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  de {data.clinicalReviewSummary.totalPending} pendentes
                </p>
              </div>
              <div className="rounded-3xl bg-[rgba(15,76,92,0.05)] p-4">
                <p className="text-sm font-semibold">Sem revisão há mais tempo</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {data.clinicalReviewSummary.oldestPendingLabel}
                </p>
              </div>
            </div>
          </SummaryCard>

          <SummaryCard state={data.cards.documents}>
            <div className="rounded-3xl bg-[rgba(198,122,69,0.08)] p-4">
              <p className="text-sm font-semibold">Pacientes afetados</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                {data.documentSummary.affectedPatientsLabel}
              </p>
            </div>
          </SummaryCard>

          <SummaryCard state={data.cards.finance}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-[rgba(15,76,92,0.05)] p-4">
                <p className="text-sm font-semibold">Em aberto</p>
                <p className="mt-2 text-2xl font-semibold">{data.financialSummary.openCharges}</p>
              </div>
              <div className="rounded-3xl bg-[rgba(198,122,69,0.08)] p-4">
                <p className="text-sm font-semibold">Vencidas</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--color-accent)]">
                  {data.financialSummary.overdueCharges}
                </p>
              </div>
            </div>
          </SummaryCard>

          <SummaryCard state={data.cards.recentPatients}>
            {data.recentPatients.slice(0, 3).map((patient) => (
              <div className="flex items-center justify-between gap-4" key={patient.id}>
                <div className="min-w-0">
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {patient.nextSessionLabel} · {patient.statusLabel}
                  </p>
                </div>
                <a className="text-sm font-semibold text-[var(--color-primary)]" href={patient.patientHref}>
                  Abrir
                </a>
              </div>
            ))}
          </SummaryCard>

        </div>
      </section>

      <section className="grid gap-4 2xl:grid-cols-[1.2fr_1fr]">
        <AgendaList
          description="Sessões do dia em ordem cronológica."
          items={data.todayAgenda}
          title="Agenda de hoje"
        />
        <ActionItemsList
          description="Pendências que precisam da sua atenção agora."
          items={data.actionItems}
          title="Itens que exigem ação"
        />
      </section>

      <RecentActivityList
        description="Últimas mudanças relevantes na sua conta."
        items={data.recentActivity}
        title="Atividade recente"
      />
    </div>
  );
}
