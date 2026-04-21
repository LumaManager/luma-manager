import type { Metadata } from "next";
import type { ElementType } from "react";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Badge, Card, CardContent } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";

export const metadata: Metadata = {
  title: "Prontuário eletrônico para psicólogos | Luma Manager",
  description:
    "Prontuário eletrônico para psicólogos autônomos que querem registrar evolução, organizar histórico e reduzir retrabalho depois da sessão.",
  alternates: {
    canonical: "/prontuario-eletronico-para-psicologos"
  }
};

const pageType = "prontuario_eletronico_page";

const benefits = [
  {
    icon: FileText,
    title: "Registro pós-sessão mais leve",
    description:
      "Escreva a evolução com foco no que importa e volte ao atendimento sem acumular tarefas no fim do dia."
  },
  {
    icon: Workflow,
    title: "Histórico clínico organizado",
    description:
      "Mantenha contexto, continuidade e acesso ao que foi registrado em uma linha de trabalho clara."
  },
  {
    icon: ShieldCheck,
    title: "Estrutura pensada para privacidade",
    description:
      "Trabalhe com separação de acesso e organização operacional sem expor mais do que o necessário."
  }
] as const;

export default function ProntuarioEletronicoParaPsicologosPage() {
  return (
    <PublicPageShell>
      <div className="grid gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warning" className="bg-[rgba(255,255,255,0.14)] text-white">
                  Prontuário eletrônico
                </Badge>
                <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                  Para psicólogos autônomos
                </Badge>
              </div>

              <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.3vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                Prontuário eletrônico para psicólogos que precisam registrar sem perder o ritmo do consultório.
              </h1>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                O Luma Manager organiza a evolução clínica em um fluxo simples. A ideia é reduzir o
                retrabalho do pós-sessão, manter o histórico acessível e evitar que o prontuário vire
                mais uma fonte de atraso.
              </p>

              <div className="mt-7 grid gap-3 sm:max-w-2xl">
                <HeroBullet text="Registre a sessão enquanto o contexto ainda está fresco." />
                <HeroBullet text="Organize evolução, anexos e pendências sem depender de planilha ou anotações soltas." />
                <HeroBullet text="Use um fluxo pensado para consultório solo e clínica pequena." />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedCtaLink
                  ctaLabel="Solicitar demo"
                  ctaLocation="prontuario_page_hero_primary"
                  href="/solicitar-demo"
                  pageType={pageType}
                  className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                >
                  Solicitar demo
                  <ArrowRight className="h-4 w-4" />
                </TrackedCtaLink>
                <TrackedCtaLink
                  ctaLabel="Ver segurança e privacidade"
                  ctaLocation="prontuario_page_hero_secondary"
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
                  O que fica visível
                </p>
                <div className="space-y-3">
                  <MiniCard
                    icon={FileText}
                    title="Evolução da sessão"
                    description="Notas curtas, objetivas e organizadas para retomada rápida do caso."
                  />
                  <MiniCard
                    icon={Sparkles}
                    title="Contexto do paciente"
                    description="Informação relevante em um só lugar, sem espalhar o trabalho entre ferramentas."
                  />
                  <MiniCard
                    icon={ShieldCheck}
                    title="Controle do registro"
                    description="A operação clínica fica mais clara quando o acesso e o uso seguem uma estrutura."
                  />
                </div>
                <div className="rounded-[24px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.04)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Proposta simples</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    Menos fricção para documentar o atendimento e mais clareza para manter o cuidado
                    consistente ao longo do tempo.
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

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <PublicSectionCard
            eyebrow="Como funciona"
            title="O prontuário precisa ajudar a lembrar, não atrasar"
            description="O melhor fluxo é aquele que não empurra o registro para depois de toda a rotina."
          >
            <div className="grid gap-3 md:grid-cols-3">
              <StepCard
                number="01"
                title="Abra o caso"
                description="Encontre o paciente e o contexto sem caçar informação."
              />
              <StepCard
                number="02"
                title="Registre a evolução"
                description="Documente o essencial logo após a sessão."
              />
              <StepCard
                number="03"
                title="Retome com continuidade"
                description="Volte ao próximo encontro com o histórico organizado."
              />
            </div>
          </PublicSectionCard>

          <PublicSectionCard
            eyebrow="Para quem faz sentido"
            title="Feito para quem quer ordem clínica e menos retrabalho"
            description="Boa opção para profissionais que precisam de um prontuário prático, mas sem perder rigor."
          >
            <ul className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Psicólogo autônomo que registra depois de cada sessão.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Clínica pequena que quer padronizar evolução e histórico.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                Profissional que valoriza privacidade, acesso claro e rotina previsível.
              </li>
            </ul>
          </PublicSectionCard>
        </div>

        <PublicSectionCard
          eyebrow="Próximo passo"
          title="Quer ver o prontuário no contexto da sua rotina?"
          description="A demo ajuda a validar se o fluxo encaixa no seu jeito de atender."
        >
          <div className="flex flex-wrap gap-3">
            <TrackedCtaLink
              ctaLabel="Solicitar demo"
              ctaLocation="prontuario_page_footer_primary"
              href="/solicitar-demo"
              pageType={pageType}
              className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
            >
              Solicitar demo
            </TrackedCtaLink>
            <TrackedCtaLink
              ctaLabel="Ver segurança e privacidade"
              ctaLocation="prontuario_page_footer_secondary"
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
