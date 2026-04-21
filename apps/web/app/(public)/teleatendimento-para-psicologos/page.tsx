import type { Metadata } from "next";
import type { ElementType } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
  Video,
  ClipboardCheck
} from "lucide-react";
import { Badge, Card, CardContent } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";

export const metadata: Metadata = {
  title: "Teleatendimento para psicólogos | Luma Manager",
  description:
    "Teleatendimento para psicólogos autônomos com rotina mais previsível, consentimento organizado e menos atrito na operação remota.",
  alternates: {
    canonical: "/teleatendimento-para-psicologos"
  }
};

const pageType = "teleatendimento_para_psicologos_page";

const benefits = [
  {
    icon: Video,
    title: "Rotina remota mais previsível",
    description:
      "A sessão online entra como parte do fluxo clínico, não como uma operação separada e difícil de controlar."
  },
  {
    icon: ClipboardCheck,
    title: "Consentimento e alinhamento",
    description:
      "Organize o que precisa ficar claro antes do atendimento e reduza o improviso na conversa inicial."
  },
  {
    icon: ShieldCheck,
    title: "Menos risco operacional",
    description:
      "Combine teleatendimento com uma estrutura de privacidade e acesso mais fácil de explicar ao cliente."
  }
] as const;

export default function TeleatendimentoParaPsicologosPage() {
  return (
    <PublicPageShell>
      <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warning" className="bg-[rgba(255,255,255,0.14)] text-white">
                  Teleatendimento
                </Badge>
                <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                  Para psicólogos autônomos
                </Badge>
              </div>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.3vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                Teleatendimento para psicólogos com uma rotina remota mais clara e menos improviso.
              </h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                Se parte da sua operação acontece online, o desafio não é só fazer a sessão
                acontecer. É manter organização, consentimento, privacidade e continuidade sem
                espalhar o fluxo em vários lugares.
              </p>

              <div className="mt-7 grid gap-3 sm:max-w-2xl">
                <HeroBullet text="Organize o atendimento remoto sem tratar a sessão online como um caso à parte." />
                <HeroBullet text="Deixe consentimento, orientação inicial e histórico perto do fluxo clínico." />
                <HeroBullet text="Reduza o improviso quando o paciente está fora do consultório." />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Solicitar demo"
                  ctaLocation="teleatendimento_page_hero_primary"
                  href="/solicitar-demo"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Solicitar demo
                  <ArrowRight className="h-4 w-4" />
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver segurança e privacidade"
                  ctaLocation="teleatendimento_page_hero_secondary"
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
                  O que o fluxo precisa cobrir
                </p>
                <div className="space-y-3">
                  <MiniCard
                    icon={Video}
                    title="Sessão remota"
                    description="A rotina online precisa continuar operacional mesmo fora do consultório."
                  />
                  <MiniCard
                    icon={MessageSquareText}
                    title="Alinhamento inicial"
                    description="O paciente entende o que esperar antes de começar a sessão."
                  />
                  <MiniCard
                    icon={ShieldCheck}
                    title="Controle e privacidade"
                    description="Teleatendimento precisa reforçar confiança, não aumentar dúvida."
                  />
                </div>
                <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.04)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Posicionamento</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    O objetivo aqui é mostrar que atendimento remoto também pode ser organizado,
                    documentado e fácil de explicar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {benefits.map(({ description, icon: Icon, title }) => (
            <PublicSectionCard key={title} description={description} title={title}>
              <Icon className="h-5 w-5 text-[var(--color-primary)]" />
            </PublicSectionCard>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <PublicSectionCard
            eyebrow="Como funciona"
            title="Teleatendimento exige menos atrito e mais previsibilidade"
            description="O fluxo certo reduz dúvidas antes da sessão e evita ruído depois."
          >
            <div className="grid gap-3 md:grid-cols-3">
              <StepCard
                number="01"
                title="Antes da sessão"
                description="Alinhe o básico para o atendimento remoto começar sem improviso."
              />
              <StepCard
                number="02"
                title="Durante a operação"
                description="Mantenha o caso e os combinados organizados para acompanhar o processo."
              />
              <StepCard
                number="03"
                title="Depois do encontro"
                description="Registre continuidade, pendências e documentos sem dispersão."
              />
            </div>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="Para quem faz sentido"
            title="Bom encaixe para quem atende parte da carteira online"
            description="Perfeito para profissionais que precisam de mais ordem no remoto sem criar nova bagunça."
          >
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Psicólogo que faz parte dos atendimentos por videochamada.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Profissional que quer consentimento e organização mais claros.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Consultório que quer comunicar segurança sem soar burocrático.
              </li>
            </ul>
          </PublicSectionCard>
        </div>

        <PublicSectionCard
          eyebrow="Próximo passo"
          title="Se o teleatendimento faz parte da sua rotina, vale ver o produto no fluxo completo"
          description="A demo ajuda a entender como o remoto entra na operação sem aumentar o caos."
        >
          <div className="flex flex-wrap gap-3">
            <TrackedCtaLink
              ctaLabel="Solicitar demo"
              ctaLocation="teleatendimento_page_footer_primary"
              href="/solicitar-demo"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
            >
              Solicitar demo
            </TrackedCtaLink>
            <TrackedCtaLink
              ctaLabel="Ver segurança e privacidade"
              ctaLocation="teleatendimento_page_footer_secondary"
              href="/seguranca-e-privacidade"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.18)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
            >
              Ver segurança e privacidade
            </TrackedCtaLink>
          </div>
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
  title
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
      <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function StepCard({
  description,
  number,
  title
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
      <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}
