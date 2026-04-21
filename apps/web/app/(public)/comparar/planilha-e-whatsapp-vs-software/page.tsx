import type { Metadata } from "next";
import type { ElementType } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, FileText, MessageSquareText, ShieldCheck } from "lucide-react";
import { Badge } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";
import { PublicComparisonMatrix } from "@/components/marketing/public-comparison-matrix";
import { StructuredData } from "@/components/shared/structured-data";
import { buildBreadcrumbStructuredData } from "@/lib/marketing/structured-data";

export const metadata: Metadata = {
  title: "Planilha e WhatsApp vs software para psicólogo | Luma Manager",
  description:
    "Compare o fluxo manual com um software para psicólogos e veja onde agenda, prontuário, documentos e privacidade deixam de escalar.",
  alternates: {
    canonical: "/comparar/planilha-e-whatsapp-vs-software"
  }
};

const pageType = "comparison_page";

const comparisonRows = [
  {
    label: "Agenda e remarcação",
    manual: "Horários espalhados em mensagens, planilha e memória. O risco de conflito cresce conforme a agenda enche.",
    software:
      "Agenda centralizada com visão clara do dia, encaixes e mudanças. O consultório trabalha com menos retrabalho."
  },
  {
    label: "Histórico clínico",
    manual: "Notas, áudios e arquivos ficam espalhados entre canais. Recuperar contexto leva tempo e gera ruído.",
    software: "Prontuário e registro no mesmo lugar, com rotina mais previsível para acompanhar cada atendimento."
  },
  {
    label: "Documentos e consentimentos",
    manual: "Modelos circulam por cópia e cola, com risco de versão errada ou arquivo perdido.",
    software: "Documentos organizados e reaproveitáveis, com fluxo mais consistente para consentimentos e anexos."
  },
  {
    label: "Comunicação com paciente",
    manual: "A comunicação depende da disciplina de cada mensagem e da atenção manual para não esquecer retornos.",
    software: "A operação fica mais estruturada, com o consultório conseguindo padronizar etapas e reduzir falhas."
  },
  {
    label: "Segurança e privacidade",
    manual: "Controle informal sobre acesso, backup e rastreio de informação. Isso aumenta o risco operacional.",
    software: "Fluxo pensado para privacidade, governança de dados e menos dependência de arquivos soltos."
  },
  {
    label: "Escala do consultório",
    manual: "Funciona até certo ponto, mas cada novo paciente adiciona mais tarefas repetitivas.",
    software: "O processo fica replicável, o que ajuda quando a agenda cresce ou quando você atende com equipe."
  }
] as const;

