import type { DashboardCardState } from "@terapia/contracts";
import { ArrowRight } from "lucide-react";

import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

type SummaryCardProps = {
  state: DashboardCardState;
  children?: React.ReactNode;
};

export function SummaryCard({ children, state }: SummaryCardProps) {
  const tone = state.tone === "info" ? "info" : state.tone === "success" ? "success" : state.tone === "warning" ? "warning" : "critical";

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <Badge tone={tone}>{state.eyebrow}</Badge>
          <a className="text-sm font-semibold text-[var(--color-primary)]" href={state.href}>
            {state.ctaLabel}
          </a>
        </div>
        <div>
          <p className="text-base font-semibold">{state.title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{state.metric}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{state.description}</p>
        </div>
      </CardHeader>
      {children ? <CardContent className="space-y-3">{children}</CardContent> : null}
      {!children ? (
        <CardContent>
          <a className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]" href={state.href}>
            Abrir detalhe
            <ArrowRight className="h-4 w-4" />
          </a>
        </CardContent>
      ) : null}
    </Card>
  );
}
