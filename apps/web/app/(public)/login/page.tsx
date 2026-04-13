import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, FileText, Wallet } from "lucide-react";

import type { AuthSession } from "@terapia/contracts";

import { apiFetch } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { getAuthenticatedHomePath } from "@/lib/auth/session-destination";

import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const sessionToken = await getSessionToken();

  if (sessionToken) {
    try {
      const session = await apiFetch<AuthSession>("/v1/auth/me", {
        token: sessionToken
      });

      redirect(getAuthenticatedHomePath(session, params.next));
    } catch {
      // Keep the login page accessible when the stored cookie is stale.
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(198,122,69,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,76,92,0.18),transparent_34%),linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-4 py-10 lg:px-8">

      {/* Logo above card */}
      <div className="mb-6 flex w-full max-w-[1100px] items-center gap-2.5">
        <Image src="/icon.svg" alt="Luma" width={26} height={26} className="rounded-lg" />
        <span className="text-base font-semibold tracking-[-0.03em] text-[var(--color-text)]">
          Luma
        </span>
      </div>

      {/* Single card containing both panels */}
      <div className="w-full max-w-[1100px] overflow-hidden rounded-[40px] border border-[rgba(15,76,92,0.14)] bg-white shadow-[0_32px_90px_rgba(15,76,92,0.16)]">
        <div className="grid xl:grid-cols-[1fr_480px]">

          {/* Left — dark panel */}
          <section className="relative overflow-hidden bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_22%_-4%,rgba(255,255,255,0.07),transparent_24%)]" />
            <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-[rgba(255,255,255,0.05)] blur-[110px]" />
            <div className="absolute -left-12 bottom-0 h-56 w-56 rounded-full bg-[rgba(198,122,69,0.14)] blur-[90px]" />

            <div className="relative">
              <h1 className="mt-2 max-w-[12ch] text-[clamp(2.6rem,4vw,4.2rem)] font-semibold leading-[0.94] tracking-[-0.05em]">
                Tudo pronto para o seu dia.
              </h1>
              <p className="mt-5 max-w-sm text-base leading-7 text-[rgba(255,255,255,0.72)]">
                Agenda, prontuários e cobranças no mesmo lugar.
                Sem precisar abrir mais nada.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 xl:gap-3 2xl:grid-cols-3">
                <FeaturePanel
                  icon={CalendarDays}
                  title="Sua agenda"
                  description="Sessões do dia organizadas, em ordem."
                />
                <FeaturePanel
                  icon={FileText}
                  title="Seus pacientes"
                  description="Histórico acessível a qualquer momento."
                />
                <FeaturePanel
                  icon={Wallet}
                  title="Suas cobranças"
                  description="O que foi pago e o que está pendente."
                />
              </div>
            </div>
          </section>

          {/* Right — form */}
          <div className="flex flex-col justify-center border-l border-[rgba(15,76,92,0.1)] bg-[rgba(255,253,248,0.98)] px-8 py-10 lg:px-10 lg:py-12">
            <p className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[var(--color-text)]">
              Bem-vindo de volta
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Entre com seu e-mail e senha para acessar sua área.
            </p>

            <div className="mt-8">
              <LoginForm nextPath={params.next ?? "/app/dashboard"} />
            </div>

            <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
              Ainda não tem conta?{" "}
              <Link href="/" className="font-medium text-[var(--color-primary)] hover:underline">
                Entre na lista de espera
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Trust row */}
      <div className="mt-6 grid w-full max-w-[1100px] gap-3 sm:grid-cols-3">
        <TrustNote text="Acesso com dois fatores" />
        <TrustNote text="Funciona em qualquer dispositivo" />
        <TrustNote text="Dados armazenados no Brasil" />
      </div>

    </main>
  );
}

function FeaturePanel({
  description,
  icon: Icon,
  title
}: {
  description: string;
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="rounded-[22px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.07)] p-4 backdrop-blur">
      <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[rgba(255,255,255,0.14)]">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <p className="mt-3 text-sm font-semibold tracking-[-0.01em]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[rgba(255,255,255,0.62)]">{description}</p>
    </div>
  );
}

function TrustNote({ text }: { text: string }) {
  return (
    <p className="text-center text-xs text-[var(--color-text-muted)]">{text}</p>
  );
}
