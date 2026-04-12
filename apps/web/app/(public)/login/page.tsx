import { redirect } from "next/navigation";
import { ArrowUpRight, Clock3, ShieldCheck, Sparkles } from "lucide-react";

import type { AuthSession } from "@terapia/contracts";
import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

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
      <div className="mx-auto flex w-full max-w-[1460px] items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-[rgba(15,76,92,0.14)] bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)] shadow-[0_12px_30px_rgba(15,76,92,0.08)]">
            Terapia
          </div>
          <Badge tone="info" className="px-3">
            Auth objetiva
          </Badge>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <Badge tone="neutral" className="gap-1.5 px-3">
            <Clock3 className="h-3.5 w-3.5" />
            Web-first
          </Badge>
          <Badge tone="success" className="gap-1.5 px-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            MFA obrigatório
          </Badge>
        </div>
      </div>

      <div className="mx-auto mt-6 grid w-full max-w-[1460px] gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(540px,620px)]">
        <section className="relative overflow-hidden rounded-[42px] border border-[rgba(15,76,92,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 text-white shadow-[0_30px_80px_rgba(15,76,92,0.24)] lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_22%_-4%,rgba(255,255,255,0.07),transparent_24%)]" />
          <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-[rgba(255,255,255,0.05)] blur-[110px]" />
          <div className="absolute -left-12 bottom-0 h-56 w-56 rounded-full bg-[rgba(198,122,69,0.14)] blur-[90px]" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="warning" className="bg-[rgba(255,255,255,0.16)] text-white">
                Workspace do terapeuta
              </Badge>
              <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                Mesa de ação clínica
              </Badge>
            </div>

            <h1 className="mt-8 max-w-[11ch] text-[clamp(3rem,4.8vw,5rem)] font-semibold leading-[0.94] tracking-[-0.05em]">
              Acesse a operação do dia sem ruído, dúvida ou tela genérica.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[rgba(255,255,255,0.78)]">
              Agenda, revisão clínica, documentos e cobranças entram no mesmo fluxo. O login precisa
              transmitir essa clareza antes mesmo da primeira sessão.
            </p>

            <div className="mt-8 grid gap-4 xl:grid-cols-3">
              <FeaturePanel
                eyebrow="Hoje"
                title="Ação imediata"
                description="O dashboard já abre com o que exige decisão agora, não com BI decorativo."
              />
              <FeaturePanel
                eyebrow="Segurança"
                title="MFA claro"
                description="E-mail e senha primeiro. TOTP depois. Sem atrito genérico, sem ambiguidade."
              />
              <FeaturePanel
                eyebrow="Direção atual"
                title="Útil sem áudio"
                description="O core segue funcional com texto e ditado do terapeuta, mesmo sem capabilities extras."
              />
            </div>

            <div className="mt-8 rounded-[30px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.58)]">
                    O que o produto entrega
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                    Um cockpit operacional para o terapeuta solo.
                  </p>
                </div>
                <div className="rounded-2xl bg-[rgba(255,255,255,0.14)] px-4 py-3 text-sm font-semibold">
                  Core web-first
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <MetricLine label="Agenda do dia" value="Pronta para ação" />
                <MetricLine label="Revisão clínica" value="Fila visível" />
                <MetricLine label="Documentos e cobrança" value="Operação rastreável" />
              </div>
            </div>
          </div>
        </section>

        <Card className="self-start overflow-hidden rounded-[34px] border-[rgba(15,76,92,0.16)] bg-[rgba(255,253,248,0.98)] shadow-[0_28px_70px_rgba(15,76,92,0.14)] xl:sticky xl:top-8">
          <CardHeader className="border-b border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(15,76,92,0.08)_0%,rgba(15,76,92,0.03)_100%)] pb-6 lg:px-8 lg:pt-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[rgba(15,76,92,0.12)] text-[var(--color-primary)]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[2rem] font-semibold tracking-[-0.03em]">Acesso do terapeuta</p>
                  <Badge tone="success" className="gap-1.5 px-3">
                    <Sparkles className="h-3.5 w-3.5" />
                    Sessão protegida
                  </Badge>
                </div>
                <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--color-text-muted)]">
                  Entre com sua conta profissional e valide o segundo fator para abrir o workspace clínico.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 lg:p-9">
            <LoginForm nextPath={params.next ?? "/app/dashboard"} />
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-[1460px] gap-4 lg:grid-cols-3">
        <TrustPanel
          eyebrow="Autorização"
          title="Backend como fonte de verdade"
          description="O domínio clínico não depende do frontend para autorização, auditoria ou política operacional."
        />
        <TrustPanel
          eyebrow="Operação"
          title="Útil já na primeira sessão"
          description="O fluxo principal continua útil com texto e ditado do terapeuta, mesmo sem capability de áudio."
        />
        <TrustPanel
          eyebrow="Compliance"
          title="Brasil-first nesta fase"
          description="A direção atual mantém processamento no Brasil e descarte de bruto após o processamento."
        />
      </div>
    </main>
  );
}

function FeaturePanel({
  description,
  eyebrow,
  title
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="rounded-[28px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.62)]">
        {eyebrow}
      </p>
      <p className="mt-3 text-xl font-semibold tracking-[-0.02em]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[rgba(255,255,255,0.74)]">{description}</p>
    </div>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[rgba(255,255,255,0.12)] bg-[rgba(7,24,29,0.14)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(255,255,255,0.56)]">
        {label}
      </p>
      <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
        <ArrowUpRight className="h-4 w-4 text-[rgba(255,255,255,0.68)]" />
        {value}
      </div>
    </div>
  );
}

function TrustPanel({
  description,
  eyebrow,
  title
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="rounded-[28px] border border-[rgba(15,76,92,0.12)] bg-[rgba(255,253,248,0.78)] p-5 shadow-[0_18px_40px_rgba(15,76,92,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {eyebrow}
      </p>
      <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[var(--color-text)]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}
