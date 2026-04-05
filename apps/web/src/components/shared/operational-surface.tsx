import type { ReactNode } from "react";

import { Badge, Card, CardContent, CardHeader, cn } from "@terapia/ui";

type HeroStatTone = "critical" | "info" | "neutral" | "success" | "warning";

type HeroStat = {
  detail?: string;
  label: string;
  tone?: HeroStatTone;
  value: string;
};

type OperationalHeroProps = {
  actions?: ReactNode;
  aside?: ReactNode;
  badges?: ReactNode;
  className?: string;
  description: string;
  supportingText?: string;
  stats?: HeroStat[];
  title: string;
};

const toneClassMap: Record<HeroStatTone, string> = {
  critical: "border-[rgba(178,74,58,0.18)] bg-[rgba(178,74,58,0.06)]",
  warning: "border-[rgba(198,122,69,0.18)] bg-[rgba(198,122,69,0.08)]",
  info: "border-[rgba(15,76,92,0.14)] bg-[rgba(15,76,92,0.05)]",
  success: "border-[rgba(63,107,97,0.14)] bg-[rgba(63,107,97,0.06)]",
  neutral: "border-[var(--color-border)] bg-white/70"
};

export function OperationalHero({
  actions,
  aside,
  badges,
  className,
  description,
  supportingText,
  stats,
  title
}: OperationalHeroProps) {
  const hasSupportingRow = Boolean((stats && stats.length > 0) || aside);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[36px] border border-[var(--color-border)] bg-[rgba(255,253,248,0.9)] p-7 shadow-[var(--shadow-panel)]",
        "before:absolute before:inset-x-0 before:top-0 before:h-28 before:bg-[linear-gradient(135deg,rgba(15,76,92,0.07),transparent_52%,rgba(198,122,69,0.08))] before:content-['']",
        className
      )}
    >
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          {badges ? <div className="flex flex-wrap items-center gap-3">{badges}</div> : null}
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-text)] xl:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-muted)]">{description}</p>
          {supportingText ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">{supportingText}</p>
          ) : null}
        </div>

        {actions ? <div className="relative flex flex-wrap gap-3">{actions}</div> : null}
      </div>

      {hasSupportingRow ? (
        <div className="relative mt-8 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div
            className={cn(
              "grid gap-3",
              aside
                ? "md:grid-cols-3"
                : stats && stats.length >= 4
                  ? "md:grid-cols-2 xl:grid-cols-4"
                  : "md:grid-cols-3"
            )}
          >
            {stats?.map((stat) => (
              <HeroStatCard key={`${stat.label}-${stat.value}`} {...stat} />
            ))}
          </div>
          {aside ? (
            <div className="rounded-[28px] border border-[var(--color-border)] bg-white/86 p-5 backdrop-blur">
              {aside}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function HeroStatCard({ detail, label, tone = "neutral", value }: HeroStat) {
  return (
    <div className={cn("rounded-[26px] border p-4", toneClassMap[tone])}>
      <div className="flex items-center justify-between gap-3">
        <Badge className="px-2.5" tone={tone === "neutral" ? "neutral" : tone}>
          {label}
        </Badge>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">{value}</p>
      {detail ? <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{detail}</p> : null}
    </div>
  );
}

type ToolbarPanelProps = {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  description: string;
  footer?: ReactNode;
  title: string;
};

export function ToolbarPanel({
  actions,
  children,
  className,
  description,
  footer,
  title
}: ToolbarPanelProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="gap-4 border-b border-[var(--color-border)] pb-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-[-0.02em]">{title}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {children}
        {footer ? <div className="border-t border-[var(--color-border)] pt-4">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
