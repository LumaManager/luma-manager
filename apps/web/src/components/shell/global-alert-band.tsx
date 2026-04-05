import type { AppShellBootstrap } from "@terapia/contracts";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { Badge } from "@terapia/ui";

type GlobalAlertBandProps = {
  bootstrap: AppShellBootstrap;
};

export function GlobalAlertBand({ bootstrap }: GlobalAlertBandProps) {
  const alert = bootstrap.globalAlerts[0];
  const badgeLabel =
    alert?.id === "activation-required"
      ? "Modo de ativação"
      : alert?.tone === "critical"
        ? "Pendência crítica"
        : alert?.tone === "warning"
          ? "Atenção"
          : alert?.tone === "success"
            ? "Tudo certo"
            : "Informação";

  if (!alert) {
    return null;
  }

  return (
    <div className="mx-8 mt-6 flex items-start justify-between gap-4 rounded-[30px] border border-[rgba(198,122,69,0.24)] bg-[linear-gradient(135deg,rgba(255,248,238,0.95),rgba(198,122,69,0.10))] px-5 py-4 shadow-[0_18px_40px_rgba(198,122,69,0.08)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(198,122,69,0.14)] text-[var(--color-accent)]">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge tone={alert.tone}>{badgeLabel}</Badge>
            <span className="text-sm font-semibold">{alert.title}</span>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">{alert.description}</p>
        </div>
      </div>

      <a
        className="inline-flex items-center gap-2 rounded-2xl border border-[rgba(15,76,92,0.12)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-sm transition hover:border-[rgba(15,76,92,0.22)] hover:bg-[var(--color-surface-contrast)]"
        href={alert.href}
      >
        {alert.ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
