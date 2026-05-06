"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  OnboardingCompleteStepRequest,
  OnboardingStepKey,
  TherapistOnboardingBootstrap
} from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";

type OnboardingWizardProps = {
  initialData: TherapistOnboardingBootstrap;
};

export function OnboardingWizard({ initialData }: OnboardingWizardProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentStep = data.currentStep;
  const currentStepMeta = data.steps.find((step) => step.key === currentStep);

  function updateDraft<K extends keyof TherapistOnboardingBootstrap["draft"]>(
    section: K,
    value: TherapistOnboardingBootstrap["draft"][K]
  ) {
    setData((current) => ({
      ...current,
      draft: {
        ...current.draft,
        [section]: value
      }
    }));
  }

  function submitCurrentStep() {
    setError(null);

    startTransition(async () => {
      try {
        if (currentStep === "welcome") {
          const response = await fetch("/api/account/onboarding/start", {
            method: "POST"
          });

          if (!response.ok) {
            throw new Error("Não foi possível iniciar o onboarding.");
          }

          const payload = (await response.json()) as { onboarding: TherapistOnboardingBootstrap };
          setData(payload.onboarding);
          router.refresh();
          return;
        }

        const body = buildStepPayload(currentStep, data);
        const response = await fetch("/api/account/onboarding/complete-step", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error("Não foi possível salvar a etapa.");
        }

        const payload = (await response.json()) as {
          onboarding: TherapistOnboardingBootstrap;
          accountStatus: TherapistOnboardingBootstrap["accountStatus"];
        };

        setData(payload.onboarding);
        router.refresh();

        if (payload.accountStatus === "ready_for_operations") {
          router.push("/app/dashboard");
        }
      } catch (submitError) {
        setError(
          submitError instanceof Error ? submitError.message : "Erro inesperado ao salvar a etapa."
        );
      }
    });
  }

  const completedCount = data.steps.filter((s) => s.status === "completed").length;
  const totalCount = data.steps.length;

  return (
    <div className="space-y-6">
      {/* Compact header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Ativação da conta</h1>
          <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">
            {completedCount} de {totalCount} etapas concluídas
          </p>
        </div>
        <Badge tone={data.accountStatus === "ready_for_operations" ? "success" : "warning"}>
          {data.accountStatus === "ready_for_operations" ? "Conta pronta" : "Em ativação"}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[200px_minmax(0,1fr)]">
        {/* Compact step list */}
        <div className="space-y-1">
          {data.steps.map((step, index) => (
            <div
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
                step.status === "current"
                  ? "bg-[rgba(15,76,92,0.07)] font-semibold text-[var(--color-primary)]"
                  : step.status === "completed"
                    ? "text-[var(--color-text-muted)]"
                    : "text-[var(--color-text-muted)] opacity-50"
              }`}
              key={step.key}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  step.status === "completed"
                    ? "bg-[var(--color-primary)] text-white"
                    : step.status === "current"
                      ? "border-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                {step.status === "completed" ? "✓" : index + 1}
              </span>
              {step.title}
            </div>
          ))}
        </div>

        {/* Step form */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">{currentStepMeta?.title}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepFields(data, updateDraft)}

            {error ? (
              <p className="rounded-2xl bg-[rgba(178,74,58,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
                {error}
              </p>
            ) : null}

            <div className="flex justify-end">
              <Button disabled={isPending} onClick={submitCurrentStep} type="button">
                {isPending
                  ? "Salvando..."
                  : currentStep === "welcome"
                    ? "Começar"
                    : currentStep === "consents"
                      ? "Concluir ativação"
                      : "Salvar e continuar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function buildStepPayload(
  step: OnboardingStepKey,
  data: TherapistOnboardingBootstrap
): OnboardingCompleteStepRequest {
  switch (step) {
    case "welcome":
      return {
        step,
        payload: {
          welcomeAcknowledged: true
        }
      };
    case "profile":
      return { step, payload: data.draft.profile };
    case "operations":
      return { step, payload: data.draft.operations };
    case "tax":
      return { step, payload: data.draft.tax };
    case "contracts":
      return { step, payload: data.draft.contracts };
    case "schedule":
      return { step, payload: data.draft.schedule };
    case "consents":
      return { step, payload: data.draft.consents };
  }
}

function renderStepFields(
  data: TherapistOnboardingBootstrap,
  updateDraft: <K extends keyof TherapistOnboardingBootstrap["draft"]>(
    section: K,
    value: TherapistOnboardingBootstrap["draft"][K]
  ) => void
) {
  switch (data.currentStep) {
    case "welcome":
      return (
        <div className="rounded-3xl border border-dashed border-[var(--color-border-strong)] bg-[rgba(15,76,92,0.04)] p-5">
          <p className="font-semibold">Tenha isto em mãos antes de continuar</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-muted)]">
            <li>CRP, CPF e dados da prática profissional.</li>
            <li>Dados de recebimento e declaração tributária mínima.</li>
            <li>Definição inicial de agenda e modelos padrão de consentimento.</li>
          </ul>
        </div>
      );
    case "profile":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Nome completo"
            onChange={(value) =>
              updateDraft("profile", { ...data.draft.profile, fullName: value })
            }
            value={data.draft.profile.fullName}
          />
          <TextField
            label="CRP"
            onChange={(value) => updateDraft("profile", { ...data.draft.profile, crp: value })}
            value={data.draft.profile.crp}
          />
          <TextField
            label="CPF"
            onChange={(value) => updateDraft("profile", { ...data.draft.profile, cpf: value })}
            value={data.draft.profile.cpf}
          />
          <TextField
            label="E-mail profissional"
            onChange={(value) =>
              updateDraft("profile", { ...data.draft.profile, professionalEmail: value })
            }
            value={data.draft.profile.professionalEmail}
          />
          <TextAreaField
            className="md:col-span-2"
            label="Mini bio profissional"
            onChange={(value) =>
              updateDraft("profile", { ...data.draft.profile, miniBio: value })
            }
            value={data.draft.profile.miniBio}
          />
        </div>
      );
    case "operations":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Nome da prática"
            onChange={(value) =>
              updateDraft("operations", { ...data.draft.operations, practiceName: value })
            }
            value={data.draft.operations.practiceName}
          />
          <TextField
            label="Telefone da prática"
            onChange={(value) =>
              updateDraft("operations", { ...data.draft.operations, practicePhone: value })
            }
            value={data.draft.operations.practicePhone}
          />
          <TextField
            label="Timezone"
            onChange={(value) =>
              updateDraft("operations", { ...data.draft.operations, timezone: value })
            }
            value={data.draft.operations.timezone}
          />
          <TextField
            label="Chave Pix"
            onChange={(value) =>
              updateDraft("operations", { ...data.draft.operations, pixKey: value })
            }
            value={data.draft.operations.pixKey}
          />
        </div>
      );
    case "tax":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Regime de atuação"
            onChange={(value) => updateDraft("tax", { ...data.draft.tax, regime: value })}
            value={data.draft.tax.regime}
          />
          <TextField
            label="CPF ou CNPJ de faturamento"
            onChange={(value) =>
              updateDraft("tax", { ...data.draft.tax, billingDocument: value })
            }
            value={data.draft.tax.billingDocument}
          />
          <TextField
            label="Município principal"
            onChange={(value) => updateDraft("tax", { ...data.draft.tax, city: value })}
            value={data.draft.tax.city}
          />
          <TextField
            label="Tipo de emissão"
            onChange={(value) => updateDraft("tax", { ...data.draft.tax, emissionType: value })}
            value={data.draft.tax.emissionType}
          />
        </div>
      );
    case "contracts":
      return (
        <div className="space-y-3">
          <CheckboxField
            checked={data.draft.contracts.termsAccepted}
            documentHref="https://lumamanager.com.br/termos-de-uso"
            documentLabel="Ler termos"
            label="Aceito os termos de uso e o contrato comercial"
            onChange={(checked) =>
              updateDraft("contracts", { ...data.draft.contracts, termsAccepted: checked })
            }
          />
          <CheckboxField
            checked={data.draft.contracts.dpaAccepted}
            documentHref="https://lumamanager.com.br/dpa"
            documentLabel="Ler DPA"
            label="Aceito o DPA e as cláusulas de tratamento de dados"
            onChange={(checked) =>
              updateDraft("contracts", { ...data.draft.contracts, dpaAccepted: checked })
            }
          />
          <CheckboxField
            checked={data.draft.contracts.privacyAccepted}
            documentHref="https://lumamanager.com.br/privacidade"
            documentLabel="Ler política"
            label="Li e aceitei a política de privacidade"
            onChange={(checked) =>
              updateDraft("contracts", { ...data.draft.contracts, privacyAccepted: checked })
            }
          />
        </div>
      );
    case "schedule":
      return (
        <div className="space-y-4">
          <WeekdayToggle
            onChange={(weekdays) => updateDraft("schedule", { ...data.draft.schedule, weekdays })}
            value={data.draft.schedule.weekdays}
          />
          <TextField
            label="Modalidade padrão"
            onChange={(value) =>
              updateDraft("schedule", { ...data.draft.schedule, defaultModality: value })
            }
            value={data.draft.schedule.defaultModality}
          />
        </div>
      );
    case "consents": {
      const policyTemplate = `${data.draft.profile.fullName || "[Nome da psicóloga]"} (CRP ${data.draft.profile.crp || "[CRP]"}), ${data.draft.operations.practiceName || "[Nome do consultório]"}, coleta e trata dados pessoais e de saúde exclusivamente para fins de acompanhamento psicológico, conforme LGPD (Lei 13.709/2018). Os dados são armazenados em ambiente seguro, acessados apenas pela profissional responsável e nunca compartilhados com terceiros sem consentimento. O paciente pode solicitar acesso, correção ou exclusão a qualquer momento pelo e-mail ${data.draft.profile.professionalEmail || "[e-mail profissional]"}.`;
      return (
        <div className="space-y-4">
          <TextField
            label="Template LGPD"
            onChange={(value) =>
              updateDraft("consents", { ...data.draft.consents, lgpdTemplateId: value })
            }
            value={data.draft.consents.lgpdTemplateId}
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Política padrão de coleta</span>
              {!data.draft.consents.defaultCollectionPolicy ? (
                <button
                  className="text-xs font-semibold text-[var(--color-primary)] underline underline-offset-2"
                  onClick={() =>
                    updateDraft("consents", {
                      ...data.draft.consents,
                      defaultCollectionPolicy: policyTemplate
                    })
                  }
                  type="button"
                >
                  Usar modelo pré-preenchido
                </button>
              ) : null}
            </div>
            <TextAreaField
              label=""
              onChange={(value) =>
                updateDraft("consents", { ...data.draft.consents, defaultCollectionPolicy: value })
              }
              value={data.draft.consents.defaultCollectionPolicy}
            />
          </div>
        </div>
      );
    }
  }
}

function TextField({
  className = "",
  label,
  onChange,
  value
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm font-medium">{label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none transition focus:border-[var(--color-primary)]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function TextAreaField({
  className = "",
  label,
  onChange,
  value
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm font-medium">{label}</span>
      <textarea
        className="min-h-32 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function CheckboxField({
  checked,
  documentHref,
  documentLabel,
  label,
  onChange
}: {
  checked: boolean;
  documentHref?: string;
  documentLabel?: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] px-4 py-4">
      <input
        checked={checked}
        className="mt-0.5 shrink-0"
        id={label}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <label className="flex flex-1 items-start justify-between gap-3" htmlFor={label}>
        <span className="text-sm leading-6">{label}</span>
        {documentHref ? (
          <a
            className="shrink-0 text-xs font-semibold text-[var(--color-primary)] underline underline-offset-2"
            href={documentHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            {documentLabel ?? "Ler documento"}
          </a>
        ) : null}
      </label>
    </div>
  );
}

const WEEKDAYS = [
  { label: "Dom", value: "Domingo" },
  { label: "Seg", value: "Segunda" },
  { label: "Ter", value: "Terça" },
  { label: "Qua", value: "Quarta" },
  { label: "Qui", value: "Quinta" },
  { label: "Sex", value: "Sexta" },
  { label: "Sáb", value: "Sábado" }
];

function WeekdayToggle({
  onChange,
  value
}: {
  onChange: (weekdays: string[]) => void;
  value: string[];
}) {
  function toggle(day: string) {
    const next = value.includes(day) ? value.filter((d) => d !== day) : [...value, day];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">Dias de atendimento</span>
      <div className="flex flex-wrap gap-2">
        {WEEKDAYS.map((day) => {
          const active = value.includes(day.value);
          return (
            <button
              className={`rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
              key={day.value}
              onClick={() => toggle(day.value)}
              type="button"
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
