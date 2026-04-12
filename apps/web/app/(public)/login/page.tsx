import { redirect } from "next/navigation";
import Image from "next/image";
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(198,122,69,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,76,92,0.18),transparent_34%),linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-6 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-[1460px] items-center gap-2.5">
        <Image
          src="/icon.svg"
          alt="Luma"
          width={28}
          height={28}
          className="rounded-lg"
        />
        <span className="text-lg font-semibold tracking-[-0.03em] text-[var(--color-text)]">
          Luma
        </span>
      </div>

      <div className="mx-auto mt-6 grid w-full max-w-[1460px] gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(540px,620px)]">
        <section className="relative overflow-hidden rounded-[42px] border border-[rgba(15,76,92,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_30px_80px_rgba(15,76,92,0.24)] lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_22%_-4%,rgba(255,255,255,0.07),transparent_24%)]" />
          <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-[rgba(255,255,255,0.05)] blur-[110px]" />
          <div className="absolute -left-12 bottom-0 h-56 w-56 rounded-full bg-[rgba(198,122,69,0.14)] blur-[90px]" />

          <div className="relative">
            <h1 className="mt-4 max-w-[12ch] text-[clamp(3rem,4.8vw,5rem)] font-semibold leading-[0.94] tracking-[-0.05em]">
              Tudo pronto para o seu dia.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[rgba(255,255,255,0.78)]">
              Agenda, prontuários e cobranças no mesmo lugar.
              Sem precisar abrir mais nada.
            </p>

            <div className="mt-8 grid gap-4 xl:grid-cols-3">
              <FeaturePanel
                icon={CalendarDays}
                title="Sua agenda"
                description="Sessões do dia organizadas. Veja quem você atende e em qual horário."
              />
              <FeaturePanel
                icon={FileText}
                title="Seus pacientes"
                description="Histórico de cada paciente acessível a qualquer momento."
              />
              <FeaturePanel
                icon={Wallet}
                title="Suas cobranças"
                description="O que foi pago e o que está pendente, sem precisar perguntar."
              />
            </div>

            <div className="mt-8 rounded-[30px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.58)]">
                O que te espera ao entrar
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                A clínica inteira em uma tela.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <MetricLine label="Agenda do dia" value="Pronta para ação" />
                <MetricLine label="Prontuários" value="Organizados" />
                <MetricLine label="Cobranças" value="Visíveis" />
              </div>
            </div>
          </div>
        </section>

        <Card className="self-start overflow-hidden rounded-[34px] border-[rgba(15,76,92,0.16)] bg-[rgba(255,253,248,0.98)] shadow-[0_28px_70px_rgba(15,76,92,0.14)] xl:sticky xl:top-8">
          <CardHeader className="border-b border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(15,76,92,0.08)_0%,rgba(15,76,92,0.03)_100%)] pb-6 lg:px-8 lg:pt-8">
            <div className="min-w-0">
              <p className="text-[2rem] font-semibold tracking-[-0.03em]">Bem-vindo de volta</p>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--color-text-muted)]">
                Entre com seu e-mail e senha para acessar sua área.
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-8 lg:p-9">
            <LoginForm nextPath={params.next ?? "/app/dashboard"} />
            <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
              Ainda não tem conta?{" "}
              <a href="/" className="font-medium text-[var(--color-primary)] hover:underline">
                Entre na lista de espera
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-[1460px] gap-4 lg:grid-cols-3">
        <TrustPanel
          title="Acesso com dois fatores"
          description="E-mail, senha e confirmação pelo aplicativo. Três camadas para manter sua conta segura."
        />
        <TrustPanel
          title="Funciona onde você estiver"
          description="Celular, tablet ou computador. O mesmo fluxo em qualquer tela."
        />
        <TrustPanel
          title="Dados no Brasil"
          description="Processamento e armazenamento dentro do Brasil, seguindo a LGPD."
        />
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
    <div className="rounded-[28px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[rgba(255,255,255,0.14)]">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="mt-4 text-xl font-semibold tracking-[-0.02em]">{title}</p>
      <p className="mt-2 text-sm leading-7 text-[rgba(255,255,255,0.74)]">{description}</p>
    </div>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[rgba(255,255,255,0.12)] bg-[rgba(7,24,29,0.14)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(255,255,255,0.56)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function TrustPanel({ description, title }: { description: string; title: string }) {
  return (
    <div className="rounded-[28px] border border-[rgba(15,76,92,0.12)] bg-[rgba(255,253,248,0.78)] p-5 shadow-[0_18px_40px_rgba(15,76,92,0.06)]">
      <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-text)]">{title}</p>
      <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}
