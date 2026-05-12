"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@terapia/ui";
import type { RegisterResponse } from "@terapia/contracts";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEmailError(null);

    const form = e.currentTarget;
    const fullName        = (form.elements.namedItem("fullName")        as HTMLInputElement).value.trim();
    const email           = (form.elements.namedItem("email")           as HTMLInputElement).value.trim();
    const practiceName    = (form.elements.namedItem("practiceName")    as HTMLInputElement).value.trim();
    const password        = (form.elements.namedItem("password")        as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, practiceName, password })
      });

      if (!response.ok) {
        if (response.status === 409) {
          setEmailError("Este e-mail já está cadastrado.");
          return;
        }
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Erro ao criar conta.");
      }

      const result = (await response.json()) as RegisterResponse;
      router.push(`/verificar-email?email=${encodeURIComponent(result.email)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar conta.";
      if (message.toLowerCase().includes("já está cadastrado")) {
        setEmailError("Este e-mail já está cadastrado.");
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = "h-[52px] w-full rounded-[22px] border border-[var(--color-border-strong)] bg-white px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium">Nome completo</span>
        <input name="fullName" type="text" placeholder="Dra. Ana Souza" required autoComplete="name" className={inputClass} />
      </label>

      <div className="block space-y-2">
        <label htmlFor="email" className="text-sm font-medium">E-mail</label>
        <input id="email" name="email" type="email" placeholder="ana@consultorio.com.br" required autoComplete="email"
          className={`${inputClass} ${emailError ? "border-red-400" : ""}`} />
        {emailError && <p className="text-xs text-red-500">{emailError}</p>}
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Nome do consultório</span>
        <input name="practiceName" type="text" placeholder="Pode ser seu próprio nome" required className={inputClass} />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Senha</span>
        <div className="relative">
          <input name="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres"
            required autoComplete="new-password" className={`${inputClass} pr-12`} />
          <button type="button" onClick={() => setShowPassword(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Confirmar senha</span>
        <input name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Repita a senha"
          required autoComplete="new-password" className={inputClass} />
      </label>

      {error && (
        <p className="rounded-2xl bg-[rgba(178,74,58,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={isLoading} className="min-w-[160px]">
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Criando conta...</> : "Criar conta"}
        </Button>
      </div>
    </form>
  );
}
