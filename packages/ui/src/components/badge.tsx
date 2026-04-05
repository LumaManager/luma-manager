import * as React from "react";

import { cn } from "../lib/cn";

const badgeVariants = {
  critical: "bg-[rgba(178,74,58,0.12)] text-[var(--color-danger)]",
  warning: "bg-[rgba(198,122,69,0.14)] text-[var(--color-accent)]",
  info: "bg-[rgba(15,76,92,0.12)] text-[var(--color-primary)]",
  success: "bg-[rgba(63,107,97,0.12)] text-[var(--color-success)]",
  neutral: "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]"
} as const;

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof badgeVariants;
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center rounded-full px-3 text-[11px] font-semibold leading-none tracking-[0.01em] whitespace-nowrap",
        badgeVariants[tone],
        className
      )}
      {...props}
    />
  );
}
