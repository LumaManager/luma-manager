"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Clock3, LogOut, ShieldCheck } from "lucide-react";

import type { AppShellBootstrap } from "@terapia/contracts";
import { Badge } from "@terapia/ui";

import { getBreadcrumbs } from "@/lib/navigation";

type TopbarProps = {
  bootstrap: AppShellBootstrap;
};

export function Topbar({ bootstrap }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[rgba(246,241,232,0.92)] px-8 py-5 backdrop-blur">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span className="text-[var(--color-border-strong)]">/</span> : null}
              {crumb}
            </span>
          ))}
        </div>
        <div className="text-sm text-[var(--color-text-muted)]">
          {bootstrap.tenant.status === "ready_for_operations"
            ? "Shell autenticado do terapeuta, sem busca global e orientado à ação imediata."
            : "Modo de ativação da conta: wizard, dashboard e configurações seguem disponíveis; as áreas operacionais continuam visíveis no menu, mas bloqueadas até concluir o checklist."}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Badge
          tone={bootstrap.tenant.status === "ready_for_operations" ? "success" : "warning"}
          className="gap-1.5 px-2.5"
        >
          {bootstrap.accountStateLabel}
        </Badge>
        <Badge tone="neutral" className="gap-1.5 px-2.5">
          <Clock3 className="h-3.5 w-3.5" />
          {bootstrap.timezone}
        </Badge>
        <Badge tone="success" className="gap-1.5 px-2.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          MFA protegido
        </Badge>
        <button
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-border-strong)]"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await fetch("/api/session/logout", { method: "POST" });
              router.push("/login");
              router.refresh();
            })
          }
          type="button"
        >
          <LogOut className="h-4 w-4" />
          {isPending ? "Saindo..." : "Sair"}
        </button>
      </div>
    </header>
  );
}
