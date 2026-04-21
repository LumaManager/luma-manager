import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, FileText, ShieldCheck, Workflow } from "lucide-react";

import { PublicSectionCard } from "@/components/marketing/public-page-shell";
import { PublicArticleShell } from "@/components/marketing/public-article-shell";
import { StructuredData } from "@/components/shared/structured-data";
import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import {
  buildArticleStructuredData,
  buildBreadcrumbStructuredData
} from "@/lib/marketing/structured-data";

export const metadata: Metadata = {
  title: "Como escolher software para psicólogo | Luma Manager",
  description:
    "Veja quais critérios realmente importam na escolha de um software para psicólogo e quais perguntas levar para a demo.",
  alternates: {
    canonical: "/blog/como-escolher-software-para-psicologo"
  }
};

const pageType = "blog_software_choice_article";

const toc = [
  { href: "#o-que-avaliar-primeiro", label: "O que avaliar primeiro" },
  { href: "#critérios", label: "Critérios que importam" },
  { href: "#sinais-de-alerta", label: "Sinais de alerta" },
  { href: "#perguntas-para-demo", label: "Perguntas para a demo" }
];

export default function ComoEscolherSoftwareParaPsicologoPage() {
  const structuredData = [
    buildBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      {
        name: "Como escolher software para psicologo",
        path: "/blog/como-escolher-software-para-psicologo"
      }
    ]),
    buildArticleStructuredData({
      description:
        "Veja quais criterios realmente importam na escolha de um software para psicologo e quais perguntas levar para a demo.",
      headline: "Como escolher software para psicólogo sem comprar pela lista de recursos errada",
      path: "/blog/como-escolher-software-para-psicologo"
    })
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <PublicArticleShell
        description="A escolha certa costuma simplificar agenda, prontuário, privacidade e cobrança sem criar uma nova camada de trabalho."
        eyebrow="Meio de funil"
        readingTime="Leitura de 7 min"
        title="Como escolher software para psicólogo sem comprar pela lista de recursos errada"
        toc={toc}
      >
      <section id="o-que-avaliar-primeiro" className="scroll-mt-28">
        <PublicSectionCard
          description="Antes de comparar ferramentas, observe como o seu consultório realmente funciona. A decisão fica mais clara quando o critério é rotina, não catálogo."
          eyebrow="1. O que avaliar primeiro"
          title="Escolha pela rotina, não pelo excesso de recurso"
        >
          <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              O que você faz todo dia depois da sessão.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Onde sua agenda está hoje e quanto tempo ela consome.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Como prontuário, documentos e cobrança entram no mesmo fluxo.
            </li>
          </ul>
        </PublicSectionCard>
      </section>

      <section id="criterios" className="scroll-mt-28">
        <PublicSectionCard
          description="Os melhores critérios são os que reduzem retrabalho e tornam a adoção possível. Se a ferramenta depende de muito esforço para funcionar, ela vira custo escondido."
          eyebrow="2. Critérios"
          title="Os critérios que realmente importam"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <CriteriaCard
              icon={Workflow}
              title="Fluxo de atendimento"
              text="Agenda, sessão, prontuário e pendências precisam se encaixar sem exigir malabarismo."
            />
            <CriteriaCard
              icon={FileText}
              title="Registro clínico"
              text="Anote a evolução de forma rápida o suficiente para não empurrar tudo para o fim do dia."
            />
            <CriteriaCard
              icon={ClipboardList}
              title="Documentos"
              text="Termos, consentimentos e arquivos precisam ser fáceis de localizar e usar no contexto correto."
            />
            <CriteriaCard
              icon={ShieldCheck}
              title="Privacidade"
              text="A ferramenta deve ajudar a controlar acesso, exposição e rastreio sem complicar a operação."
            />
          </div>
        </PublicSectionCard>
      </section>

      <section id="sinais-de-alerta" className="scroll-mt-28">
        <PublicSectionCard
          description="Se estes sinais aparecerem, a ferramenta provavelmente vai gerar mais fricção do que ajuda."
          eyebrow="3. Sinais de alerta"
          title="Quando o software parece bom na demo, mas ruim na rotina"
        >
          <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Exige múltiplas abas para completar uma tarefa simples.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Promete automatizar demais e deixa o controle humano confuso.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Não explica bem como faz migração, suporte e segurança.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Exige mudança de hábito desproporcional para entregar valor básico.
            </li>
          </ul>
        </PublicSectionCard>
      </section>

      <section id="perguntas-para-demo" className="scroll-mt-28">
        <PublicSectionCard
          description="Leve estas perguntas para a demo. Elas ajudam a separar promessa comercial de encaixe operacional."
          eyebrow="4. Perguntas para a demo"
          title="Perguntas que deixam a decisão mais segura"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <QuestionCard text="Quanto tempo leva para começar a usar de forma útil?" />
            <QuestionCard text="Como a agenda conversa com o prontuário no fluxo real?" />
            <QuestionCard text="O que acontece na migração de dados e pacientes?" />
            <QuestionCard text="Como a ferramenta ajuda com privacidade e acesso?" />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <TrackedCtaLink
              ctaLabel="Solicitar demo"
              ctaLocation="blog_software_choice_footer_primary"
              href="/solicitar-demo"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
            >
              Solicitar demo
            </TrackedCtaLink>
            <TrackedCtaLink
              ctaLabel="Ver prontuário"
              ctaLocation="blog_software_choice_footer_secondary"
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
          description="Se você já sabe que precisa de mais controle e menos improviso, a decisão fica menos sobre encontrar o software perfeito e mais sobre achar o fluxo certo."
          eyebrow="Resumo"
          title="O melhor software é o que você consegue usar sem pensar demais"
        >
          <p className="text-sm leading-7 text-[var(--color-text-muted)]">
            O critério final é simples: se a ferramenta melhora seu dia sem exigir uma nova rotina
            paralela, ela está no caminho certo. Se o esforço para usar supera o ganho, vale
            reconsiderar.
          </p>
        </PublicSectionCard>
      </section>
      </PublicArticleShell>
    </>
  );
}

function CriteriaCard({
  icon: Icon,
  text,
  title
}: {
  icon: typeof Workflow;
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

function QuestionCard({ text }: { text: string }) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <p className="text-sm leading-7 text-[var(--color-text)]">{text}</p>
    </div>
  );
}
