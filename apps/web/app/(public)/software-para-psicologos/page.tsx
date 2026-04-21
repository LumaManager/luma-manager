import type { Metadata } from "next";
import type { ElementType } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, FileText, Wallet } from "lucide-react";
import { Badge, Card, CardContent } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";

export const metadata: Metadata = {
  title: "Software para psicólogos | Luma Manager",
  description:
    "Software para psicólogos autônomos que querem centralizar agenda, prontuário, documentos e cobranças em um fluxo simples.",
  alternates: {
    canonical: "/software-para-psicologos"
  }
};

const pageType = "software_para_psicologos_page";

const benefits = [
  {
    icon: CalendarDays,
    title: "Agenda com contexto",
    description: "Veja o que está marcado hoje, o que mudou e o que precisa de atenção antes da sessão."
  },
  {
    icon: FileText,
    title: "Prontuário e notas",
    description: "Registre a evolução logo depois do atendimento, sem empurrar tudo para o fim do dia."
  },
  {
    icon: Wallet,
    title: "Cobrança sem dispersão",
    description: "Saiba o que foi pago, o que está pendente e o que precisa de acompanhamento."
  }
] as const;

export default function SoftwareParaPsicologosPage() {
  return (
    <PublicPageShell>
      <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warning" className="bg-[rgba(255,255,255,0.14)] text-white">
                  Para psicólogos autônomos
                </Badge>
                <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                  Agenda, prontuário e cobrança
                </Badge>
              </div>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.3vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                Software para psicólogos que reduz o pós-sessão sem complicar o consultório.
              </h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                Centralize o fluxo do atendimento em um só lugar. O Luma Manager foi desenhado para
                psicólogos que precisam de rotina clara, menos troca de ferramentas e mais tempo
                para o que acontece na sessão.
              </p>

              <div className="mt-7 grid gap-3 sm:max-w-2xl">
                <HeroBullet text="Organize agenda, evolução, documentos e cobranças sem depender de planilha solta." />
                <HeroBullet text="Feche o atendimento com mais contexto e menos trabalho acumulado no fim do dia." />
                <HeroBullet text="Use uma experiência pensada para consultório solo e clínica pequena no Brasil." />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Solicitar demo"
                  ctaLocation="software_page_hero_primary"
                  href="/solicitar-demo"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Solicitar demo
                  <ArrowRight className="h-4 w-4" />
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver segurança e privacidade"
                  ctaLocation="software_page_hero_secondary"
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
                  O que o psicólogo vê
                </p>
                <div className="space-y-3">
                  <MiniCard
                    icon={CalendarDays}
                    title="Agenda do dia"
                    description="O próximo atendimento, o que mudou e o que exige ação antes da próxima sessão."
                  />
                  <MiniCard
                    icon={FileText}
                    title="Sessão e continuidade"
                    description="Notas curtas, contexto clínico e pendências organizadas para retomar a conversa sem recomeçar."
                  />
                  <MiniCard
                    icon={Wallet}
                    title="Financeiro operacional"
                    description="Cobrança, pendências e confirmação do que já foi resolvido."
                  />
                </div>
                <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.04)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Proposta simples</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    Menos ferramenta, menos contexto perdido, menos atrito para tocar o dia de
                    atendimento.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {benefits.map(({ description, icon: Icon, title }) => (
            <PublicSectionCard
              key={title}
              description={description}
              title={title}
            >
              <Icon className="h-5 w-5 text-[var(--color-primary)]" />
            </PublicSectionCard>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <PublicSectionCard
            eyebrow="Como funciona"
            title="Um fluxo curto, sem curva de adoção longa"
            description="A ideia é chegar rápido no valor, não obrigar o consultório a mudar toda a rotina de uma vez."
          >
            <div className="grid gap-3 md:grid-cols-3">
              <StepCard
                number="01"
                title="Entenda a rotina"
                description="Veja agenda, pacientes e cobranças em um mesmo lugar."
              />
              <StepCard
                number="02"
                title="Registre depois da sessão"
                description="Feche o atendimento com o contexto ainda fresco."
              />
              <StepCard
                number="03"
                title="Acompanhe pendências"
                description="Traga para a superfície o que não pode ficar esquecido."
              />
            </div>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="Para quem faz sentido"
            title="Feito para o consultório que quer clareza"
            description="Bom encaixe para quem ainda usa muitos atalhos, mas quer operar de forma mais organizada."
          >
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Psicólogo autônomo com agenda própria e pouco tempo entre sessões.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Clínica pequena que quer reduzir retrabalho operacional.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Profissional que valoriza segurança, privacidade e ordem documental.
              </li>
            </ul>
          </PublicSectionCard>
        </div>

        <PublicSectionCard
          eyebrow="Próximo passo"
          title="Quer ver o fluxo no contexto do seu consultório?"
          description="Se o seu caso envolve agenda, prontuário, documentos ou cobrança, a demo ajuda a validar o encaixe."
        >
          <div className="flex flex-wrap gap-3">
            <TrackedCtaLink
              ctaLabel="Solicitar demo"
              ctaLocation="software_page_footer_primary"
              href="/solicitar-demo"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
            >
              Solicitar demo
            </TrackedCtaLink>
            <TrackedCtaLink
              ctaLabel="Ver segurança e privacidade"
              ctaLocation="software_page_footer_secondary"
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
