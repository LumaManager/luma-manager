"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type {
  OnboardingCompleteStepRequest,
  OnboardingStepKey,
  TherapistOnboardingBootstrap
} from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";

import { OperationalHero } from "@/components/shared/operational-surface";

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

  return (
    <div className="space-y-6">
      <OperationalHero
        badges={
          <>
            <Badge tone="warning">Ativação da conta</Badge>
            <Badge tone={data.accountStatus === "ready_for_operations" ? "success" : "warning"}>
              {data.accountStatus}
            </Badge>
          </>
        }
        description="Conclua o mínimo necessário para liberar operação real, sem transformar o onboarding em formulário longo e genérico."
        stats={[
          {
            detail: "Etapas já concluídas no wizard.",
            label: "Concluídas",
            tone: "success",
            value: String(data.steps.filter((step) => step.status === "completed").length)
          },
          {
            detail: "Itens ainda bloqueando a conta.",
            label: "Bloqueios",
            tone: data.blockingItems.some((item) => !item.completed) ? "warning" : "success",
            value: String(data.blockingItems.filter((item) => !item.completed).length)
          },
          {
            detail: currentStepMeta?.description ?? "Etapa atual do onboarding.",
            label: "Etapa atual",
            tone: "info",
            value: currentStepMeta?.title ?? "Em andamento"
          }
        ]}
        title="Deixar a conta pronta para operar"
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="h-fit">
        <CardHeader>
          <p className="text-lg font-semibold">Etapas da ativação</p>
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">
            Um wizard curto, com uma decisão dominante por tela e checklist explícito.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.steps.map((step, index) => (
            <div
              className="rounded-3xl border border-[var(--color-border)] px-4 py-4"
              key={step.key}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {index + 1}. {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                    {step.description}
                  </p>
                </div>
                <Badge
                  tone={
                    step.status === "completed"
                      ? "success"
                      : step.status === "current"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {step.status === "completed"
                    ? "Concluída"
                    : step.status === "current"
                      ? "Atual"
                      : "Pendente"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Etapa atual
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">{currentStepMeta?.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">
                    {currentStepMeta?.description}
                  </p>
                </div>
                <Badge tone="warning">{data.accountStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderStepFields(data, updateDraft)}

              {error ? (
                <p className="rounded-2xl bg-[rgba(178,74,58,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
                  {error}
                </p>
              ) : null}

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-[var(--color-text-muted)]">
                  {currentStep === "welcome"
                    ? "Explique o valor da ativação antes de pedir dados."
                    : "Salvar esta etapa destrava a próxima decisão operacional do onboarding."}
                </p>
                <Button disabled={isPending} onClick={submitCurrentStep} type="button">
                  {isPending
                    ? "Salvando..."
                    : currentStep === "welcome"
                      ? "Começar ativação"
                      : currentStep === "consents"
                        ? "Concluir ativação"
                        : "Salvar e continuar"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-lg font-semibold">Checklist bloqueante</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Estes itens controlam a transição para `ready_for_operations`.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.blockingItems.map((item) => (
                <div
                  className="flex items-start justify-between gap-4 rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] px-4 py-4"
                  key={item.id}
                >
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                      {item.description}
                    </p>
                  </div>
                  <Badge tone={item.completed ? "success" : "warning"}>
                    {item.completed ? "Ok" : "Falta"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
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
            label="Aceito os termos de uso e o contrato comercial"
            onChange={(checked) =>
              updateDraft("contracts", { ...data.draft.contracts, termsAccepted: checked })
            }
          />
          <CheckboxField
            checked={data.draft.contracts.dpaAccepted}
            label="Aceito o DPA e as cláusulas de tratamento de dados"
            onChange={(checked) =>
              updateDraft("contracts", { ...data.draft.contracts, dpaAccepted: checked })
            }
          />
          <CheckboxField
            checked={data.draft.contracts.privacyAccepted}
            label="Li e aceitei a política de privacidade"
            onChange={(checked) =>
              updateDraft("contracts", { ...data.draft.contracts, privacyAccepted: checked })
            }
          />
        </div>
      );
    case "schedule":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Dias da semana"
            onChange={(value) =>
              updateDraft("schedule", {
                ...data.draft.schedule,
                weekdays: value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              })
            }
            value={data.draft.schedule.weekdays.join(", ")}
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
    case "consents":
      return (
        <div className="space-y-4">
          <TextField
            label="Template LGPD"
            onChange={(value) =>
              updateDraft("consents", { ...data.draft.consents, lgpdTemplateId: value })
            }
            value={data.draft.consents.lgpdTemplateId}
          />
          <TextAreaField
            label="Política padrão de coleta"
            onChange={(value) =>
              updateDraft("consents", { ...data.draft.consents, defaultCollectionPolicy: value })
            }
            value={data.draft.consents.defaultCollectionPolicy}
          />
        </div>
      );
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
  label,
  onChange
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] px-4 py-4">
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      <span className="text-sm leading-6">{label}</span>
    </label>
  );
}
