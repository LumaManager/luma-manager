import Image from "next/image";
import Link from "next/link";
import { Check, Minus } from "lucide-react";

export const metadata = {
  title: "Planos — Luma Manager",
  description: "Escolha o plano certo para o seu consultório."
};

const plans = [
  {
    id: "estudante",
    name: "Estudante",
    price: null,
    priceLabel: "Grátis",
    description: "Para quem está em formação e quer organizar a prática supervisionada.",
    highlight: false,
    cta: "Começar grátis",
    ctaHref: "/login",
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
    description: "Para o psicólogo autônomo com agenda em crescimento.",
    highlight: false,
    cta: "Assinar Solo",
    ctaHref: "/login",
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
    price: 179,
    priceLabel: "R$ 179",
    description: "Para quem tem agenda cheia e quer recuperar tempo depois da sessão.",
    highlight: true,
    cta: "Assinar Pro",
    ctaHref: "/login",
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
    description: "Para consultórios com volume alto ou mais de um terapeuta.",
    highlight: false,
    cta: "Falar com a equipe",
    ctaHref: "mailto:contato@lumamanager.com.br",
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
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(198,122,69,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,76,92,0.18),transparent_34%),linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-6 py-8 lg:px-8 lg:py-10">

      {/* Header */}
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.svg" alt="Luma" width={28} height={28} className="rounded-lg" />
          <span className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text)]">Luma</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="mx-auto mt-10 w-full max-w-[1200px] text-center lg:mt-16">
        <h1 className="text-[clamp(2.4rem,4vw,3.6rem)] font-semibold leading-[1.0] tracking-[-0.04em] text-[var(--color-text)]">
          O plano certo para o seu consultório.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-[var(--color-text-muted)]">
          Comece grátis. Atualize quando a agenda pedir.
        </p>
      </div>

      {/* Cards */}
      <div className="mx-auto mt-12 grid w-full max-w-[1200px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Comparison table — visible only on desktop */}
      <div className="mx-auto mt-16 hidden w-full max-w-[1200px] lg:block">
        <h2 className="mb-6 text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          Comparação completa
        </h2>
        <div className="overflow-hidden rounded-[28px] border border-[rgba(15,76,92,0.12)] bg-[rgba(255,253,248,0.9)] shadow-[0_18px_50px_rgba(15,76,92,0.07)]">
          {/* Table header */}
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

          {/* Rows */}
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

      {/* Archive note */}
      <div className="mx-auto mt-8 w-full max-w-[1200px]">
        <p className="text-center text-sm leading-7 text-[var(--color-text-muted)]">
          Casos encerrados ficam arquivados gratuitamente em todos os planos.
          Seus prontuários seguem acessíveis pelo tempo exigido pelo CFP,
          sem custo adicional.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="mx-auto mt-16 mb-8 w-full max-w-[1200px] text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Dúvidas sobre qual plano faz sentido para o seu caso?{" "}
          <a
            href="mailto:contato@lumamanager.com.br"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            Fale com a gente
          </a>
        </p>
      </div>
    </main>
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
        <Link
          href={plan.ctaHref}
          className={`mt-8 block rounded-[18px] px-5 py-3.5 text-center text-sm font-semibold transition ${
            plan.highlight
              ? "bg-white text-[var(--color-primary)] hover:bg-[rgba(255,255,255,0.9)]"
              : "bg-[var(--color-primary)] text-white hover:bg-[#0d3f4e]"
          }`}
        >
          {plan.cta}
        </Link>
      )}
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
