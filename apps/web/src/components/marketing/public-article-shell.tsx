import type { ReactNode } from "react";

import { Badge } from "@terapia/ui";

import { ContentEngagementTracker } from "@/components/analytics/content-engagement-tracker";
import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";

export type PublicArticleTocItem = {
  href: string;
  label: string;
};

export function PublicArticleShell({
  children,
  description,
  eyebrow,
  readingTime,
  title,
  toc
}: {
  children: ReactNode;
  description: string;
  eyebrow: string;
  readingTime: string;
  title: string;
  toc: PublicArticleTocItem[];
}) {
  return (
    <PublicPageShell secondaryHref="/seguranca-e-privacidade" primaryHref="/solicitar-demo">
      <ContentEngagementTracker contentKind="article" />
      <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warning" className="bg-[rgba(255,255,255,0.14)] text-white">
                  {eyebrow}
                </Badge>
                <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                  {readingTime}
                </Badge>
              </div>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.3vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                {title}
              </h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                {description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Solicitar demo"
                  ctaLocation="blog_article_hero_primary"
                  href="/solicitar-demo"
                  pageType="blog_article_page"
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Solicitar demo
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver segurança e privacidade"
                  ctaLocation="blog_article_hero_secondary"
                  href="/seguranca-e-privacidade"
                  pageType="blog_article_page"
                  className="inline-flex h-[52px] items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.18)] px-5 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]"
                >
                  Ver segurança e privacidade
                </TrackedCtaLink>
              </div>
            </div>

            <PublicSectionCard
              eyebrow="Leitura guiada"
              title="O que este artigo cobre"
              description="Use a trilha ao lado para navegar direto para a parte que responde a sua dúvida atual."
            >
              <ol className="space-y-3">
                {toc.map((item, index) => (
                  <li key={item.href} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(15,76,92,0.08)] text-xs font-semibold text-[var(--color-primary)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={item.href}
                      className="text-sm leading-6 text-[var(--color-text)] transition hover:text-[var(--color-primary)]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </PublicSectionCard>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="grid gap-4">{children}</article>

          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <PublicSectionCard
              eyebrow="Próximo passo"
              title="Quer validar o fluxo no seu consultório?"
              description="Se o artigo apontou uma dor real, a demo ajuda a ver como isso se resolve na prática."
            >
              <div className="flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Solicitar demo"
                  ctaLocation="blog_article_sidebar_primary"
                  href="/solicitar-demo"
                  pageType="blog_article_page"
                  className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Solicitar demo
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver o software"
                  ctaLocation="blog_article_sidebar_secondary"
                  href="/software-para-psicologos"
                  pageType="blog_article_page"
                  className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.18)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
                >
                  Ver o software
                </TrackedCtaLink>
              </div>
            </PublicSectionCard>

            <PublicSectionCard
              eyebrow="Leitura recomendada"
              title="Continue pela trilha mais útil"
              description="Os artigos abaixo seguem a ordem natural de decisão e operação."
            >
              <div className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
                <p>
                  Comece por escolher a ferramenta. Depois organize a rotina. Por fim, valide as
                  exigências de privacidade.
                </p>
                <p>
                  A sequência reduz comparação dispersa e ajuda a transformar leitura em decisão.
                </p>
              </div>
            </PublicSectionCard>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
