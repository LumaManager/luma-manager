"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";

import type { AuthLoginResponse, AuthSession } from "@terapia/contracts";
import { Button } from "@terapia/ui";

import { getAuthenticatedHomePath } from "@/lib/auth/session-destination";

type Phase = "credentials" | "mfa";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("credentials");
  const [challenge, setChallenge] = useState<AuthLoginResponse | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
          throw new Error(payload?.message ?? "Código incorreto. Tente novamente.");
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
          throw new Error("Não foi possível abrir a sessão. Tente novamente.");
        }

        router.push(getAuthenticatedHomePath(session, nextPath));
        router.refresh();
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : "Erro inesperado. Tente novamente."
        );
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-2 rounded-[22px] border border-[var(--color-border)] bg-[rgba(15,76,92,0.04)] p-1.5">
        <div
          className={`rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
            phase === "credentials"
              ? "bg-white text-[var(--color-text)] shadow-[0_10px_20px_rgba(15,76,92,0.08)]"
              : "text-[var(--color-text-muted)]"
          }`}
        >
          Acesso
        </div>
        <div
          className={`rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
            phase === "mfa"
              ? "bg-white text-[var(--color-text)] shadow-[0_10px_20px_rgba(15,76,92,0.08)]"
              : "text-[var(--color-text-muted)]"
          }`}
        >
          Confirmação
        </div>
      </div>

      {phase === "credentials" ? (
        <form className="space-y-6" onSubmit={handleCredentialsSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium">E-mail</span>
            <input
              autoComplete="email"
              className="h-[52px] w-full rounded-[22px] border border-[var(--color-border-strong)] bg-white px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="você@consultório.com.br"
              type="email"
              value={email}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Senha</span>
            <input
              autoComplete="current-password"
              className="h-[52px] w-full rounded-[22px] border border-[var(--color-border-strong)] bg-white px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <p className="rounded-2xl bg-[rgba(178,74,58,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-4">
            <a className="text-sm font-medium text-[var(--color-primary)]" href="#">
              Esqueci minha senha
            </a>
            <Button className="min-w-[160px]" disabled={isPending} type="submit">
              {isPending ? "Verificando..." : "Continuar"}
            </Button>
          </div>
        </form>
      ) : (
        <form className="space-y-6" onSubmit={handleMfaSubmit}>
          <p className="text-sm leading-7 text-[var(--color-text-muted)]">
            Abra seu aplicativo de autenticação e informe o código de 6 dígitos.
            O código muda a cada 30 segundos.
          </p>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Código de 6 dígitos</span>
            <input
              autoComplete="one-time-code"
              className="h-14 w-full rounded-[22px] border border-[var(--color-border-strong)] bg-white px-4 text-lg tracking-[0.35em] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setCode(event.target.value)}
              placeholder="000000"
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
            <Button className="min-w-[160px]" disabled={isPending} type="submit">
              {isPending ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
