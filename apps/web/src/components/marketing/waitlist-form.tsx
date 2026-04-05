"use client";

import { useState, useTransition } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import type {
  WaitlistJoinRequest,
  WaitlistJoinResponse,
  WaitlistProfessionalRole,
  WaitlistSummary
} from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";

export type WaitlistJoinSuccessPayload = {
  alreadyJoined: boolean;
  email: string;
  message: string;
  professionalRole: WaitlistProfessionalRole;
  summary: WaitlistSummary;
};

type WaitlistFormProps = {
  embedded?: boolean;
  initialSummary: WaitlistSummary;
  onJoinSuccess?: (payload: WaitlistJoinSuccessPayload) => void;
  sourcePath: string;
  utmCampaign?: string;
  utmContent?: string;
  utmMedium?: string;
  utmSource?: string;
  utmTerm?: string;
};

const professionalRoleOptions: { label: string; value: WaitlistProfessionalRole }[] = [
  { value: "therapist", label: "Psicólogo(a) clínico(a)" },
  { value: "psychiatrist", label: "Psiquiatra" },
  { value: "clinic_owner", label: "Clínica ou consultório" },
  { value: "operations", label: "Operação ou secretária" },
  { value: "other", label: "Outro perfil" }
];

const inputClassName =
  "h-[50px] w-full rounded-[20px] border border-[var(--color-border-strong)] bg-[rgba(255,251,244,0.96)] px-4 outline-none transition focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]";

const productName = "Luma Manager";

