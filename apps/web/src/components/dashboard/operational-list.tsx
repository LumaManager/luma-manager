import type {
  ActivityEvent,
  ActionItem,
  AppointmentSummary
} from "@terapia/contracts";

import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

import { formatAppointmentStatus, formatTimeRangeLabel } from "@/lib/format";

type AgendaListProps = {
  title: string;
  description: string;
  items: AppointmentSummary[];
};

export function AgendaList({ description, items, title }: AgendaListProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] px-4 py-4"
            key={item.id}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{item.patientName}</p>
                <Badge tone="neutral">{formatAppointmentStatus(item.status)}</Badge>
              </div>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {formatTimeRangeLabel(item.startsAt, item.endsAt)} · {item.locationLabel} ·{" "}
                {item.paymentLabel}
              </p>
            </div>
            <a className="text-sm font-semibold text-[var(--color-primary)]" href={item.ctaHref}>
              {item.ctaLabel}
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

type ActionItemsListProps = {
  title: string;
  description: string;
  items: ActionItem[];
};

export function ActionItemsList({ description, items, title }: ActionItemsListProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--color-border)] bg-white px-4 py-4"
            key={item.id}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{item.title}</p>
                <Badge tone={item.tone === "info" ? "info" : item.tone === "success" ? "success" : item.tone === "warning" ? "warning" : "critical"}>
                  {item.impactLabel}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.description}</p>
            </div>
            <a className="text-sm font-semibold text-[var(--color-primary)]" href={item.href}>
              {item.ctaLabel}
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

type RecentActivityListProps = {
  title: string;
  description: string;
  items: ActivityEvent[];
};

export function RecentActivityList({ description, items, title }: RecentActivityListProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--color-border)] bg-[rgba(246,241,232,0.68)] px-4 py-4"
            key={item.id}
          >
            <div className="min-w-0">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                {item.occurredAtLabel}
              </span>
              <a className="text-sm font-semibold text-[var(--color-primary)]" href={item.href}>
                Abrir
              </a>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
