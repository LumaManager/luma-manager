import Image from "next/image";
import Link from "next/link";
import { Check, Minus } from "lucide-react";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";
import { StructuredData } from "@/components/shared/structured-data";
import {
  buildBreadcrumbStructuredData,
  buildSoftwareApplicationStructuredData
} from "@/lib/marketing/structured-data";

export const metadata = {
  title: "Planos e acesso — Luma Manager",
  description: "Entenda os planos do beta e solicite uma demo para receber acesso."
};

const pricingPageType = "pricing_page";

const plans = [
  {
    id: "estudante",
    name: "Estudante",
    price: null,
    priceLabel: "Grátis",
    description: "Para quem está em formação e quer entender se o beta faz sentido antes de avançar.",
    highlight: false,
    cta: "Pedir demo",
    ctaHref: "/solicitar-demo",
    features: {
      patients: "5 pacientes ativos",
      aiText: "50 resumos por mês",
      transcription: false,
      agenda: true,
      records: true,
      documents: true,
      billing: true,
      archive: true,
      support: "E-mail"
    }
  },
  {
    id: "solo",
    name: "Solo",
    price: 99,
    priceLabel: "R$ 99",
    description: "Para o psicólogo autônomo que quer testar o fluxo completo com apoio.",
    highlight: false,
    cta: "Solicitar demo",
    ctaHref: "/solicitar-demo",
    features: {
      patients: "30 pacientes ativos",
      aiText: "Ilimitada",
      transcription: false,
      agenda: true,
      records: true,
      documents: true,
      billing: true,
      archive: true,
      support: "E-mail"
    }
  },
  {
    id: "pro",
    name: "Pro",
    price: 189,
    priceLabel: "R$ 189",
    description: "Para quem já sente a operação clínica travada e quer priorizar a entrada no beta.",
    highlight: true,
    cta: "Pedir acesso prioritário",
    ctaHref: "/solicitar-demo",
    features: {
      patients: "60 pacientes ativos",
      aiText: "Ilimitada",
      transcription: "Incluída",
      agenda: true,
      records: true,
      documents: true,
      billing: true,
      archive: true,
      support: "Prioritário"
    }
  },
  {
    id: "clinica",
    name: "Clínica",
    price: 299,
    priceLabel: "R$ 299",
    description: "Para consultórios com volume alto ou operação compartilhada.",
    highlight: false,
    cta: "Falar sobre o beta",
    ctaHref: "/solicitar-demo",
    features: {
      patients: "Ilimitados",
      aiText: "Ilimitada",
      transcription: "200 sessões/mês",
      agenda: true,
      records: true,
      documents: true,
      billing: true,
      archive: true,
      support: "Dedicado"
    }
  }
] as const;

const featureRows: { key: keyof (typeof plans)[0]["features"]; label: string }[] = [
  { key: "patients", label: "Pacientes ativos" },
  { key: "aiText", label: "IA de texto (notas, resumos, busca)" },
  { key: "transcription", label: "Transcrição de videochamada" },
  { key: "agenda", label: "Agenda e sessões" },
  { key: "records", label: "Prontuários clínicos" },
  { key: "documents", label: "Documentos e laudos" },
  { key: "billing", label: "Cobranças" },
  { key: "archive", label: "Arquivo de casos encerrados" },
  { key: "support", label: "Suporte" }
];

