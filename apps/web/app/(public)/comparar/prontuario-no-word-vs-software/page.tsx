import type { Metadata } from "next";
import type { ElementType } from "react";
import { ArrowRight, FileText, LockKeyhole, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@terapia/ui";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { PublicPageShell, PublicSectionCard } from "@/components/marketing/public-page-shell";
import { PublicComparisonMatrix } from "@/components/marketing/public-comparison-matrix";
import { StructuredData } from "@/components/shared/structured-data";
import { buildBreadcrumbStructuredData } from "@/lib/marketing/structured-data";

export const metadata: Metadata = {
  title: "Prontuário no Word vs software para psicólogo | Luma Manager",
  description:
    "Compare prontuário no Word com software para psicólogos e veja onde o documento solto começa a perder versão, contexto e controle.",
  alternates: {
    canonical: "/comparar/prontuario-no-word-vs-software"
  }
};

const pageType = "comparison_prontuario_page";

const comparisonRows = [
  {
    label: "Controle de versão",
    manual:
      "O documento circula por cópia e cola, e fica fácil perder qual é a versão certa para o atendimento.",
    software:
      "A evolução fica centralizada, com menos risco de trabalhar em cima de arquivos divergentes."
  },
  {
    label: "Busca de histórico",
    manual:
      "Recuperar algo antigo depende de procurar em pastas, anexos e nomes de arquivo.",
    software:
      "O histórico clínico fica mais fácil de localizar e retomar sem reabrir vários documentos."
  },
  {
    label: "Sigilo e acesso",
    manual:
      "A segurança depende de onde o arquivo foi salvo, quem recebeu cópia e como a pasta está organizada.",
    software:
      "O acesso passa a seguir um fluxo mais controlado, com menos dependência de disciplina individual."
  },
  {
    label: "Anexos e documentos",
    manual:
      "Consentimentos, laudos e anexos ficam espalhados entre arquivos e pastas diferentes.",
    software:
      "Documentos e prontuário seguem juntos no mesmo contexto operacional."
  },
  {
    label: "Padronização clínica",
    manual:
      "Cada profissional ou cada dia pode usar um modelo diferente, o que dificulta consistência.",
    software:
      "A estrutura fica mais repetível e ajuda a manter uma rotina uniforme no consultório."
  },
  {
    label: "Escala",
    manual:
      "Quanto maior o volume de pacientes, mais tempo se perde organizando documentos e versões.",
    software:
      "O prontuário cresce com o consultório sem exigir o mesmo nível de retrabalho manual."
  }
] as const;

export default function ProntuarioNoWordVsSoftwarePage() {
  const structuredData = buildBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Comparar", path: "/comparar" },
    {
      name: "Prontuário no Word vs software",
      path: "/comparar/prontuario-no-word-vs-software"
    }
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <PublicPageShell secondaryHref="/seguranca-e-privacidade">
        <div className="grid gap-6">
          <section className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,76,92,0.22)] lg:p-10">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="border border-white/20 bg-white/10 text-white">
                    Comparação de prontuário
                  </Badge>
                  <Badge className="border border-white/20 bg-white/10 text-white">
                    Linguagem clínica e operacional
                  </Badge>
                </div>

                <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,4.4vw,4.9rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                  Prontuário no Word vs software para psicólogo.
                </h1>
                <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                  O Word é útil para escrever. O problema começa quando o prontuário precisa de
                  versão única, busca rápida, organização de anexos e uma rotina que continue
                  funcionando conforme o volume cresce.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <TrackedCtaLink
                    href="/solicitar-demo"
                    className="inline-flex h-[52px] items-center gap-2 rounded-[20px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                    ctaLabel="Solicitar demo"
                    ctaLocation="comparison_prontuario_hero_primary"
                    pageType={pageType}
                  >
                    Solicitar demo
                  </TrackedCtaLink>
                  <TrackedCtaLink
                    href="/seguranca-e-privacidade"
                    className="inline-flex h-[52px] items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.18)] px-5 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]"
                    ctaLabel="Ver segurança e privacidade"
                    ctaLocation="comparison_prontuario_hero_secondary"
                    pageType={pageType}
                  >
                    Ver segurança e privacidade
                  </TrackedCtaLink>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/14 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  Sinais de alerta
                </p>
                <div className="mt-4 grid gap-3">
                  <MiniStat icon={FileText} title="Arquivos soltos" text="Notas, laudos e consentimentos vivem em locais diferentes." />
                  <MiniStat icon={Search} title="Busca lenta" text="Encontrar histórico antigo exige abrir mais de um documento." />
                  <MiniStat icon={LockKeyhole} title="Acesso informal" text="A proteção depende do arquivo, da pasta e de quem recebeu cópia." />
                  <MiniStat icon={ShieldCheck} title="Risco crescente" text="O problema aumenta conforme o número de pacientes cresce." />
                </div>
              </div>
            </div>
          </section>

          <PublicSectionCard
            eyebrow="Comparação direta"
            title="Quando o prontuário precisa ser mais do que um documento"
            description="A comparação abaixo mostra por que o prontuário precisa de estrutura operacional, e não apenas de espaço para texto."
          >
            <PublicComparisonMatrix
              rows={comparisonRows}
              leftLabel="Word e arquivos"
              rightLabel="Software para psicólogo"
            />
          </PublicSectionCard>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <PublicSectionCard
              eyebrow="Quando o Word ainda ajuda"
              title="Documento solto serve enquanto o caso é muito simples"
              description="Se o consultório é pequeno e a necessidade é só registrar texto, o Word ainda pode cumprir um papel inicial."
            >
              <div className="grid gap-4">
                <Reason text="Poucos atendimentos e pouca necessidade de consulta posterior." />
                <Reason text="Baixa dependência de anexos, consentimentos e rastreamento." />
                <Reason text="Fluxo muito simples, sem necessidade de padronização entre profissionais." />
              </div>
            </PublicSectionCard>

            <PublicSectionCard
              eyebrow="Onde o software vence"
              title="O ganho real aparece em versão, contexto e organização"
              description="O software vira vantagem quando o prontuário precisa acompanhar uma operação clínica mais séria."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniCard title="Mais contexto" text="O histórico fica mais fácil de retomar sem caçar pastas e cópias." />
                <MiniCard title="Menos risco" text="A rotina deixa de depender da disciplina de arquivo local." />
                <MiniCard title="Mais padronização" text="A estrutura clínica se repete com menos variação." />
                <MiniCard title="Mais escala" text="O volume cresce sem o mesmo peso de retrabalho manual." />
              </div>
            </PublicSectionCard>
          </div>

          <PublicSectionCard
            eyebrow="Próximo passo"
            title="Se o prontuário já depende de improviso, vale testar o fluxo ao vivo"
            description="A demo ajuda a avaliar se o consultório ganha mais previsibilidade com um sistema único de agenda, prontuário e documentos."
          >
            <div className="flex flex-wrap gap-3">
              <TrackedCtaLink
                href="/solicitar-demo"
                className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                ctaLabel="Solicitar demo"
                ctaLocation="comparison_prontuario_bottom_primary"
                pageType={pageType}
              >
                Solicitar demo
              </TrackedCtaLink>
              <TrackedCtaLink
                href="/comparar/planilha-e-whatsapp-vs-software"
                className="inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(15,76,92,0.18)] px-4 text-sm font-medium text-[var(--color-text)] transition hover:bg-[rgba(15,76,92,0.04)]"
                ctaLabel="Ver planilha e WhatsApp vs software"
                ctaLocation="comparison_prontuario_bottom_secondary"
                pageType={pageType}
              >
                Ver planilha e WhatsApp vs software
              </TrackedCtaLink>
            </div>
          </PublicSectionCard>
        </div>
      </PublicPageShell>
    </>
  );
}

function MiniStat({
  icon: Icon,
  text,
  title
}: {
  icon: ElementType;
  text: string;
  title: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/12 bg-white/[0.08] p-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[rgba(255,255,255,0.72)]">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Reason({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[22px] border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.03)] p-4">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(15,76,92,0.12)]">
        <ArrowRight className="h-3.5 w-3.5 text-[var(--color-primary)]" />
      </div>
      <p className="text-sm leading-7 text-[var(--color-text-muted)]">{text}</p>
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
