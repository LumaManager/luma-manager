import type { TherapistOnboardingBootstrap } from "@terapia/contracts";

import { Badge } from "@terapia/ui";

import { OnboardingWizard } from "./onboarding-wizard";

type OnboardingPageProps = {
  initialData: TherapistOnboardingBootstrap;
};

export function OnboardingPage({ initialData }: OnboardingPageProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[var(--color-border)] bg-[rgba(255,253,248,0.82)] p-7 shadow-[var(--shadow-panel)]">
        <Badge tone="warning">Ativação assistida da prática</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">
          Onboarding do terapeuta
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-muted)]">
          Este wizard existe para colocar a conta em estado seguro de operação. Ele coleta o mínimo
          regulatório e operacional antes de liberar pacientes, agenda, cobrança e atendimento.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--color-text-muted)]">
          <Badge tone="neutral">{initialData.estimatedMinutesLabel}</Badge>
          <Badge tone="neutral">{initialData.modeLabel}</Badge>
        </div>
      </section>

      <OnboardingWizard initialData={initialData} />
    </div>
  );
}