export default function ComparisonPage() {
  const structuredData = buildBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Comparar", path: "/comparar/planilha-e-whatsapp-vs-software" },
    {
      name: "Planilha e WhatsApp vs software",
      path: "/comparar/planilha-e-whatsapp-vs-software"
    }
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <PublicPageShell secondaryHref="/seguranca-e-privacidade">
        <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-6 text-white shadow-[0_30px_80px_rgba(15,76,92,0.24)] lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(198,122,69,0.2),transparent_22%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <Badge className="border border-white/20 bg-white/10 text-white">Comparação prática para psicólogos</Badge>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white lg:text-6xl">
                Planilha e WhatsApp funcionam no começo. Para crescer, viram gargalo.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[rgba(255,255,255,0.82)] lg:text-lg">
                Se você já sente agenda duplicada, mensagem perdida e documento fora da versão certa, esta página
                mostra onde o fluxo manual começa a custar tempo, contexto e segurança.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <TrackedCtaLink
                  href="/solicitar-demo"
                  className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                  ctaLabel="Solicitar demo"
                  ctaLocation="comparison_hero_primary"
                  pageType={pageType}
                >
                  Solicitar demo
                </TrackedCtaLink>
                <TrackedCtaLink
                  href="/seguranca-e-privacidade"
                  className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(255,255,255,0.18)] px-4 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]"
                  ctaLabel="Ver segurança e privacidade"
                  ctaLocation="comparison_hero_secondary"
                  pageType={pageType}
                >
                  Ver segurança e privacidade
                </TrackedCtaLink>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <HeroPill text="Menos retrabalho no dia a dia" />
                <HeroPill text="Mais contexto clínico em um só fluxo" />
                <HeroPill text="Decisão clara para migrar do manual" />
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[30px] border border-white/14 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  O que costuma travar a operação
                </p>
                <div className="mt-4 grid gap-3">
                  <MiniStat icon={MessageSquareText} title="Mensagens dispersas" text="O WhatsApp vira fila, lembrete e histórico ao mesmo tempo." />
                  <MiniStat icon={CalendarDays} title="Agenda sem visão única" text="Trocas de horário dependem de conferência manual." />
                  <MiniStat icon={FileText} title="Arquivos soltos" text="Consentimentos, notas e anexos ficam difíceis de rastrear." />
                  <MiniStat icon={ShieldCheck} title="Risco operacional" text="A privacidade depende do processo, não do sistema." />
                </div>
              </div>
            </div>
          </div>
        </section>

        <PublicSectionCard
          eyebrow="Comparação direta"
          title="Onde o fluxo manual perde para um software"
          description="A comparação abaixo ajuda a decidir quando a troca deixa de ser conveniência e passa a ser proteção operacional."
        >
          <PublicComparisonMatrix rows={comparisonRows} />
        </PublicSectionCard>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <PublicSectionCard
            eyebrow="Quando faz sentido migrar"
            title="Se você reconhecer estes sinais, o software tende a pagar a complexidade"
            description="O ponto de virada normalmente aparece quando o consultório já não depende só de agenda simples."
          >
            <div className="grid gap-4">
              <Reason text="Você perde tempo procurando o histórico do paciente entre mensagens, arquivos e planilhas." />
              <Reason text="A remarcação exige atenção manual e começa a gerar conflito de horário." />
              <Reason text="Documentos e consentimentos mudam de versão com frequência." />
              <Reason text="Você quer mais previsibilidade antes de aumentar volume ou trazer apoio." />
            </div>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="O que melhora"
            title="O ganho não é só organização. É redução de atrito no consultório"
            description="Um software bem implantado encurta o tempo entre atendimento, registro e acompanhamento."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <MiniCard title="Menos troca de contexto" text="Agenda, prontuário e documentos passam a viver no mesmo fluxo." />
              <MiniCard title="Mais consistência" text="O processo se repete com menos variação entre sessões e profissionais." />
              <MiniCard title="Menos risco" text="A privacidade deixa de depender de arquivos e mensagens soltas." />
              <MiniCard title="Mais foco clínico" text="Você gasta menos energia com operação e mais com atendimento." />
            </div>
          </PublicSectionCard>
        </div>

        <PublicSectionCard
          eyebrow="Próximo passo"
          title="Se o manual já está travando, a próxima conversa é uma demo"
          description="A demo serve para validar aderência ao seu consultório e mostrar como o fluxo fica na prática."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <TrackedCtaLink
              href="/solicitar-demo"
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
              ctaLabel="Solicitar demo"
              ctaLocation="comparison_bottom_primary"
              pageType={pageType}
            >
              Solicitar demo
            </TrackedCtaLink>
            <TrackedCtaLink
              href="/seguranca-e-privacidade"
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.16)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
              ctaLabel="Ver segurança e privacidade"
              ctaLocation="comparison_bottom_secondary"
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

function HeroPill({ text }: { text: string }) {
  return (
    <div className="rounded-[20px] border border-white/14 bg-white/[0.08] px-4 py-3 text-sm text-[rgba(255,255,255,0.84)] backdrop-blur">
      <div className="flex items-start gap-2">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[rgba(255,255,255,0.9)]" />
        <p className="leading-6">{text}</p>
      </div>
    </div>
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
