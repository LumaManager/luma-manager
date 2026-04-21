import type { Metadata } from "next";
import { CalendarDays, CheckCircle2, FileText, ListChecks, Workflow } from "lucide-react";

import { PublicSectionCard } from "@/components/marketing/public-page-shell";
import { PublicArticleShell } from "@/components/marketing/public-article-shell";
import { StructuredData } from "@/components/shared/structured-data";
import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import {
  buildArticleStructuredData,
  buildBreadcrumbStructuredData
} from "@/lib/marketing/structured-data";

export const metadata: Metadata = {
  title: "Como organizar agenda e prontuário | Luma Manager",
  description:
    "Aprenda um fluxo simples para organizar agenda e prontuário sem carregar o pós-sessão para o fim do dia.",
  alternates: {
    canonical: "/blog/como-organizar-agenda-e-prontuario"
  }
};

const pageType = "blog_agenda_prontuario_article";

const toc = [
  { href: "#fluxo-ideal", label: "O fluxo ideal" },
  { href: "#rotina-diaria", label: "Rotina diária" },
  { href: "#rotina-semanal", label: "Rotina semanal" },
  { href: "#erros-comuns", label: "Erros comuns" }
];

export default function ComoOrganizarAgendaEProntuarioPage() {
  const structuredData = [
    buildBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      {
        name: "Como organizar agenda e prontuario",
        path: "/blog/como-organizar-agenda-e-prontuario"
      }
    ]),
    buildArticleStructuredData({
      description:
        "Aprenda um fluxo simples para organizar agenda e prontuario sem carregar o pos-sessao para o fim do dia.",
      headline: "Como organizar agenda e prontuário sem deixar o dia acumular",
      path: "/blog/como-organizar-agenda-e-prontuario"
    })
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <PublicArticleShell
        description="O objetivo não é criar um sistema rígido. É reduzir fricção suficiente para que a sessão termine com contexto preservado e pendência clara."
        eyebrow="Meio de funil"
        readingTime="Leitura de 6 min"
        title="Como organizar agenda e prontuário sem deixar o dia acumular"
        toc={toc}
      >
      <section id="fluxo-ideal" className="scroll-mt-28">
        <PublicSectionCard
          description="Pense no fluxo como três momentos: antes da sessão, durante a sessão e logo depois. Quando esses momentos estão claros, a organização fica muito mais simples."
          eyebrow="1. Fluxo ideal"
          title="A melhor organização começa antes de abrir a agenda"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <FlowCard
              icon={CalendarDays}
              title="Antes da sessão"
              text="Confira o dia, confirme pendências e localize rapidamente o próximo atendimento."
            />
            <FlowCard
              icon={Workflow}
              title="Durante a sessão"
              text="Mantenha o contexto essencial disponível sem abrir várias telas ou perder atenção."
            />
            <FlowCard
              icon={FileText}
              title="Depois da sessão"
              text="Registre a evolução enquanto o raciocínio ainda está fresco."
            />
          </div>
        </PublicSectionCard>
      </section>

      <section id="rotina-diaria" className="scroll-mt-28">
        <PublicSectionCard
          description="Uma rotina diária curta é melhor do que acumular tudo para o fim da semana."
          eyebrow="2. Rotina diária"
          title="O que fazer todo dia para não perder o controle"
        >
          <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Abrir a agenda no início do expediente e revisar alterações.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Registrar o essencial logo depois da sessão, sem deixar para depois de muitas outras tarefas.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Separar um momento para pendências simples de cobrança, documentos e retorno.
            </li>
          </ul>
        </PublicSectionCard>
      </section>

      <section id="rotina-semanal" className="scroll-mt-28">
        <PublicSectionCard
          description="A revisão semanal serve para o que é estrutural: organização, limpeza e decisões que não cabem no fluxo diário."
          eyebrow="3. Rotina semanal"
          title="O que vale revisar uma vez por semana"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <ChecklistCard title="Agenda" text="Reveja encaixes, cancelamentos e janelas que ficaram vazias." />
            <ChecklistCard title="Prontuário" text="Padronize a forma de registrar evolução e pendências." />
            <ChecklistCard title="Documentos" text="Confirme se termos e arquivos estão fáceis de encontrar." />
            <ChecklistCard title="Cobrança" text="Cheque pendências que ficaram abertas ao longo da semana." />
          </div>
        </PublicSectionCard>
      </section>

      <section id="erros-comuns" className="scroll-mt-28">
        <PublicSectionCard
          description="Esses erros parecem pequenos, mas somam bastante trabalho invisível ao longo do mês."
          eyebrow="4. Erros comuns"
          title="O que costuma quebrar a organização"
        >
          <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Manter agenda em um lugar e prontuário em outro sem ligação clara entre os dois.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Deixar notas para o fim do dia e perder contexto clínico importante.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Criar rotina complexa demais para manter em dias com agenda cheia.
            </li>
          </ul>

          <div className="mt-5 flex flex-wrap gap-3">
            <TrackedCtaLink
              ctaLabel="Ver agenda"
              ctaLocation="blog_agenda_prontuario_footer_primary"
              href="/agenda-para-psicologos"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
            >
              Ver agenda
            </TrackedCtaLink>
            <TrackedCtaLink
              ctaLabel="Ver prontuário"
              ctaLocation="blog_agenda_prontuario_footer_secondary"
              href="/prontuario-eletronico-para-psicologos"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.18)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
            >
              Ver prontuário
            </TrackedCtaLink>
          </div>
        </PublicSectionCard>
      </section>

      <section className="scroll-mt-28">
        <PublicSectionCard
          description="Se o consultório quer fechar o dia com menos pendência, o ganho real vem de uma rotina simples e repetível."
          eyebrow="Resumo"
          title="Agenda e prontuário funcionam melhor quando o registro não fica para depois"
        >
          <p className="text-sm leading-7 text-[var(--color-text-muted)]">
            A regra prática é simples: quanto mais próximo do atendimento o registro acontece, menor a
            chance de perder contexto e mais leve fica a operação.
          </p>
        </PublicSectionCard>
      </section>
      </PublicArticleShell>
    </>
  );
}

function FlowCard({
  icon: Icon,
  text,
  title
}: {
  icon: typeof CalendarDays;
  text: string;
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[rgba(15,76,92,0.08)]">
        <Icon className="h-4 w-4 text-[var(--color-primary)]" />
      </div>
      <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}

function ChecklistCard({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[rgba(15,76,92,0.08)]">
        <ListChecks className="h-4 w-4 text-[var(--color-primary)]" />
      </div>
      <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}
