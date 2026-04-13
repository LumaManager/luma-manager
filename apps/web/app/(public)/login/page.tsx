import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, FileText, Wallet } from "lucide-react";

import type { AuthSession } from "@terapia/contracts";
import { Card, CardContent, CardHeader } from "@terapia/ui";

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(198,122,69,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(15,76,92,0.16),transparent_30%),linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-2 py-5 lg:px-3 lg:py-6">
      <div className="mx-auto w-full max-w-[1900px]">

        {/* Outer dark card — same pattern as landing */}
        <section className="relative overflow-hidden rounded-[40px] border border-[rgba(15,76,92,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 pb-11 text-white shadow-[0_30px_80px_rgba(15,76,92,0.24)] lg:p-10 lg:pb-16">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[rgba(255,255,255,0.08)] blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[rgba(198,122,69,0.16)] blur-3xl" />

          <div className="relative">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <Image src="/icon.svg" alt="Luma" width={26} height={26} className="rounded-lg" />
              <span className="text-base font-semibold tracking-[-0.03em] text-white">Luma</span>
            </div>

            {/* Split grid */}
            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,480px)]">

              {/* Left — copy */}
              <div>
                <h1 className="max-w-[13ch] text-[clamp(2.8rem,4.1vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                  Tudo pronto para o seu dia.
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-[rgba(255,255,255,0.78)]">
                  Agenda, prontuários e cobranças no mesmo lugar.
                  Sem precisar abrir mais nada.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
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

              {/* Right — form card floating over dark panel */}
              <Card className="overflow-hidden rounded-[32px] border-[rgba(255,255,255,0.14)] bg-[rgba(250,246,239,0.98)] text-[var(--color-text)] shadow-[0_22px_60px_rgba(7,24,29,0.28)] backdrop-blur">
                <CardHeader className="gap-2 border-b border-[rgba(15,76,92,0.1)] bg-[linear-gradient(180deg,rgba(255,250,242,0.68)_0%,rgba(251,244,234,0.24)_100%)] px-6 pb-5 pt-6">
                  <p className="text-[1.6rem] font-semibold tracking-[-0.03em]">
                    Bem-vindo de volta
                  </p>
                  <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                    Entre com seu e-mail e senha para acessar sua área.
                  </p>
                </CardHeader>
                <CardContent className="px-6 py-7">
                  <LoginForm nextPath={params.next ?? "/app/dashboard"} />
                  <p className="mt-7 text-center text-sm text-[var(--color-text-muted)]">
                    Ainda não tem conta?{" "}
                    <Link href="/" className="font-medium text-[var(--color-primary)] hover:underline">
                      Entre na lista de espera
                    </Link>
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

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
