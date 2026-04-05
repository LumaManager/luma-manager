import type { ReactNode } from "react";

import { Badge, Card, CardContent, CardHeader, cn } from "@terapia/ui";

type PortalHeroStat = {
  detail?: string;
  label: string;
  tone?: "critical" | "info" | "neutral" | "success" | "warning";
  value: string;
};

export function PortalHero({
  actions,
  badges,
  description,
  stats,
  title
}: {
  actions?: ReactNode;
  badges?: ReactNode;
  description: string;
  stats?: PortalHeroStat[];
  title: string;
}) {
  return (
    <section className="overflow-hidden rounded-[36px] border border-[rgba(22,42,56,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,248,240,0.92))] p-7 shadow-[0_28px_70px_rgba(38,48,58,0.08)]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          {badges ? <div className="flex flex-wrap items-center gap-3">{badges}</div> : null}
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>

      {stats && stats.length > 0 ? (
        <div className="mt-7 grid gap-3 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={`${stat.label}-${stat.value}`}
              className={cn(
                "rounded-[26px] border p-4",
                stat.tone === "critical"
                  ? "border-[rgba(178,74,58,0.16)] bg-[rgba(178,74,58,0.05)]"
                  : stat.tone === "warning"
                    ? "border-[rgba(198,122,69,0.16)] bg-[rgba(198,122,69,0.07)]"
                    : stat.tone === "success"
                      ? "border-[rgba(63,107,97,0.14)] bg-[rgba(63,107,97,0.06)]"
                      : stat.tone === "info"
                        ? "border-[rgba(15,76,92,0.12)] bg-[rgba(15,76,92,0.05)]"
                        : "border-[rgba(22,42,56,0.08)] bg-white/72"
              )}
            >
              <Badge tone={stat.tone ?? "neutral"}>{stat.label}</Badge>
              <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">{stat.value}</p>
              {stat.detail ? <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{stat.detail}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function PortalPanel({
  children,
  description,
  title
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <Card className="border-[rgba(22,42,56,0.08)] bg-white/88 shadow-[0_28px_70px_rgba(38,48,58,0.08)]">
      <CardHeader className="border-b border-[rgba(22,42,56,0.08)] pb-5">
        <p className="text-lg font-semibold">{title}</p>
        {description ? <p className="text-sm leading-6 text-[var(--color-text-muted)]">{description}</p> : null}
      </CardHeader>
      <CardContent className="space-y-3 pt-6">{children}</CardContent>
    </Card>
  );
}