export function WaitlistForm({
  embedded = false,
  initialSummary,
  onJoinSuccess,
  sourcePath,
  utmCampaign = "",
  utmContent = "",
  utmMedium = "",
  utmSource = "",
  utmTerm = ""
}: WaitlistFormProps) {
  const [summary] = useState(initialSummary);
  const [email, setEmail] = useState("");
  const [professionalRole, setProfessionalRole] =
    useState<WaitlistProfessionalRole>("therapist");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const payload = {
          email,
          professionalRole,
          fullName: "",
          sourcePath,
          referrerHost: getReferrerHost(),
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm
        } as WaitlistJoinRequest;

        const response = await fetch("/api/marketing/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const body = (await response.json().catch(() => null)) as
          | WaitlistJoinResponse
          | { message?: string }
          | null;

        if (!response.ok) {
          throw new Error(
            body && "message" in body
              ? body.message ?? "Erro ao entrar na waitlist."
              : "Erro ao entrar na waitlist."
          );
        }

        const result = body as WaitlistJoinResponse;
        onJoinSuccess?.({
          alreadyJoined: result.alreadyJoined,
          email,
          message: result.message,
          professionalRole,
          summary: result.summary
        });
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Não foi possível registrar sua intenção agora."
        );
      }
    });
  }

  return (
    <Card
      className={
        embedded
          ? "overflow-hidden border-[rgba(255,255,255,0.14)] bg-[linear-gradient(180deg,rgba(250,245,236,0.98)_0%,rgba(246,239,229,0.98)_100%)] text-[var(--color-text)] shadow-[0_22px_60px_rgba(7,24,29,0.22)] backdrop-blur"
          : "overflow-hidden border-[rgba(15,76,92,0.2)] bg-[rgba(255,253,248,0.98)] shadow-[0_32px_90px_rgba(15,76,92,0.16)]"
      }
      id="waitlist"
    >
      <CardHeader
        className={
          embedded
            ? "gap-2.5 border-b border-[rgba(15,76,92,0.1)] bg-[linear-gradient(180deg,rgba(255,250,242,0.68)_0%,rgba(251,244,234,0.24)_100%)] px-4 pb-4 pt-4"
            : "gap-3 border-b border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(15,76,92,0.12)_0%,rgba(15,76,92,0.045)_100%)] px-5 pb-5 pt-5"
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="warning" className="px-2.5">
            {embedded ? "Acesso antecipado" : `Beta do ${productName}`}
          </Badge>
          {!embedded ? (
            <Badge tone="neutral" className="px-2.5">
              Fit primeiro, volume depois
            </Badge>
          ) : null}
        </div>
        <div>
          <p
            className={
              embedded
                ? "text-[1.35rem] font-semibold leading-[1.02] tracking-[-0.035em]"
                : "text-[1.85rem] font-semibold leading-[1.02] tracking-[-0.035em]"
            }
          >
            {embedded ? `Entrar cedo no ${productName}` : `Entre cedo na fila do ${productName}`}
          </p>
          <p
            className={
              embedded
                ? "mt-2 max-w-xl text-[12px] leading-5 text-[var(--color-text-muted)]"
                : "mt-2 max-w-xl text-[13px] leading-6 text-[var(--color-text-muted)]"
            }
          >
            Deixe seu e-mail e entre na lista de quem quer trocar Google Agenda, WhatsApp,
            planilha, documento solto e cobrança espalhada por um fluxo mais claro dentro do{" "}
            {productName}.
          </p>
        </div>
      </CardHeader>

      <CardContent className={embedded ? "space-y-3 px-4 pb-4 pt-4" : "space-y-4 px-5 pb-5 pt-5"}>
        <div className="grid gap-2 grid-cols-3">
          <WaitlistSignal label="Entrada" value="1 e-mail" />
          <WaitlistSignal label="Filtro inicial" value="Seu perfil" />
          <WaitlistSignal label="Tempo" value="Menos de 1 min" />
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div
            className={
              embedded
                ? "space-y-3 rounded-[22px] border border-[rgba(15,76,92,0.14)] bg-[linear-gradient(180deg,rgba(248,241,231,0.96)_0%,rgba(244,236,224,0.92)_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)]"
                : "space-y-3.5 rounded-[24px] border border-[rgba(15,76,92,0.14)] bg-[linear-gradient(180deg,rgba(248,241,231,0.96)_0%,rgba(244,236,224,0.92)_100%)] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)]"
            }
          >
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                Passo 1 de 2
              </p>
            </div>

            <div className="grid gap-3">
              <Field label="E-mail profissional">
                <input
                  className={inputClassName}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="você@consultório.com.br"
                  type="email"
                  value={email}
                />
              </Field>
              <Field label="Seu perfil">
                <select
                  className={inputClassName}
                  onChange={(event) =>
                    setProfessionalRole(event.target.value as WaitlistProfessionalRole)
                  }
                  value={professionalRole}
                >
                  {professionalRoleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="rounded-[18px] border border-[rgba(15,76,92,0.1)] bg-[rgba(255,250,242,0.88)] px-3.5 py-2.5 text-[13px] leading-6 text-[var(--color-text-muted)]">
              Você entra na fila agora. Se fizer sentido, completa volume e principal gargalo depois.
            </div>
          </div>

          {error ? (
            <div className="rounded-[22px] border border-[rgba(178,74,58,0.16)] bg-[rgba(178,74,58,0.06)] px-4 py-3 text-sm text-[var(--color-danger)]">
              {error}
            </div>
          ) : null}

          <div className="space-y-2 pt-0.5">
            <Button
              className={
                embedded
                  ? "h-[48px] w-full justify-between rounded-[18px] px-4 text-[14px]"
                  : "h-[52px] w-full justify-between rounded-[20px] px-5 text-[15px]"
              }
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Registrando intenção
                </>
              ) : (
                <>
                  Entrar na waitlist
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-[10px] leading-5 uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Convites por prioridade de aderência.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function getReferrerHost() {
  if (typeof document === "undefined" || !document.referrer) {
    return "";
  }

  try {
    return new URL(document.referrer).host;
  } catch {
    return "";
  }
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-medium">{label}</span>
      {children}
    </label>
  );
}

function WaitlistSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[rgba(15,76,92,0.12)] bg-[rgba(250,245,236,0.92)] px-2.5 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
        {label}
      </p>
      <p className="mt-1 text-[0.95rem] font-medium leading-5 text-[var(--color-text)]">{value}</p>
    </div>
  );
}
