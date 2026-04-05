"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, Building2, KeyRound, Shield, UserRound } from "lucide-react";

import type { AuthLoginResponse, AuthSession } from "@terapia/contracts";
import { Badge, Button } from "@terapia/ui";

import { getAuthenticatedHomePath } from "@/lib/auth/session-destination";

const defaultCredentials = {
  email: "ana@institutovivace.com.br",
  password: "12345678",
  mfaCode: "123456"
};

const rolePresets = [
  {
    id: "therapist-default",
    label: "Conta inicial",
    caption: "Onboarding pendente",
    email: "ana@institutovivace.com.br",
    password: "12345678",
    mfaCode: "123456",
    icon: UserRound
  },
  {
    id: "therapist-ready",
    label: "Conta pronta",
    caption: "Vai direto ao dashboard",
    email: "ana.ready@institutovivace.com.br",
    password: "12345678",
    mfaCode: "123456",
    icon: Building2
  },
  {
    id: "internal",
    label: "Operação interna",
    caption: "Abre /internal",
    email: "ops@terapia.internal",
    password: "12345678",
    mfaCode: "123456",
    icon: Shield
  }
] as const;

type Phase = "credentials" | "mfa";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("credentials");
  const [challenge, setChallenge] = useState<AuthLoginResponse | null>(null);
  const [email, setEmail] = useState(defaultCredentials.email);
  const [password, setPassword] = useState(defaultCredentials.password);
  const [code, setCode] = useState(defaultCredentials.mfaCode);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function applyPreset(preset: (typeof rolePresets)[number]) {
    setEmail(preset.email);
    setPassword(preset.password);
    setCode(preset.mfaCode);
    setError(null);
  }

  function getApiBaseUrl() {
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  }

  async function handleCredentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/v1/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          throw new Error(payload?.message ?? "Não foi possível iniciar o login.");
        }

        const payload = (await response.json()) as AuthLoginResponse;
        setChallenge(payload);
        setPhase("mfa");
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : "Erro inesperado ao iniciar login."
        );
      }
    });
  }

  async function handleMfaSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/v1/auth/mfa/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            challengeId: challenge?.challengeId,
            code
          })
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          throw new Error(payload?.message ?? "Não foi possível validar o MFA.");
        }

        const session = (await response.json()) as AuthSession;

        const sessionResponse = await fetch("/api/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(session)
        });

        if (!sessionResponse.ok) {
          throw new Error("Não foi possível abrir a sessão autenticada no web.");
        }

        router.push(getAuthenticatedHomePath(session, nextPath));
        router.refresh();
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : "Erro inesperado ao validar MFA."
        );
      }
    });
  }

  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info" className="px-3">
            {phase === "credentials" ? "Passo 1 de 2" : "Passo 2 de 2"}
          </Badge>
          <Badge tone="neutral" className="px-3">
            Modo dummy preparado para auth real
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-[24px] border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-2">
          <div
            className={`rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
              phase === "credentials"
                ? "bg-white text-[var(--color-text)] shadow-[0_10px_20px_rgba(15,76,92,0.08)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            Identidade
          </div>
          <div
            className={`rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
              phase === "mfa"
                ? "bg-white text-[var(--color-text)] shadow-[0_10px_20px_rgba(15,76,92,0.08)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            MFA TOTP
          </div>
        </div>

        <p className="text-sm leading-7 text-[var(--color-text-muted)]">
          {phase === "credentials"
            ? "Use sua conta profissional para iniciar a sessão. A conta só abre depois do segundo fator."
            : "Valide o autenticador para concluir a abertura da sessão protegida no workspace clínico."}
        </p>
      </div>

      {phase === "credentials" ? (
        <form className="space-y-6" onSubmit={handleCredentialsSubmit}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Entrar para avaliar
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">Preenche o formulário automaticamente</p>
            </div>
            <div className="grid gap-3">
              {rolePresets.map((preset) => {
                const Icon = preset.icon;
                const selected = email === preset.email;
                return (
                  <button
                    key={preset.id}
                    className={`flex items-center justify-between rounded-[22px] border px-4 py-4 text-left transition ${
                      selected
                        ? "border-[var(--color-primary)] bg-[rgba(15,76,92,0.08)]"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-border-strong)] hover:bg-[rgba(15,76,92,0.03)]"
                    }`}
                    onClick={() => applyPreset(preset)}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(15,76,92,0.1)] text-[var(--color-primary)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{preset.label}</p>
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{preset.caption}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[var(--color-text)]">{preset.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">E-mail profissional</span>
            <input
              className="h-[52px] w-full rounded-[22px] border border-[var(--color-border-strong)] bg-white px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@consultorio.com.br"
              type="email"
              value={email}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Senha</span>
            <input
              className="h-[52px] w-full rounded-[22px] border border-[var(--color-border-strong)] bg-white px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>

          <div className="rounded-[28px] border border-dashed border-[var(--color-border-strong)] bg-[rgba(15,76,92,0.04)] p-5 text-sm leading-6 text-[var(--color-text-muted)]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(15,76,92,0.1)] text-[var(--color-primary)]">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text)]">Credenciais de avaliação visual</p>
                <p className="mt-2">Senha padrão: {defaultCredentials.password}</p>
                <p>MFA dummy: {defaultCredentials.mfaCode}</p>
                <p className="mt-2">Terapeuta: ana.ready@institutovivace.com.br</p>
                <p>Interno: ops@terapia.internal</p>
              </div>
            </div>
          </div>

          {error ? (
            <p className="rounded-2xl bg-[rgba(178,74,58,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-4">
            <a className="text-sm font-medium text-[var(--color-primary)]" href="#">
              Preciso recuperar meu acesso
            </a>
            <Button className="min-w-[180px]" disabled={isPending} type="submit">
              {isPending ? "Validando..." : "Continuar para MFA"}
            </Button>
          </div>
        </form>
      ) : (
        <form className="space-y-6" onSubmit={handleMfaSubmit}>
          <div className="rounded-[28px] border border-[var(--color-border)] bg-[rgba(15,76,92,0.04)] p-5 text-sm leading-7 text-[var(--color-text-muted)]">
            <p className="font-semibold text-[var(--color-text)]">Código do autenticador</p>
            <p className="mt-2">
              Use o app TOTP da conta selecionada. Nesta avaliação, o código de acesso é {defaultCredentials.mfaCode}.
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Codigo de 6 digitos</span>
            <input
              className="h-14 w-full rounded-[22px] border border-[var(--color-border-strong)] bg-white px-4 text-lg tracking-[0.35em] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setCode(event.target.value)}
              placeholder="123456"
              value={code}
            />
          </label>

          {error ? (
            <p className="rounded-2xl bg-[rgba(178,74,58,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-4">
            <button
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
              onClick={() => {
                setPhase("credentials");
                setError(null);
              }}
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <Button className="min-w-[180px]" disabled={isPending} type="submit">
              {isPending ? "Abrindo sessão..." : "Entrar no workspace"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
