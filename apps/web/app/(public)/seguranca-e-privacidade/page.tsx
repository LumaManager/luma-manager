import type { Metadata } from "next";
import type { ElementType } from "react";
import { ArrowRight, CheckCircle2, Eye, FileLock2, ShieldCheck, Users, Workflow } from "lucide-react";
import { Badge, Card, CardContent } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";

export const metadata: Metadata = {
  title: "Segurança e privacidade | Luma Manager",
  description:
    "Entenda como a Luma organiza acesso, auditoria e privacidade para o trabalho clínico do psicólogo.",
  alternates: {
    canonical: "/seguranca-e-privacidade"
  }
};

const pageType = "seguranca_e_privacidade_page";

const principles = [
  {
    icon: FileLock2,
    title: "Mínimo necessário",
    description: "Estruture o trabalho com o menor volume de informação visível para cada etapa."
  },
  {
    icon: Users,
    title: "Acesso por perfil",
    description: "Separe o que é do terapeuta, da operação e do acesso interno sem misturar tudo."
  },
  {
    icon: Eye,
    title: "Auditoria e rastreio",
    description: "Tenha leitura de ação sem transformar o sistema em exposição desnecessária."
  }
] as const;

export default function SegurancaEPrivacidadePage() {
  return (
    <PublicPageShell secondaryHref="/software-para-psicologos">
      <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warning" className="bg-[rgba(255,255,255,0.14)] text-white">
                  Segurança e privacidade
                </Badge>
                <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                  Pensado para trabalho clínico
                </Badge>
              </div>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.3vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                Segurança e privacidade para o trabalho clínico não serem uma etapa extra.
              </h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                O Luma Manager organiza o consultório com foco em controle, rastreio e separação de
                acesso. A proposta é reduzir risco operacional sem transformar a rotina em um
                labirinto de permissões.
              </p>

              <div className="mt-7 grid gap-3 sm:max-w-2xl">
                <HeroBullet text="Mostre apenas o necessário para cada etapa do fluxo." />
                <HeroBullet text="Mantenha visibilidade sobre quem fez o quê, sem expor conteúdo além do devido." />
                <HeroBullet text="Trabalhe com uma base de operação pensada para o contexto de psicologia no Brasil." />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Solicitar demo"
                  ctaLocation="security_page_hero_primary"
                  href="/solicitar-demo"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Solicitar demo
                  <ArrowRight className="h-4 w-4" />
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver o software"
                  ctaLocation="security_page_hero_secondary"
                  href="/software-para-psicologos"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.18)] px-5 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]"
                >
                  Ver o software
                </TrackedCtaLink>
              </div>
            </div>

            <Card className="overflow-hidden border-[rgba(255,255,255,0.14)] bg-[rgba(255,253,248,0.98)] shadow-[0_22px_60px_rgba(7,24,29,0.24)]">
              <CardContent className="space-y-4 p-6 text-[var(--color-text)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  O que a página quer deixar claro
                </p>
                <div className="space-y-3">
                  <MiniCard
                    icon={ShieldCheck}
                    title="Controle"
                    description="A operação não deve depender de acesso amplo para todo mundo."
                  />
                  <MiniCard
                    icon={Workflow}
                    title="Fluxo"
                    description="A rotina deve seguir o atendimento, não o contrário."
                  />
                  <MiniCard
                    icon={Eye}
                    title="Rastreio"
                    description="O sistema precisa permitir leitura operacional sem expor demais."
                  />
                </div>
                <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.04)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Posicionamento correto</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    Não é sobre prometer mágica. É sobre mostrar que o produto foi pensado para
                    reduzir exposição desnecessária e manter o consultório organizado.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {principles.map(({ description, icon: Icon, title }) => (
            <PublicSectionCard
              key={title}
              description={description}
              title={title}
            >
              <Icon className="h-5 w-5 text-[var(--color-primary)]" />
            </PublicSectionCard>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <PublicSectionCard
            eyebrow="O que importa"
            title="O consultório precisa de previsibilidade, não de complexidade"
            description="A conversa com o cliente fica mais forte quando a segurança é concreta e operacional."
          >
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Controle de acesso e separação clara entre perfis.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Leitura de auditoria e rastreabilidade para operação e suporte.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Estrutura para guardar só o que o fluxo clínico realmente precisa.
              </li>
            </ul>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="Como usar na venda"
            title="Use esta página para responder objeções cedo"
            description="A etapa de segurança normalmente destrava o cliente quando ele está comparando opções."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <InfoCard
                title="Antes da demo"
                text="Mostre que o produto não é uma caixa-preta e que o cliente consegue entender o fluxo."
              />
              <InfoCard
                title="Durante a demo"
                text="Explique como acesso, registro e rastreio aparecem na prática."
              />
              <InfoCard
                title="Depois da demo"
                text="Envie esta página como apoio para a decisão interna do profissional."
              />
              <InfoCard
                title="Na conversa final"
                text="Volte ao ponto central: menos fricção operacional com mais controle."
              />
            </div>
          </PublicSectionCard>
        </div>

        <PublicSectionCard
          eyebrow="Próximo passo"
          title="Se privacidade é uma exigência no seu caso, vale olhar o fluxo completo"
          description="O melhor jeito de validar é ver a operação e as proteções no contexto da rotina do consultório."
        >
          <div className="flex flex-wrap gap-3">
            <TrackedCtaLink
              ctaLabel="Solicitar demo"
              ctaLocation="security_page_footer_primary"
              href="/solicitar-demo"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
            >
              Solicitar demo
            </TrackedCtaLink>
            <TrackedCtaLink
              ctaLabel="Ver o software"
              ctaLocation="security_page_footer_secondary"
              href="/software-para-psicologos"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.18)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
            >
              Ver o software
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

function InfoCard({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}
