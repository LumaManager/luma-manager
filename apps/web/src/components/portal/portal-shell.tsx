"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { PortalBootstrap } from "@terapia/contracts";
import { Badge, Card } from "@terapia/ui";

import { PortalActionButton } from "./portal-action-button";

export function PortalShell({
  bootstrap,
  children
}: {
  bootstrap: PortalBootstrap;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7e9_0%,#f5efe5_42%,#efe8dd_100%)] text-[var(--color-text)]">
      <header className="border-b border-[rgba(22,42,56,0.08)] bg-[rgba(255,250,244,0.88)] px-6 py-5 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <Badge tone="info">Portal do paciente</Badge>
              <Badge tone="neutral">{bootstrap.supportLabel}</Badge>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
              Olá, {bootstrap.patient.firstName}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {bootstrap.nextAppointmentLabel}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{bootstrap.patient.practiceName}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{bootstrap.patient.therapistName}</p>
            </div>
            <PortalActionButton
              actionPath="/api/portal/session/logout"
              pendingLabel="Saindo..."
              variant="secondary"
            >
              Sair do portal
            </PortalActionButton>
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-89px)] w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <Card className="border-[rgba(22,42,56,0.08)] bg-white/88 shadow-[0_28px_70px_rgba(38,48,58,0.08)]">
            <div className="p-5">
              <p className="text-sm font-semibold">{bootstrap.patient.fullName}</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{bootstrap.patient.email}</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{bootstrap.patient.phone}</p>
              <div className="mt-4 rounded-[22px] border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Próximo passo
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                  {bootstrap.nextAppointmentLabel}
                </p>
              </div>
            </div>
          </Card>

          <nav className="space-y-2">
            {bootstrap.navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.key}
                  className={`block rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--color-primary)] text-white shadow-[0_16px_40px_rgba(15,76,92,0.2)]"
                      : "bg-white/72 text-[var(--color-text)] hover:bg-white"
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 space-y-6">
          {bootstrap.alerts.map((alert) => (
            <Card
              key={alert.id}
              className="border-[rgba(22,42,56,0.08)] bg-white/90 shadow-[0_28px_70px_rgba(38,48,58,0.08)]"
            >
              <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <Badge tone={alert.tone}>{alert.title}</Badge>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                    {alert.description}
                  </p>
                </div>
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-white"
                  href={alert.href}
                >
                  {alert.ctaLabel}
                </Link>
              </div>
            </Card>
          ))}
          {children}
        </main>
      </div>
    </div>
  );
}
