import type { Metadata } from "next";
import type { ElementType } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Sparkles, UserRoundCheck } from "lucide-react";
import { Badge, Card, CardContent } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";

export const metadata: Metadata = {
  title: "Agenda para psicólogos | Luma Manager",
  description:
    "Agenda para psicólogos autônomos que querem visão do dia, menos desencontro e mais controle sobre sessões, remarcações e pendências.",
  alternates: {
    canonical: "/agenda-para-psicologos"
  }
};

const pageType = "agenda_para_psicologos_page";

const benefits = [
  {
    icon: CalendarDays,
    title: "Visão clara do dia",
    description:
      "Veja a sequência de sessões, o que mudou e o que exige atenção antes da próxima conversa."
  },
  {
    icon: Clock3,
    title: "Menos perda de contexto",
    description:
      "A agenda deixa de ser só um calendário e passa a apoiar sua rotina clínica com mais ordem."
  },
  {
    icon: UserRoundCheck,
    title: "Fluxo mais previsível",
    description:
      "Controle remarcações, pendências e confirmações sem dispersar o consultório em ferramentas soltas."
  }
] as const;

export default function AgendaParaPsicologosPage() {
  return (
    <PublicPageShell>
      <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warning" className="bg-[rgba(255,255,255,0.14)] text-white">
                  Agenda clínica
                </Badge>
                <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                  Para psicólogos autônomos
                </Badge>
              </div>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.3vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                Agenda para psicólogos que precisam enxergar o dia sem perder tempo com organização manual.
              </h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                A agenda do Luma Manager foi pensada para consultório solo e clínica pequena. O
                objetivo é dar visão operacional do dia, ajudar a reduzir desencontros e manter o
                fluxo clínico previsível.
              </p>

              <div className="mt-7 grid gap-3 sm:max-w-2xl">
                <HeroBullet text="Saiba rapidamente o que está marcado, o que mudou e o que precisa de atenção." />
                <HeroBullet text="Trate remarcações e pendências sem espalhar o trabalho em múltiplos lugares." />
                <HeroBullet text="Mantenha o contexto clínico perto da sessão, não em planilhas desconectadas." />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Solicitar demo"
                  ctaLocation="agenda_page_hero_primary"
                  href="/solicitar-demo"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Solicitar demo
                  <ArrowRight className="h-4 w-4" />
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver segurança e privacidade"
                  ctaLocation="agenda_page_hero_secondary"
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
                  O que a agenda entrega
                </p>
                <div className="space-y-3">
                  <MiniCard
                    icon={CalendarDays}
                    title="Sequência do dia"
                    description="Veja sessões e ajustes em ordem, com menos ruído visual."
                  />
                  <MiniCard
                    icon={Clock3}
                    title="Tempo e transições"
                    description="A agenda ajuda a controlar começo, fim e o que vem depois de cada sessão."
                  />
                  <MiniCard
                    icon={Sparkles}
                    title="Operação mais limpa"
                    description="Quando o dia está claro, a rotina clínica fica mais leve para executar."
                  />
                </div>
                <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.04)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Posicionamento</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    A agenda não deve competir com o atendimento. Ela precisa reduzir ruído e deixar
                    a sua rotina mais previsível.
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

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
          <PublicSectionCard
            eyebrow="Como funciona"
            title="Uma agenda clínica precisa mostrar contexto, não só horário"
            description="O valor está em entender o que o dia pede antes de abrir a sessão."
          >
            <div className="grid gap-3 md:grid-cols-3">
              <StepCard
                number="01"
                title="Leia o dia"
                description="Veja sessões, encaixes e mudanças em um único fluxo."
              />
              <StepCard
                number="02"
                title="Prepare a sessão"
                description="Acesse o que importa antes de atender."
              />
              <StepCard
                number="03"
                title="Feche com clareza"
                description="Atualize o próximo passo sem deixar pendência escondida."
              />
            </div>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="Para quem faz sentido"
            title="Pensada para quem quer previsibilidade na operação"
            description="Boa para profissionais que precisam de rotina simples, com menos chance de perder algo."
          >
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Psicólogo com agenda própria e sessões distribuídas ao longo do dia.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Clínica pequena com remarcações e confirmações frequentes.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Operação que quer menos ruído entre agenda, prontuário e cobrança.
              </li>
            </ul>
          </PublicSectionCard>
        </div>

        <PublicSectionCard
          eyebrow="Próximo passo"
          title="Se a sua agenda ainda depende de muitas ferramentas, vale olhar o fluxo completo"
          description="A demo mostra como o dia fica mais claro quando tudo está conectado."
        >
          <div className="flex flex-wrap gap-3">
            <TrackedCtaLink
              ctaLabel="Solicitar demo"
              ctaLocation="agenda_page_footer_primary"
              href="/solicitar-demo"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
            >
              Solicitar demo
            </TrackedCtaLink>
            <TrackedCtaLink
              ctaLabel="Ver segurança e privacidade"
              ctaLocation="agenda_page_footer_secondary"
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
