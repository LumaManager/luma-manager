import type { Metadata } from "next";
import { CheckCircle2, FileLock2, ShieldCheck, Users } from "lucide-react";

import { PublicSectionCard } from "@/components/marketing/public-page-shell";
import { PublicArticleShell } from "@/components/marketing/public-article-shell";
import { StructuredData } from "@/components/shared/structured-data";
import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import {
  buildArticleStructuredData,
  buildBreadcrumbStructuredData
} from "@/lib/marketing/structured-data";

export const metadata: Metadata = {
  title: "LGPD para psicólogos no consultório | Luma Manager",
  description:
    "Entenda o que importa da LGPD para psicólogos no consultório, quais práticas ajudam e o que perguntar ao fornecedor.",
  alternates: {
    canonical: "/blog/lgpd-para-psicologos-consultorio"
  }
};

const pageType = "blog_lgpd_article";

const toc = [
  { href: "#o-que-significa", label: "O que a LGPD significa aqui" },
  { href: "#praticas-minimas", label: "Práticas mínimas" },
  { href: "#perguntas-ao-fornecedor", label: "Perguntas ao fornecedor" },
  { href: "#erros-comuns", label: "Erros comuns" }
];

export default function LgpdParaPsicologosConsultorioPage() {
  const structuredData = [
    buildBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      {
        name: "LGPD para psicologos no consultorio",
        path: "/blog/lgpd-para-psicologos-consultorio"
      }
    ]),
    buildArticleStructuredData({
      description:
        "Entenda o que importa da LGPD para psicologos no consultorio, quais praticas ajudam e o que perguntar ao fornecedor.",
      headline: "LGPD para psicólogos no consultório: o que importa na prática",
      path: "/blog/lgpd-para-psicologos-consultorio"
    })
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <PublicArticleShell
        description="No consultório, LGPD não é um texto abstrato. Ela aparece em acesso, armazenamento, controle de exposição e no que você aceita de cada sistema."
        eyebrow="Fundo de funil"
        readingTime="Leitura de 8 min"
        title="LGPD para psicólogos no consultório: o que importa na prática"
        toc={toc}
      >
      <section id="o-que-significa" className="scroll-mt-28">
        <PublicSectionCard
          description="Este conteúdo é informativo e não substitui orientação jurídica. O objetivo aqui é traduzir a LGPD para decisões operacionais do consultório."
          eyebrow="1. O que significa"
          title="A LGPD entra na rotina quando você decide quem vê o quê"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <LegalCard
              icon={FileLock2}
              title="Menos exposição"
              text="Guarde o mínimo necessário para executar o atendimento com segurança."
            />
            <LegalCard
              icon={Users}
              title="Acesso controlado"
              text="Nem toda pessoa da operação precisa ver o mesmo nível de informação."
            />
            <LegalCard
              icon={ShieldCheck}
              title="Proteção concreta"
              text="Segurança precisa aparecer em prática, não só em promessa de marketing."
            />
          </div>
        </PublicSectionCard>
      </section>

      <section id="praticas-minimas" className="scroll-mt-28">
        <PublicSectionCard
          description="As boas práticas não precisam ser pesadas. O importante é criar uma estrutura simples o bastante para realmente ser seguida."
          eyebrow="2. Práticas mínimas"
          title="O que vale manter de pé no consultório"
        >
          <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Controlar acesso por perfil e reduzir visibilidade desnecessária.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Definir onde os dados ficam guardados e por quanto tempo fazem sentido ficar.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Preferir um fluxo que registre o necessário sem espalhar informação em várias ferramentas.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Ter clareza sobre backup, auditoria e suporte em caso de incidente.
            </li>
          </ul>
        </PublicSectionCard>
      </section>

      <section id="perguntas-ao-fornecedor" className="scroll-mt-28">
        <PublicSectionCard
          description="Se o fornecedor responde com generalidades, vale aprofundar. A privacidade precisa ficar clara antes da decisão."
          eyebrow="3. Perguntas ao fornecedor"
          title="Perguntas que ajudam a validar risco e maturidade"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <QuestionCard text="Como o sistema controla acesso e rastreio de ações?" />
            <QuestionCard text="Onde os dados ficam armazenados e quem pode acessá-los?" />
            <QuestionCard text="Como funciona a política de backup e recuperação?" />
            <QuestionCard text="Como a ferramenta evita exposição desnecessária de conteúdo clínico?" />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <TrackedCtaLink
              ctaLabel="Ver segurança e privacidade"
              ctaLocation="blog_lgpd_footer_primary"
              href="/seguranca-e-privacidade"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
            >
              Ver segurança e privacidade
            </TrackedCtaLink>
            <TrackedCtaLink
              ctaLabel="Solicitar demo"
              ctaLocation="blog_lgpd_footer_secondary"
              href="/solicitar-demo"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.18)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
            >
              Solicitar demo
            </TrackedCtaLink>
          </div>
        </PublicSectionCard>
      </section>

      <section id="erros-comuns" className="scroll-mt-28">
        <PublicSectionCard
          description="Muitos problemas de privacidade aparecem por excesso de improviso, não por má intenção. O sistema certo ajuda a reduzir esse improviso."
          eyebrow="4. Erros comuns"
          title="Onde a LGPD costuma dar errado no consultório"
        >
          <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Guardar dados sensíveis em múltiplos lugares sem critério claro.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Não saber quem tem acesso ao quê dentro da operação.
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              Escolher ferramenta sem perguntar sobre backup, suporte e rastreabilidade.
            </li>
          </ul>
        </PublicSectionCard>
      </section>

      <section className="scroll-mt-28">
        <PublicSectionCard
          description="Se privacidade já faz parte da sua avaliação, o próximo passo é ver se o fluxo completo do produto conversa com isso."
          eyebrow="Resumo"
          title="LGPD vira critério de compra quando aparece no fluxo real"
        >
          <p className="text-sm leading-7 text-[var(--color-text-muted)]">
            No consultório, a pergunta prática não é apenas “o sistema fala de LGPD?”. A pergunta
            útil é “ele ajuda a operar com menos exposição, mais controle e menos improviso?”.
          </p>
        </PublicSectionCard>
      </section>
      </PublicArticleShell>
    </>
  );
}

function LegalCard({
  icon: Icon,
  text,
  title
}: {
  icon: typeof FileLock2;
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