export default function PricingPage() {
  const structuredData = [
    buildBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Planos e acesso", path: "/pricing" }
    ]),
    buildSoftwareApplicationStructuredData({
      description: "Planos e acesso do beta do Luma Manager para psicologos autonomos.",
      path: "/pricing",
      offers: plans
        .filter((plan) => plan.price !== null)
        .map((plan) => ({
          name: plan.name,
          price: plan.price ?? undefined,
          url: "/pricing"
        }))
    })
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(198,122,69,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,76,92,0.18),transparent_34%),linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-6 py-8 lg:px-8 lg:py-10">
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.svg" alt="Luma" width={28} height={28} className="rounded-lg" />
            <span className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text)]">Luma</span>
          </Link>
        </div>

      <div className="mx-auto mt-10 w-full max-w-[1200px] text-center lg:mt-16">
        <p className="mx-auto inline-flex rounded-full border border-[rgba(15,76,92,0.14)] bg-[rgba(255,255,255,0.72)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Beta com acesso guiado
        </p>
        <h1 className="text-[clamp(2.4rem,4vw,3.6rem)] font-semibold leading-[1.0] tracking-[-0.04em] text-[var(--color-text)]">
          Entenda os planos e peça acesso pela demo.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-[var(--color-text-muted)]">
          Hoje o acesso é liberado por demo. Esta página ajuda a calibrar qual faixa faz mais sentido para o seu consultório antes da conversa.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <TrackedCtaLink
            className="rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d3f4e]"
            ctaLabel="Solicitar demo"
            ctaLocation="pricing_hero_primary"
            href="/solicitar-demo"
            pageType={pricingPageType}
          >
            Solicitar demo
          </TrackedCtaLink>
          <TrackedCtaLink
            className="rounded-full border border-[rgba(15,76,92,0.14)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-primary)]"
            ctaLabel="Segurança e privacidade"
            ctaLocation="pricing_hero_secondary"
            href="/seguranca-e-privacidade"
            pageType={pricingPageType}
          >
            Segurança e privacidade
          </TrackedCtaLink>
          <TrackedCtaLink
            className="rounded-full border border-[rgba(15,76,92,0.14)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-primary)]"
            ctaLabel="Ver a home"
            ctaLocation="pricing_hero_secondary"
            href="/"
            pageType={pricingPageType}
          >
            Ver a home
          </TrackedCtaLink>
        </div>
      </div>

      <div className="mx-auto mt-12 grid w-full max-w-[1200px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <div className="mx-auto mt-16 hidden w-full max-w-[1200px] lg:block">
        <h2 className="mb-6 text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          Comparação para decidir o próximo passo
        </h2>
        <div className="overflow-hidden rounded-[28px] border border-[rgba(15,76,92,0.12)] bg-[rgba(255,253,248,0.9)] shadow-[0_18px_50px_rgba(15,76,92,0.07)]">
          <div className="grid grid-cols-5 border-b border-[rgba(15,76,92,0.08)]">
            <div className="p-5" />
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-5 text-center ${plan.highlight ? "bg-[rgba(15,76,92,0.06)]" : ""}`}
              >
                <p className="text-sm font-semibold text-[var(--color-text)]">{plan.name}</p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--color-primary)]">
                  {plan.price ? `R$ ${plan.price}` : "Grátis"}
                  {plan.price ? <span className="text-xs font-normal text-[var(--color-text-muted)]">/mês</span> : null}
                </p>
              </div>
            ))}
          </div>

          {featureRows.map((row, i) => (
            <div
              key={row.key}
              className={`grid grid-cols-5 ${i < featureRows.length - 1 ? "border-b border-[rgba(15,76,92,0.06)]" : ""}`}
            >
              <div className="flex items-center px-5 py-4">
                <span className="text-sm text-[var(--color-text-muted)]">{row.label}</span>
              </div>
              {plans.map((plan) => {
                const value = plan.features[row.key];
                return (
                  <div
                    key={plan.id}
                    className={`flex items-center justify-center px-3 py-4 text-center ${plan.highlight ? "bg-[rgba(15,76,92,0.03)]" : ""}`}
                  >
                    <CellValue value={value} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-[1200px]">
        <p className="text-center text-sm leading-7 text-[var(--color-text-muted)]">
          Casos encerrados ficam arquivados gratuitamente em todos os planos.
          Seus prontuários seguem acessíveis pelo tempo exigido pelo CFP,
          sem custo adicional.
        </p>
      </div>

      <div className="mx-auto mt-10 grid w-full max-w-[1200px] gap-4 lg:grid-cols-4">
        <TrustPill
          title="Demo guiada"
          description="A conversa mostra o fluxo real antes de qualquer compromisso."
        />
        <TrustPill
          title="Beta assistido"
          description="O acesso entra em uma fila curta, com prioridade para aderência."
        />
        <TrustPill
          title="Revisão humana"
          description="A IA ajuda, mas o fechamento clínico continua sob decisão do terapeuta."
        />
        <TrustPill
          title="LGPD e privacidade"
          description="A página pública reforça o que o produto faz e o que não faz."
        />
      </div>

      <div className="mx-auto mt-16 w-full max-w-[1200px]">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            FAQ comercial
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">
            Perguntas rápidas antes da demo.
          </h2>
        </div>
        <div className="mt-6 grid gap-4">
          <FaqItem
            question="Como funciona o acesso hoje?"
            answer="Você pede uma demo, a equipe confirma aderência ao beta e libera o próximo passo com base no caso."
          />
          <FaqItem
            question="Preciso fechar contratação na hora?"
            answer="Não. A prioridade é entender o cenário do consultório e reduzir risco antes de qualquer compromisso."
          />
          <FaqItem
            question="Tem migração ou onboarding assistido?"
            answer="Sim. O fluxo comercial precisa abrir espaço para configuração, contexto e acomodação da operação atual."
          />
          <FaqItem
            question="Essa página mostra preço final?"
            answer="Ela mostra a faixa de referência por plano. O acesso real segue a conversa de demo no beta."
          />
        </div>
      </div>

        <div className="mx-auto mt-16 mb-8 w-full max-w-[1200px] text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Dúvidas sobre qual faixa faz sentido para o seu caso?{" "}
            <TrackedCtaLink
              ctaLabel="Solicite a demo"
              ctaLocation="pricing_footer_text"
              href="/solicitar-demo"
              pageType={pricingPageType}
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              Solicite a demo
            </TrackedCtaLink>
            {" "}e a equipe te orienta no acesso.
          </p>
        </div>
      </main>
    </>
  );
}

function PlanCard({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <div
      className={`relative flex flex-col rounded-[32px] border p-6 ${
        plan.highlight
          ? "border-[var(--color-primary)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_100%)] text-white shadow-[0_24px_60px_rgba(15,76,92,0.28)]"
          : "border-[rgba(15,76,92,0.14)] bg-[rgba(255,253,248,0.96)] shadow-[0_18px_40px_rgba(15,76,92,0.07)]"
      }`}
    >
      {plan.highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent)] px-4 py-1 text-xs font-semibold text-white">
          Mais escolhido
        </div>
      )}

      <div className="flex-1">
        <p className={`text-sm font-semibold uppercase tracking-[0.16em] ${plan.highlight ? "text-[rgba(255,255,255,0.6)]" : "text-[var(--color-text-muted)]"}`}>
          {plan.name}
        </p>

        <div className="mt-3 flex items-end gap-1">
          <span className={`text-[2.4rem] font-semibold leading-none tracking-[-0.04em] ${plan.highlight ? "text-white" : "text-[var(--color-text)]"}`}>
            {plan.priceLabel}
          </span>
          {plan.price && (
            <span className={`mb-1 text-sm ${plan.highlight ? "text-[rgba(255,255,255,0.55)]" : "text-[var(--color-text-muted)]"}`}>
              /mês
            </span>
          )}
        </div>

        <p className={`mt-3 text-sm leading-6 ${plan.highlight ? "text-[rgba(255,255,255,0.72)]" : "text-[var(--color-text-muted)]"}`}>
          {plan.description}
        </p>

        <ul className="mt-6 space-y-3">
          <FeatureLine highlight={plan.highlight} text={plan.features.patients} />
          <FeatureLine highlight={plan.highlight} text={`IA de texto: ${plan.features.aiText.toLowerCase()}`} />
          {plan.features.transcription ? (
            <FeatureLine highlight={plan.highlight} text={`Transcrição: ${plan.features.transcription.toLowerCase()}`} />
          ) : (
            <FeatureLine highlight={plan.highlight} text="Sem transcrição de áudio" muted />
          )}
          <FeatureLine highlight={plan.highlight} text="Agenda, prontuários e cobranças" />
          <FeatureLine highlight={plan.highlight} text={`Suporte ${plan.features.support.toLowerCase()}`} />
        </ul>
      </div>

      {plan.ctaHref.startsWith("mailto:") ? (
        <a
          href={plan.ctaHref}
          className={`mt-8 block rounded-[18px] px-5 py-3.5 text-center text-sm font-semibold transition ${
            plan.highlight
              ? "bg-white text-[var(--color-primary)] hover:bg-[rgba(255,255,255,0.9)]"
              : "bg-[var(--color-primary)] text-white hover:bg-[#0d3f4e]"
          }`}
        >
          {plan.cta}
        </a>
      ) : (
        <TrackedCtaLink
          className={`mt-8 block rounded-[18px] px-5 py-3.5 text-center text-sm font-semibold transition ${
            plan.highlight
              ? "bg-white text-[var(--color-primary)] hover:bg-[rgba(255,255,255,0.9)]"
              : "bg-[var(--color-primary)] text-white hover:bg-[#0d3f4e]"
          }`}
          ctaLabel={plan.cta}
          ctaLocation={`pricing_plan_${plan.id}`}
          href={plan.ctaHref}
          pageType={pricingPageType}
        >
          {plan.cta}
        </TrackedCtaLink>
      )}
    </div>
  );
}

function TrustPill({ description, title }: { description: string; title: string }) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.12)] bg-[rgba(255,253,248,0.92)] p-5 shadow-[0_18px_40px_rgba(15,76,92,0.06)]">
      <p className="text-sm font-semibold tracking-[-0.02em] text-[var(--color-text)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function FaqItem({ answer, question }: { answer: string; question: string }) {
  return (
    <div className="rounded-[24px] border border-[rgba(15,76,92,0.12)] bg-[rgba(255,253,248,0.94)] p-5 shadow-[0_18px_40px_rgba(15,76,92,0.05)]">
      <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-text)]">{question}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{answer}</p>
    </div>
  );
}

function FeatureLine({
  highlight,
  muted = false,
  text
}: {
  highlight: boolean;
  muted?: boolean;
  text: string;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <Check
        className={`mt-0.5 h-4 w-4 shrink-0 ${
          muted
            ? highlight ? "text-[rgba(255,255,255,0.3)]" : "text-[var(--color-border-strong)]"
            : highlight ? "text-[rgba(255,255,255,0.7)]" : "text-[var(--color-success)]"
        }`}
      />
      <span
        className={`text-sm leading-6 ${
          muted
            ? highlight ? "text-[rgba(255,255,255,0.35)]" : "text-[var(--color-text-muted)] line-through"
            : highlight ? "text-[rgba(255,255,255,0.85)]" : "text-[var(--color-text)]"
        }`}
      >
        {text}
      </span>
    </li>
  );
}

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="h-4 w-4 text-[var(--color-success)]" />;
  }
  if (value === false) {
    return <Minus className="h-4 w-4 text-[rgba(15,76,92,0.25)]" />;
  }
  return <span className="text-sm text-[var(--color-text)]">{value}</span>;
}
