import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
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

