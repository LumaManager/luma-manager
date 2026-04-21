import type { Metadata } from "next";
import type { ElementType } from "react";
import { ArrowRight, CheckCircle2, FileSignature, Files, ShieldCheck, Workflow } from "lucide-react";
import { Badge, Card, CardContent } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";

export const metadata: Metadata = {
  title: "Documentos e consentimentos para psicólogos | Luma Manager",
  description:
    "Documentos e consentimentos para psicólogos autônomos que querem padronizar termos, orientar clientes e reduzir retrabalho administrativo.",
  alternates: {
    canonical: "/documentos-e-consentimentos-para-psicologos"
  }
};

const pageType = "documentos_e_consentimentos_page";

const benefits = [
  {
    icon: FileSignature,
    title: "Termos mais claros",
    description:
      "Padronize documentos e consentimentos para reduzir dúvidas e dar mais segurança ao fluxo."
  },
  {
    icon: Files,
    title: "Versões organizadas",
    description:
      "Mantenha modelos e materiais de apoio em uma estrutura fácil de encontrar e atualizar."
  },
  {
    icon: ShieldCheck,
    title: "Menos risco de improviso",
    description:
      "Quando os combinados estão organizados, a rotina fica mais consistente e fácil de explicar."
  }
] as const;

export default function DocumentosEConsentimentosParaPsicologosPage() {
  return (
    <PublicPageShell>
      <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warning" className="bg-[rgba(255,255,255,0.14)] text-white">
                  Documentos e consentimentos
                </Badge>
                <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                  Para psicólogos autônomos
                </Badge>
              </div>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.3vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                Documentos e consentimentos para psicólogos que querem padronizar a rotina sem perder o cuidado.
              </h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                O consultório ganha clareza quando termos, orientações e consentimentos deixam de
                viver espalhados. A proposta aqui é simplificar a organização documental e reduzir
                trabalho repetido.
              </p>

              <div className="mt-7 grid gap-3 sm:max-w-2xl">
                <HeroBullet text="Padronize o que o paciente precisa entender antes e durante o acompanhamento." />
                <HeroBullet text="Centralize documentos sem depender de versões soltas em múltiplos arquivos." />
                <HeroBullet text="Deixe a operação documental mais fácil de manter e explicar." />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Solicitar demo"
                  ctaLocation="documentos_page_hero_primary"
                  href="/solicitar-demo"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Solicitar demo
                  <ArrowRight className="h-4 w-4" />
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver segurança e privacidade"
                  ctaLocation="documentos_page_hero_secondary"
                  href="/seguranca-e-privacidade"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.18)] px-5 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]"
                >
                  Ver segurança e privacidade
                </TrackedCtaLink>
              </div>
            </div>

            <Card className="overflow-hidden border-[rgba(255,255,255,0.14)] bg-[rgba(255,253,248,0.98)] shadow-[0_22px_60px_rgba(7,24,29,0.24)]">
              <CardContent className="space-y-4 p-6 text-[var(--color-text)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  O que entra na organização
                </p>
                <div className="space-y-3">
                  <MiniCard
                    icon={FileSignature}
                    title="Consentimentos"
                    description="O paciente entende os termos e o fluxo com menos ruído."
                  />
                  <MiniCard
                    icon={Files}
                    title="Documentos de apoio"
                    description="Materiais e modelos ficam mais fáceis de localizar e atualizar."
                  />
                  <MiniCard
                    icon={Workflow}
                    title="Processo consistente"
                    description="A documentação acompanha a operação, não o contrário."
                  />
                </div>
                <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.04)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Posicionamento</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    Em vez de tratar documento como exceção, a página mostra como o consultório pode
                    tornar essa etapa mais previsível.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {benefits.map(({ description, icon: Icon, title }) => (
            <PublicSectionCard key={title} description={description} title={title}>
              <Icon className="h-5 w-5 text-[var(--color-primary)]" />
            </PublicSectionCard>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
          <PublicSectionCard
            eyebrow="Como funciona"
            title="Documentação boa é a que organiza o cuidado e reduz atrito"
            description="O foco é padronizar o básico sem transformar tudo em burocracia."
          >
            <div className="grid gap-3 md:grid-cols-3">
              <StepCard
                number="01"
                title="Estruture os documentos"
                description="Coloque consentimentos e orientações em um fluxo fácil de manter."
              />
              <StepCard
                number="02"
                title="Use na conversa"
                description="Deixe os combinados mais claros para o paciente desde o início."
              />
              <StepCard
                number="03"
                title="Atualize sem fricção"
                description="Troque versões e ajuste o material sem perder controle do que está em uso."
              />
            </div>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="Para quem faz sentido"
            title="Boa escolha para o consultório que quer menos improviso"
            description="Especialmente útil quando o profissional quer mais consistência na experiência do paciente."
          >
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Psicólogo que precisa organizar consentimentos e orientações.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Consultório que atualiza documentos com frequência.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Operação que quer reduzir retrabalho administrativo sem perder clareza.
              </li>
            </ul>
          </PublicSectionCard>
        </div>

        <PublicSectionCard
          eyebrow="Próximo passo"
          title="Se documentos e consentimentos ainda estão soltos, a demo mostra o fluxo completo"
          description="A conversa ajuda a enxergar como isso entra na rotina sem aumentar o caos operacional."
        >
          <div className="flex flex-wrap gap-3">
            <TrackedCtaLink
              ctaLabel="Solicitar demo"
              ctaLocation="documentos_page_footer_primary"
              href="/solicitar-demo"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
            >
              Solicitar demo
            </TrackedCtaLink>
            <TrackedCtaLink
              ctaLabel="Ver segurança e privacidade"
              ctaLocation="documentos_page_footer_secondary"
              href="/seguranca-e-privacidade"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.18)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
            >
              Ver segurança e privacidade
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

function StepCard({
  description,
  number,
  title
}: {
  description: string;
  number: string;
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
        {number}
      </p>
      <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}
