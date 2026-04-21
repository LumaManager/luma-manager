import type { Metadata } from "next";
import type { ElementType } from "react";
import { ArrowRight, CalendarDays, FileText, MessageSquareText, ShieldCheck } from "lucide-react";
import { Badge } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";
import { StructuredData } from "@/components/shared/structured-data";
import { buildBreadcrumbStructuredData } from "@/lib/marketing/structured-data";

export const metadata: Metadata = {
  title: "Comparar soluções para psicólogos | Luma Manager",
  description:
    "Hub de comparações para psicólogos no Brasil: veja quando a operação manual trava e quando um software começa a fazer sentido.",
  alternates: {
    canonical: "/comparar"
  }
};

const pageType = "comparison_hub_page";

const comparisonRoutes = [
  {
    href: "/comparar/planilha-e-whatsapp-vs-software",
    title: "Planilha e WhatsApp vs software",
    description:
      "A comparação mais direta para quem hoje controla agenda, lembretes e histórico em canais soltos.",
    signal: "Bom para entender o custo do fluxo manual no dia a dia."
  },
  {
    href: "/comparar/agenda-em-planilha-vs-software",
    title: "Agenda em planilha vs software",
    description:
      "Mostra onde a agenda manual começa a gerar conflito, remarcação e falhas de confirmação.",
    signal: "Bom para avaliar organização e previsibilidade da agenda."
  },
  {
    href: "/comparar/prontuario-no-word-vs-software",
    title: "Prontuário no Word vs software",
    description:
      "Compara documentos soltos com prontuário centralizado, versão única e histórico clínico organizado.",
    signal: "Bom para quem já sente risco com arquivos espalhados."
  }
] as const;

