import type { Metadata } from "next";
import type { ElementType } from "react";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { Badge } from "@terapia/ui";

import { PublicArticleCard } from "@/components/marketing/public-article-card";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";
import { StructuredData } from "@/components/shared/structured-data";
import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { buildBreadcrumbStructuredData } from "@/lib/marketing/structured-data";

export const metadata: Metadata = {
  title: "Blog para psicólogos | Luma Manager",
  description:
    "Artigos práticos para escolher software, organizar rotina clínica e entender LGPD no consultório.",
  alternates: {
    canonical: "/blog"
  }
};

const pageType = "blog_hub_page";

const articles = [
  {
    href: "/blog/como-escolher-software-para-psicologo",
    tag: "Meio de funil",
    title: "Como escolher software para psicólogo",
    description:
      "Critérios práticos para comparar ferramentas sem cair em lista de recurso que não entra na rotina real.",
    readingTime: "Leitura de 7 min",
    ctaLocation: "blog_hub_article_1"
  },
  {
    href: "/blog/como-organizar-agenda-e-prontuario",
    tag: "Meio de funil",
    title: "Como organizar agenda e prontuário",
    description:
      "Um fluxo simples para reduzir o pós-sessão, manter contexto clínico e evitar retrabalho no fim do dia.",
    readingTime: "Leitura de 6 min",
    ctaLocation: "blog_hub_article_2"
  },
  {
    href: "/blog/lgpd-para-psicologos-consultorio",
    tag: "Fundo de funil",
    title: "LGPD para psicólogos no consultório",
    description:
      "O que importa na prática, quais perguntas fazer ao fornecedor e como usar privacidade como critério de compra.",
    readingTime: "Leitura de 8 min",
    ctaLocation: "blog_hub_article_3"
  }
] as const;

export default function BlogPage() {
  const structuredData = buildBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" }
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <PublicPageShell secondaryHref="/seguranca-e-privacidade">
        <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warning" className="bg-[rgba(255,255,255,0.14)] text-white">
                  Blog
                </Badge>
                <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                  Conteúdo prático para psicólogos
                </Badge>
              </div>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.3vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                Conteúdo para decidir melhor, organizar a rotina e reduzir o peso operacional do consultório.
              </h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                Este hub reúne artigos de meio e fundo de funil para quem está comparando software,
                estruturando agenda e prontuário ou revisando LGPD antes de avançar.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Solicitar demo"
                  ctaLocation="blog_hub_hero_primary"
                  href="/solicitar-demo"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Solicitar demo
                  <ArrowRight className="h-4 w-4" />
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver segurança e privacidade"
                  ctaLocation="blog_hub_hero_secondary"
                  href="/seguranca-e-privacidade"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.18)] px-5 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]"
                >
                  Ver segurança e privacidade
                </TrackedCtaLink>
              </div>
            </div>

            <PublicSectionCard
              eyebrow="Trilha recomendada"
              title="Como usar o blog sem perder tempo"
              description="Siga a ordem que combina decisão, operação e validação final."
            >
              <div className="space-y-3">
                <QuickStep
                  icon={CheckCircle2}
                  title="1. Escolha o software"
                  text="Compare o que realmente reduz atrito no dia a dia."
                />
                <QuickStep
                  icon={FileText}
                  title="2. Organize o fluxo"
                  text="Ajuste agenda e prontuário para o pós-sessão caber na rotina."
                />
                <QuickStep
                  icon={ShieldCheck}
                  title="3. Revise LGPD"
                  text="Valide o que o fornecedor oferece antes de fechar decisão."
                />
              </div>
            </PublicSectionCard>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {articles.map((article) => (
            <PublicArticleCard
              key={article.href}
              ctaLabel="Ler artigo"
              ctaLocation={article.ctaLocation}
              description={article.description}
              href={article.href}
              readingTime={article.readingTime}
              tag={article.tag}
              title={article.title}
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <PublicSectionCard
            eyebrow="Por que estes temas"
            title="A trilha reflete as dúvidas que costumam aparecer na decisão"
            description="O blog foi montado para responder o que pesa na compra e no uso real do produto."
          >
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Primeiro, o consultório quer comparar software sem cair em argumento genérico.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Depois, precisa transformar a ferramenta em rotina antes de ampliar a operação.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Por fim, o tema LGPD entra como filtro de decisão e argumento de confiança.
              </li>
            </ul>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="Próximo passo"
            title="Se a dúvida é operacional, o caminho mais curto é ver o fluxo no produto"
            description="Você pode usar o blog para educar a decisão e a demo para confirmar o encaixe."
          >
            <div className="flex flex-wrap gap-3">
              <TrackedCtaLink
                ctaLabel="Solicitar demo"
                ctaLocation="blog_hub_footer_primary"
                href="/solicitar-demo"
                pageType={pageType}
                className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
              >
                Solicitar demo
              </TrackedCtaLink>
              <TrackedCtaLink
                ctaLabel="Ver o software"
                ctaLocation="blog_hub_footer_secondary"
                href="/software-para-psicologos"
                pageType={pageType}
                className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.18)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
              >
                Ver o software
              </TrackedCtaLink>
            </div>
          </PublicSectionCard>
        </div>
        </div>
      </PublicPageShell>
    </>
  );
}

function QuickStep({
  icon: Icon,
  text,
  title
}: {
  icon: ElementType;
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
