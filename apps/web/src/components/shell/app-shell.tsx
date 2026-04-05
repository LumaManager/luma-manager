"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppShellBootstrap } from "@terapia/contracts";
import { Monitor } from "lucide-react";

import { Card, CardContent, CardHeader } from "@terapia/ui";
import { getBreadcrumbs } from "@/lib/navigation";

import { GlobalAlertBand } from "./global-alert-band";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

type AppShellProps = {
  bootstrap: AppShellBootstrap;
  children: React.ReactNode;
};

export function AppShell({ bootstrap, children }: AppShellProps) {
  const pathname = usePathname();
  const activationMode = bootstrap.tenant.status !== "ready_for_operations";
  const blockedAreaLabel = getBreadcrumbs(pathname).at(-1) ?? "Área";
  const canAccessRoute =
    !activationMode ||
    pathname.startsWith("/app/onboarding") ||
    pathname.startsWith("/app/dashboard") ||
    pathname.startsWith("/app/settings");

  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-6 py-10 lg:hidden">
        <Card className="max-w-lg bg-[var(--color-surface-contrast)]">
          <CardHeader className="items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(15,76,92,0.12)] text-[var(--color-primary)]">
              <Monitor className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-semibold">Use um desktop para operar o web admin</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                Esta superfície foi fechada como desktop-first. O acesso completo do terapeuta
                começa em 1024 px, com experiência principal em 1280 px ou mais.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-4 text-sm font-semibold text-white"
              href="/login"
            >
              Voltar para o login
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="hidden min-h-screen lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
        <Sidebar bootstrap={bootstrap} />
        <div className="min-w-0">
          <Topbar bootstrap={bootstrap} />
          <GlobalAlertBand bootstrap={bootstrap} />
          <main className="px-8 py-8">
            {canAccessRoute ? (
              children
            ) : (
              <Card className="max-w-4xl bg-[var(--color-surface-contrast)]">
                <CardHeader>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Área visível, mas bloqueada
                  </p>
                  <h1 className="text-3xl font-semibold">
                    {blockedAreaLabel} só libera depois da ativação da conta.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
                    O menu continua mostrando a estrutura operacional completa para manter contexto.
                    Enquanto a conta estiver em ativação, pacientes, agenda, revisão clínica,
                    documentos e financeiro permanecem protegidos até o checklist mínimo ficar
                    completo.
                  </p>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.22)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                    href="/app/onboarding"
                  >
                    Continuar ativação
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-raised)]"
                    href="/app/dashboard"
                  >
                    Voltar ao dashboard
                  </Link>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
