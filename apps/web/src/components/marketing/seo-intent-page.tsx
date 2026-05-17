import type { ElementType } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge, Card, CardContent } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import {
  PublicPageShell,
  PublicSectionCard,
} from "@/components/marketing/public-page-shell";

type IntentItem = {
  description: string;
  icon: ElementType;
  title: string;
};

type WorkflowStep = {
  description: string;
  title: string;
};

type SeoIntentPageProps = {
  badges: readonly string[];
  benefits: readonly IntentItem[];
  bullets: readonly string[];
  description: string;
  fitDescription: string;
  fitItems: readonly string[];
  fitTitle: string;
  pageType: string;
  previewItems: readonly IntentItem[];
  previewTitle: string;
  primaryCtaLocation: string;
  secondaryCtaLocation: string;
  title: string;
  workflowDescription: string;
  workflowEyebrow: string;
  workflowSteps: readonly WorkflowStep[];
  workflowTitle: string;
};

export function SeoIntentPage({
  badges,
  benefits,
  bullets,
  description,
  fitDescription,
  fitItems,
  fitTitle,
  pageType,
  previewItems,
  previewTitle,
  primaryCtaLocation,
  secondaryCtaLocation,
  title,
  workflowDescription,
  workflowEyebrow,
  workflowSteps,
  workflowTitle,
}: SeoIntentPageProps) {
  return (
    <PublicPageShell>
      <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_46%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_30%,rgba(255,255,255,0.04)_50%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {badges.map((badge) => (
                  <Badge
                    key={badge}
                    tone="neutral"
                    className="bg-[rgba(255,255,255,0.12)] text-white"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.55rem,4vw,4.35rem)] font-semibold leading-[0.98] tracking-normal">
                {title}
              </h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                {description}
              </p>

              <div className="mt-7 grid gap-3 sm:max-w-2xl">
                {bullets.map((bullet) => (
                  <HeroBullet key={bullet} text={bullet} />
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Solicitar demo"
                  ctaLocation={primaryCtaLocation}
                  href="/solicitar-demo"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Solicitar demo
                  <ArrowRight className="h-4 w-4" />
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver segurança e privacidade"
                  ctaLocation={secondaryCtaLocation}
                  href="/seguranca-e-privacidade"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.18)] px-5 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]"
                >
                  Ver segurança e privacidade
                </TrackedCtaLink>
              </div>
            </div>

            <Card className="overflow-hidden border-[rgba(255,255,255,0.14)] bg-[rgba(255,253,248,0.98)] shadow-[0_22px_60px_rgba(7,24,29,0.24)]">
              <CardContent className="space-y-4 p-6 text-[var(--color-text)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  {previewTitle}
                </p>
                <div className="space-y-3">
                  {previewItems.map(
                    ({
                      description: itemDescription,
                      icon: Icon,
                      title: itemTitle,
                    }) => (
                      <MiniCard
                        key={itemTitle}
                        description={itemDescription}
                        icon={Icon}
                        title={itemTitle}
                      />
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {benefits.map(
            ({
              description: itemDescription,
              icon: Icon,
              title: itemTitle,
            }) => (
              <PublicSectionCard
                key={itemTitle}
                description={itemDescription}
                title={itemTitle}
              >
                <Icon className="h-5 w-5 text-[var(--color-primary)]" />
              </PublicSectionCard>
            )
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <PublicSectionCard
            eyebrow={workflowEyebrow}
            title={workflowTitle}
            description={workflowDescription}
          >
            <div className="grid gap-3 md:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <StepCard
                  key={step.title}
                  number={String(index + 1).padStart(2, "0")}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="Para quem faz sentido"
            title={fitTitle}
            description={fitDescription}
          >
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
              {fitItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                  {item}
                </li>
              ))}
            </ul>
          </PublicSectionCard>
        </div>

        <PublicSectionCard
          eyebrow="Próximo passo"
          title="Quer validar esse fluxo no seu consultório?"
          description="A demo ajuda a comparar sua rotina atual com um fluxo mais organizado de agenda, pacientes, documentos e cobranças."
        >
          <TrackedCtaLink
            ctaLabel="Solicitar demo"
            ctaLocation={`${pageType}_footer_primary`}
            href="/solicitar-demo"
            pageType={pageType}
            className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
          >
            Solicitar demo
          </TrackedCtaLink>
        </PublicSectionCard>
      </div>
    </PublicPageShell>
  );
}

function HeroBullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.16)]">
        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
      </div>
      <p className="text-sm leading-7 text-[rgba(255,255,255,0.82)]">{text}</p>
    </div>
  );
}

function MiniCard({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: ElementType;
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[rgba(15,76,92,0.08)]">
        <Icon className="h-4 w-4 text-[var(--color-primary)]" />
      </div>
      <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">
        {title}
      </p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  description,
  number,
  title,
}: {
  description: string;
  number: string;
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
        {number}
      </p>
      <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">
        {title}
      </p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
        {description}
      </p>
    </div>
  );
}
