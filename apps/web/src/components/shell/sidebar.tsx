"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  ListChecks,
  Lock,
  Settings,
  SquareKanban,
  Users
} from "lucide-react";

import type { AppShellBootstrap } from "@terapia/contracts";
import { Avatar, Badge, cn } from "@terapia/ui";

import { getBadgeForItem, primaryNavigation } from "@/lib/navigation";

const navigationIcons = {
  onboarding: ListChecks,
  dashboard: LayoutDashboard,
  patients: Users,
  agenda: CalendarDays,
  clinicalReview: SquareKanban,
  finance: CreditCard,
  documents: FileText,
  settings: Settings
} as const;

type SidebarProps = {
  bootstrap: AppShellBootstrap;
};

export function Sidebar({ bootstrap }: SidebarProps) {
  const pathname = usePathname();
  const activationMode = bootstrap.tenant.status !== "ready_for_operations";
  const activationUnlockedKeys = new Set(["onboarding", "dashboard", "settings"]);
  const navigationItems = activationMode
    ? primaryNavigation
    : primaryNavigation.filter((item) => item.key !== "onboarding");

  return (
    <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-[var(--color-border)] bg-[rgba(255,253,248,0.84)] px-4 py-4 backdrop-blur lg:flex lg:flex-col">
      <div className="rounded-[26px] border border-[var(--color-border)] bg-white p-3.5 shadow-[var(--shadow-panel)]">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Terapia
        </div>
        <div className="mt-2 text-[15px] font-semibold text-[var(--color-text)]">{bootstrap.tenant.name}</div>
        <div className="mt-3 space-y-2">
          <Badge tone="info" className="px-2.5">
            Web-first
          </Badge>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">{bootstrap.accountStateLabel}</p>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1.5">
        {navigationItems.map((item) => {
          const Icon = navigationIcons[item.key];
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isBlocked = activationMode && !activationUnlockedKeys.has(item.key);
          const badgeValue =
            isBlocked || item.key === "onboarding" ? 0 : getBadgeForItem(bootstrap, item.key);

          return (
            <Link
              key={item.key}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-4 py-2.5 text-sm font-medium transition",
                isActive && !isBlocked
                  ? "border border-[rgba(9,60,73,0.28)] bg-[var(--color-primary)] text-white shadow-[0_14px_32px_rgba(15,76,92,0.26),inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : isActive && isBlocked
                    ? "border-[rgba(198,122,69,0.24)] bg-[rgba(198,122,69,0.12)] text-[var(--color-text)] shadow-[0_12px_28px_rgba(198,122,69,0.10)]"
                    : isBlocked
                      ? "border-transparent text-[var(--color-text-muted)] hover:border-[rgba(198,122,69,0.18)] hover:bg-[rgba(198,122,69,0.06)] hover:text-[var(--color-text)]"
                      : "border-transparent text-[var(--color-text-muted)] hover:bg-white hover:text-[var(--color-text)]"
              )}
              href={item.href}
            >
              <span
                className={cn(
                  "flex items-center gap-3",
                  isActive && !isBlocked ? "text-white" : "text-inherit"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive && !isBlocked ? "text-white" : "text-inherit"
                  )}
                />
                {item.label}
              </span>
              {isBlocked ? (
                <span
                  className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[rgba(198,122,69,0.14)] text-[var(--color-accent)]"
                  title="Liberado após a ativação"
                >
                  <Lock className="h-3.5 w-3.5" />
                </span>
              ) : badgeValue > 0 ? (
                <span
                  className={cn(
                    "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-semibold leading-none whitespace-nowrap",
                    isActive
                      ? "bg-white/18 text-white"
                      : "bg-[rgba(15,76,92,0.12)] text-[var(--color-primary)]"
                  )}
                >
                  {badgeValue}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 rounded-[26px] border border-[var(--color-border)] bg-white p-3.5 shadow-[var(--shadow-panel)]">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-[18px]" name={bootstrap.therapistProfile.fullName} />
          <div>
            <p className="text-sm font-semibold">{bootstrap.therapistProfile.fullName}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{bootstrap.therapistProfile.roleLabel}</p>
          </div>
        </div>
        <div className="mt-3 text-xs leading-5 text-[var(--color-text-muted)]">
          {activationMode
            ? "Conta em ativação. As áreas operacionais continuam visíveis no menu, mas só liberam depois do checklist mínimo."
            : "MFA ativo e domínio clínico concentrado no backend."}
        </div>
      </div>
    </aside>
  );
}
