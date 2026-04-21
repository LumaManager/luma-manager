import type { Metadata } from "next";
import type { ElementType } from "react";
import { ArrowRight, CalendarDays, Clock3, MessageSquareText, ShieldCheck } from "lucide-react";
import { Badge } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";
import { PublicComparisonMatrix } from "@/components/marketing/public-comparison-matrix";
import { StructuredData } from "@/components/shared/structured-data";
import { buildBreadcrumbStructuredData } from "@/lib/marketing/structured-data";

export const metadata: Metadata = {
  title: "Agenda em planilha vs software para psicólogo | Luma Manager",
  description:
    "Compare a agenda em planilha com um software para psicólogos e veja quando remarcação, encaixe e confirmação deixam de caber no manual.",
  alternates: {
    canonical: "/comparar/agenda-em-planilha-vs-software"
  }
};

const pageType = "comparison_agenda_page";

const comparisonRows = [
  {
    label: "Visão do dia",
    manual:
      "A agenda depende de abrir arquivo, checar mensagens e reconciliar mudanças antes de saber o que está acontecendo.",
    software:
      "A agenda centraliza o dia em uma visão única, com menos fricção para localizar o que mudou."
  },
  {
    label: "Remarcação",
    manual:
      "Trocas exigem atualização em mais de um lugar e aumentam a chance de conflito ou duplicidade.",
    software:
      "A remarcação fica concentrada em um fluxo só, reduzindo retrabalho e espaço para erro."
  },
  {
    label: "Encaixes e faltas",
    manual:
      "Os ajustes dependem de atenção manual e costumam ser resolvidos em cima da hora.",
    software:
      "Encaixes, cancelamentos e faltas passam a aparecer com mais clareza para decisão rápida."
  },
  {
    label: "Confirmação",
    manual:
      "Confirmação de horário fica misturada com o restante da conversa e exige acompanhamento constante.",
    software:
      "A rotina de confirmação ganha consistência, com menos chance de algo importante escapar."
  },
  {
    label: "Risco operacional",
    manual:
      "Um pequeno descuido em planilha ou mensagem pode gerar conflito de horário e perda de contexto.",
    software:
      "O processo fica mais previsível e reduz dependência de lembrança individual."
  },
  {
    label: "Escala",
    manual:
      "Quanto mais a agenda cresce, mais tempo você gasta conferindo e atualizando manualmente.",
    software:
      "A operação sustenta mais volume com menos troca de ferramenta e menos conferência repetida."
  }
] as const;

export default function AgendaEmPlanilhaVsSoftwarePage() {
  const structuredData = buildBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Comparar", path: "/comparar" },
    {
      name: "Agenda em planilha vs software",
      path: "/comparar/agenda-em-planilha-vs-software"
    }
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <PublicPageShell secondaryHref="/seguranca-e-privacidade">
        <div className="grid gap-6">
          <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="border border-white/20 bg-white/10 text-white">
                    Comparação de agenda
                  </Badge>
                  <Badge className="border border-white/20 bg-white/10 text-white">
                    Psicólogos no Brasil
                  </Badge>
                </div>

                <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.4vw,4.9rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                  Agenda em planilha vs software para psicólogo.
                </h1>
                <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                  Quando a agenda ainda é pequena, a planilha funciona. Quando começam as
                  remarcações, os encaixes e os lembretes, o manual vira uma etapa extra em vez de
                  um apoio operacional.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <TrackedCtaLink
                    href="/solicitar-demo"
                    className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                    ctaLabel="Solicitar demo"
                    ctaLocation="comparison_agenda_hero_primary"
                    pageType={pageType}
                  >
                    Solicitar demo
                  </TrackedCtaLink>
                  <TrackedCtaLink
                    href="/software-para-psicologos"
                    className="inline-flex h-[52px] items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.18)] px-5 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]"
                    ctaLabel="Ver o software"
                    ctaLocation="comparison_agenda_hero_secondary"
                    pageType={pageType}
                  >
                    Ver o software
                  </TrackedCtaLink>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/14 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  O que mais pesa na rotina
                </p>
                <div className="mt-4 grid gap-3">
                  <MiniStat icon={CalendarDays} title="Visão do dia" text="Você enxerga o que está marcado sem reconciliação manual." />
                  <MiniStat icon={Clock3} title="Tempo gasto" text="Menos minutos voltando entre planilha, mensagem e memória." />
                  <MiniStat icon={MessageSquareText} title="Confirmação" text="A comunicação deixa de depender de busca no histórico." />
                  <MiniStat icon={ShieldCheck} title="Menos erro" text="O processo fica mais estável conforme a agenda cresce." />
                </div>
              </div>
            </div>
          </section>

          <PublicSectionCard
            eyebrow="Comparação direta"
            title="O que muda quando a agenda deixa de ser manual"
            description="A diferença relevante não é estética. É visibilidade, consistência e menos chance de conflito operacional."
          >
            <PublicComparisonMatrix
              rows={comparisonRows}
              leftLabel="Planilha"
              rightLabel="Software para psicólogo"
            />
          </PublicSectionCard>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <PublicSectionCard
              eyebrow="Quando a planilha ainda serve"
              title="O manual funciona enquanto a agenda é simples"
              description="Se você está operando com poucos horários e pouca troca, a planilha ainda pode ser suficiente por um tempo."
            >
              <div className="grid gap-4">
                <Reason text="Poucas remarcações e baixa dependência de encaixes." />
                <Reason text="Atendimento muito previsível, com pouca variação de rotina." />
                <Reason text="Pouca necessidade de histórico de alterações e confirmação estruturada." />
              </div>
            </PublicSectionCard>

            <PublicSectionCard
              eyebrow="Onde o software vence"
              title="Quando a agenda deixa de ser só calendário"
              description="A troca ganha valor quando agenda vira operação e não apenas marcação de horário."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniCard title="Menos conferência" text="Você para de checar o mesmo horário em lugares diferentes." />
                <MiniCard title="Mais previsibilidade" text="A rotina fica mais fácil de sustentar conforme entram novos pacientes." />
                <MiniCard title="Menos atrito" text="A remarcação deixa de ser um processo frágil e manual." />
                <MiniCard title="Mais foco clínico" text="O tempo volta para a sessão, não para a mecânica da agenda." />
              </div>
            </PublicSectionCard>
          </div>

          <PublicSectionCard
            eyebrow="Próximo passo"
            title="Se a agenda já virou risco operacional, vale ver o fluxo em uma demo"
            description="A demo serve para testar se o modelo encaixa no seu volume, na sua rotina e na forma como você organiza o atendimento."
          >
            <div className="flex flex-wrap gap-3">
              <TrackedCtaLink
                href="/solicitar-demo"
                className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                ctaLabel="Solicitar demo"
                ctaLocation="comparison_agenda_bottom_primary"
                pageType={pageType}
              >
                Solicitar demo
              </TrackedCtaLink>
              <TrackedCtaLink
                href="/comparar/prontuario-no-word-vs-software"
                className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.18)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
                ctaLabel="Ver prontuário no Word vs software"
                ctaLocation="comparison_agenda_bottom_secondary"
                pageType={pageType}
              >
                Ver prontuário no Word vs software
              </TrackedCtaLink>
            </div>
          </PublicSectionCard>
        </div>
      </PublicPageShell>
    </>
  );
}

function MiniStat({
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

function Reason({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[22px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(15,76,92,0.12)]">
        <ArrowRight className="h-3.5 w-3.5 text-[var(--color-primary)]" />
      </div>
      <p className="text-sm leading-7 text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}

function MiniCard({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}
