import Link from "next/link";
import { ArrowRight, Calendar, CalendarPlus2, ClipboardList, UserPlus2, Wallet } from "lucide-react";
import type { TherapistDashboard } from "@terapia/contracts";

import { Button, cn } from "@terapia/ui";

const iconMap = {
  calendar: Calendar,
  "calendar-plus": CalendarPlus2,
  "clipboard-list": ClipboardList,
  "user-plus": UserPlus2,
  wallet: Wallet
} as const;

type DashboardHeaderProps = {
  quickActions: TherapistDashboard["quickActions"];
};

export function DashboardHeader({ quickActions }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-[32px] border border-[var(--color-border)] bg-[rgba(255,253,248,0.78)] p-7 shadow-[var(--shadow-panel)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--color-text)] xl:text-4xl">
            Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link className="text-white" href="/app/patients">
              <UserPlus2 className="h-4 w-4" />
              Novo paciente
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link className="text-[var(--color-text)]" href="/app/agenda">
              <CalendarPlus2 className="h-4 w-4" />
              Nova sessão
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link className="text-[var(--color-text)]" href="/app/clinical-review">
              Abrir revisão clínica
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        {quickActions.map((action) => {
          const Icon = iconMap[action.icon];
          const isPrimary = action.emphasis === "primary";

          return (
            <a href={action.href} key={action.id}>
              <div
                className={cn(
                  "flex h-full flex-col gap-4 rounded-[24px] border p-4 transition hover:-translate-y-0.5",
                  isPrimary
                    ? "border-transparent bg-[linear-gradient(135deg,rgba(15,76,92,0.96),rgba(9,53,65,0.96))] text-white"
                    : "border-[var(--color-border)] bg-white"
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl",
                    isPrimary ? "bg-white/12 text-white" : "bg-[rgba(15,76,92,0.10)] text-[var(--color-primary)]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-base font-semibold">{action.label}</p>
                <span
                  className={cn(
                    "mt-auto inline-flex items-center gap-2 text-sm font-semibold",
                    isPrimary ? "text-white" : "text-[var(--color-primary)]"
                  )}
                >
                  Abrir fluxo
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
