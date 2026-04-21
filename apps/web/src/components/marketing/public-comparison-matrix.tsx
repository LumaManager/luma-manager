import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@terapia/ui";
import { ContentEngagementTracker } from "@/components/analytics/content-engagement-tracker";

type ComparisonRowData = {
  label: string;
  manual: string;
  software: string;
};

export function PublicComparisonMatrix({
  rows,
  leftLabel = "Planilha + WhatsApp",
  rightLabel = "Software"
}: {
  rows: readonly ComparisonRowData[];
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[rgba(15,76,92,0.12)] bg-white shadow-[0_18px_46px_rgba(15,76,92,0.08)]">
      <ContentEngagementTracker contentKind="comparison" />
      <div className="grid grid-cols-1 gap-px bg-[rgba(15,76,92,0.08)] md:grid-cols-[1.1fr_0.95fr_0.95fr]">
        <div className="bg-[rgba(15,76,92,0.04)] p-4 text-sm font-semibold text-[var(--color-text)]">
          Critério
        </div>
        <div className="bg-[rgba(15,76,92,0.04)] p-4 text-sm font-semibold text-[var(--color-text)]">
          {leftLabel}
        </div>
        <div className="bg-[rgba(15,76,92,0.04)] p-4 text-sm font-semibold text-[var(--color-text)]">
          {rightLabel}
        </div>

        {rows.map((row) => (
          <ComparisonRow key={row.label} {...row} />
        ))}
      </div>
    </div>
  );
}

function ComparisonRow({ label, manual, software }: ComparisonRowData) {
  return (
    <>
      <div className="bg-white p-4">
        <p className="text-sm font-semibold text-[var(--color-text)]">{label}</p>
      </div>
      <ComparisonCell tone="manual" text={manual} />
      <ComparisonCell tone="software" text={software} />
    </>
  );
}

function ComparisonCell({ text, tone }: { text: string; tone: "manual" | "software" }) {
  return (
    <div
      className={cn(
        "flex gap-3 p-4 text-sm leading-7",
        tone === "manual" ? "bg-[rgba(244,120,77,0.04)]" : "bg-[rgba(15,76,92,0.04)]"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          tone === "manual" ? "bg-[rgba(244,120,77,0.12)]" : "bg-[rgba(15,76,92,0.12)]"
        )}
      >
        {tone === "manual" ? (
          <XCircle className="h-4 w-4 text-[var(--color-accent)]" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" />
        )}
      </div>
      <p className="text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}