export default function CompararHubPage() {
  const structuredData = buildBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Comparar", path: "/comparar" }
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <PublicPageShell secondaryHref="/seguranca-e-privacidade">
        <div className="grid gap-6">
          <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(198,122,69,0.16),transparent_22%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="border border-white/20 bg-white/10 text-white">
                    Comparações para psicólogos
                  </Badge>
                  <Badge className="border border-white/20 bg-white/10 text-white">
                    Funil público indexável
                  </Badge>
                </div>

                <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.4vw,4.9rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                  Compare o fluxo manual com o software antes de tomar a decisão.
                </h1>
                <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                  Esta seção foi desenhada para psicólogos que já operam com planilha, WhatsApp,
                  Word ou papel e precisam entender onde a rotina começa a perder previsibilidade,
                  contexto clínico e segurança.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <TrackedCtaLink
                    href="/solicitar-demo"
                    className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                    ctaLabel="Solicitar demo"
                    ctaLocation="comparison_hub_hero_primary"
                    pageType={pageType}
                  >
                    Solicitar demo
                  </TrackedCtaLink>
                  <TrackedCtaLink
                    href="/software-para-psicologos"
                    className="inline-flex h-[52px] items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.18)] px-5 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]"
                    ctaLabel="Ver o software"
                    ctaLocation="comparison_hub_hero_secondary"
                    pageType={pageType}
                  >
                    Ver o software
                  </TrackedCtaLink>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/14 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  Sinais de que vale comparar
                </p>
                <div className="mt-4 grid gap-3">
                  <HubSignal icon={CalendarDays} title="Agenda com ruído" text="Remarcações, encaixes e conflitos dependem de conferência manual." />
                  <HubSignal icon={MessageSquareText} title="Mensagens espalhadas" text="Lembretes, histórico e pendências estão misturados no WhatsApp." />
                  <HubSignal icon={FileText} title="Documentos soltos" text="Prontuário, arquivos e consentimentos ficam em versões diferentes." />
                  <HubSignal icon={ShieldCheck} title="Privacidade operacional" text="Segurança depende do processo, não do sistema." />
                </div>
              </div>
            </div>
          </section>

          <PublicSectionCard
            eyebrow="Comparações principais"
            title="Escolha a leitura que mais combina com sua dor atual"
            description="Cada página abaixo é pensada para responder uma dúvida operacional específica e levar para a demo quando fizer sentido."
          >
            <div className="grid gap-4 lg:grid-cols-3">
              {comparisonRoutes.map((route) => (
                <LinkCard key={route.href} {...route} />
              ))}
            </div>
          </PublicSectionCard>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <PublicSectionCard
              eyebrow="Como usar"
              title="Leitura curta, decisão mais clara"
              description="A ideia aqui não é educar por educar. É mostrar o custo operacional do manual e a melhora que o software entrega."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <StepCard
                  number="01"
                  title="Escolha a dor"
                  description="Agenda, prontuário ou fluxo manual com mensagens e planilhas."
                />
                <StepCard
                  number="02"
                  title="Compare o impacto"
                  description="Veja onde o retrabalho cresce e onde a operação perde contexto."
                />
                <StepCard
                  number="03"
                  title="Valide na demo"
                  description="Quando a comparação fizer sentido, leve a rotina real para a conversa."
                />
              </div>
            </PublicSectionCard>

            <PublicSectionCard
              eyebrow="O que a comparação deve responder"
              title="O foco não é recurso. É custo operacional"
              description="Compare o que realmente muda no consultório: tempo, risco, consistência e capacidade de crescer."
            >
              <div className="grid gap-3">
                <Outcome text="Menos retrabalho entre sessão, registro e acompanhamento." />
                <Outcome text="Mais visão do que exige ação hoje." />
                <Outcome text="Menos dependência de arquivos e mensagens soltas." />
                <Outcome text="Mais clareza para decidir se a troca já compensa." />
              </div>
            </PublicSectionCard>
          </div>

          <PublicSectionCard
            eyebrow="Próximo passo"
            title="Se a comparação já apontou uma dor real, a demo é o próximo filtro"
            description="A demo ajuda a validar encaixe com o seu consultório e mostrar o fluxo completo antes de qualquer mudança."
          >
            <div className="flex flex-wrap gap-3">
              <TrackedCtaLink
                href="/solicitar-demo"
                className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                ctaLabel="Solicitar demo"
                ctaLocation="comparison_hub_bottom_primary"
                pageType={pageType}
              >
                Solicitar demo
              </TrackedCtaLink>
              <TrackedCtaLink
                href="/seguranca-e-privacidade"
                className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.18)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
                ctaLabel="Ver segurança e privacidade"
                ctaLocation="comparison_hub_bottom_secondary"
                pageType={pageType}
              >
                Ver segurança e privacidade
              </TrackedCtaLink>
            </div>
          </PublicSectionCard>
        </div>
      </PublicPageShell>
    </>
  );
}

function LinkCard({
  description,
  href,
  signal,
  title
}: {
  description: string;
  href: string;
  signal: string;
  title: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-[28px] border border-[rgba(15,76,92,0.12)] bg-[rgba(255,253,248,0.95)] p-5 shadow-[0_18px_46px_rgba(15,76,92,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
        Comparativo
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
      <div className="mt-4 rounded-[20px] border border-[rgba(15,76,92,0.08)] bg-[rgba(15,76,92,0.03)] p-4">
        <p className="text-sm font-medium text-[var(--color-text)]">{signal}</p>
      </div>
      <div className="mt-5">
        <TrackedCtaLink
          href={href}
          className="inline-flex h-11 items-center gap-2 rounded-[18px] border border-[rgba(15,76,92,0.16)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
          ctaLabel={title}
          ctaLocation={`comparison_hub_card_${href.split("/").pop() ?? "route"}`}
          pageType={pageType}
        >
          Ver comparação
          <ArrowRight className="h-4 w-4" />
        </TrackedCtaLink>
      </div>
    </div>
  );
}

function HubSignal({
  icon: Icon,
  text,
  title
}: {
  icon: ElementType;
  text: string;
  title: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/12 bg-white/[0.08] p-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[rgba(255,255,255,0.72)]">{text}</p>
        </div>
      </div>
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
      <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function Outcome({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[22px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(15,76,92,0.12)]">
        <ArrowRight className="h-3.5 w-3.5 text-[var(--color-primary)]" />
      </div>
      <p className="text-sm leading-7 text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}
