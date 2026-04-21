import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";
import { PublicDemoForm } from "@/components/marketing/public-demo-form";

export const metadata: Metadata = {
  title: "Solicitar demo | Luma Manager",
  description:
    "Peça uma demo do Luma Manager e veja como o fluxo de agenda, prontuário e privacidade se encaixa no consultório.",
  alternates: {
    canonical: "/solicitar-demo"
  }
};

const pageType = "demo_request_page";

export default function SolicitarDemoPage() {
  return (
    <PublicPageShell secondaryHref="/seguranca-e-privacidade">
      <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warning" className="bg-[rgba(255,255,255,0.14)] text-white">
                  Solicite uma demo
                </Badge>
                <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                  Resposta por e-mail
                </Badge>
              </div>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.3vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                Solicitar demo para ver o consultório em um fluxo mais claro.
              </h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                Se você quer avaliar o Luma Manager com foco em rotina real, esta página serve para
                entender o contexto e abrir a conversa certa. Sem formulário longo, sem pressão.
              </p>

              <div className="mt-7 grid gap-3 sm:max-w-2xl">
                <HeroBullet text="Mostre o cenário do seu consultório e o que precisa melhorar agora." />
                <HeroBullet text="Receba uma resposta com o próximo passo para agendar a conversa." />
                <HeroBullet text="Use a demo para validar encaixe, privacidade e ganho operacional." />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Ver como funciona"
                  ctaLocation="demo_request_hero_secondary"
                  href="/software-para-psicologos"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(255,255,255,0.18)] px-5 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]"
                >
                  Ver como funciona
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver segurança e privacidade"
                  ctaLocation="demo_request_hero_primary"
                  href="/seguranca-e-privacidade"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Ver segurança e privacidade
                  <ArrowRight className="h-4 w-4" />
                </TrackedCtaLink>
              </div>
            </div>

            <PublicDemoForm />
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <PublicSectionCard
            eyebrow="Antes da demo"
            title="O que a conversa precisa cobrir"
            description="A demo funciona melhor quando o cenário chega filtrado."
          >
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Seu modelo de atendimento e volume de sessões.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Onde hoje existe mais retrabalho: agenda, notas, documentos ou cobrança.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                O nível de cuidado que você espera em privacidade e acesso.
              </li>
            </ul>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="Durante a demo"
            title="O que vale observar"
            description="A meta não é uma apresentação genérica. É checar encaixe."
          >
            <div className="space-y-3">
              <MiniCard title="Fluxo diário" text="Como o sistema organiza o dia de atendimento." />
              <MiniCard title="Prontuário" text="Como o registro aparece sem virar formulário interminável." />
              <MiniCard title="Segurança" text="Como acesso e privacidade entram na operação." />
            </div>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="Depois da demo"
            title="Como avançar sem demora"
            description="Se houver fit, o próximo passo deve ser claro e objetivo."
          >
            <div className="space-y-3">
              <MiniCard title="Ajuste de fluxo" text="Mapeie o que precisa ser configurado primeiro." />
              <MiniCard title="Validação" text="Confirme o encaixe com o ritmo real do consultório." />
              <MiniCard title="Próxima ação" text="Defina se o melhor passo é piloto, migração ou contratação." />
            </div>
          </PublicSectionCard>
        </div>

        <PublicSectionCard
          eyebrow="Resumo"
          title="Se o seu consultório é pequeno, a demo precisa ser objetiva"
          description="O objetivo é descobrir rápido se o produto ajuda a reduzir atrito e dar mais clareza ao dia."
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
            <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
              <p className="text-sm font-semibold text-[var(--color-text)]">O que você recebe</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                Uma conversa curta por e-mail para alinhar contexto e, se fizer sentido, agendar a
                demonstração no ritmo do seu consultório.
              </p>
            </div>
            <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
              <p className="text-sm font-semibold text-[var(--color-text)]">O que evitar</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                Não vale preencher a página com detalhes que não ajudam a decidir. A ideia é
                reduzir fricção e acelerar a leitura de valor.
              </p>
            </div>
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

function MiniCard({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}
