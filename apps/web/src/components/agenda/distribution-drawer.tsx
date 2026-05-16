"use client";

import { useEffect, useState, useTransition } from "react";
import { Badge, Button, cn } from "@terapia/ui";
import type { GenerateWeekTokensResponse, SchedulingTokenItem } from "@terapia/contracts";
import { ChevronLeft, ChevronRight, MessageCircle, RefreshCw } from "lucide-react";

type DistributionDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

function getNextWeekMonday(): string {
  const now = new Date();
  const todayDow = now.getUTCDay();
  const daysUntilNextMonday = ((8 - todayDow) % 7) || 7;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + daysUntilNextMonday);
  return monday.toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildWeekLabel(weekStart: string): string {
  const weekEnd = addDays(weekStart, 6);
  const start = new Date(weekStart + "T12:00:00Z");
  const end = new Date(weekEnd + "T12:00:00Z");
  const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${start.getUTCDate()}–${end.getUTCDate()} de ${MONTHS[start.getUTCMonth()]}`;
  }
  return `${start.getUTCDate()} ${MONTHS[start.getUTCMonth()]} – ${end.getUTCDate()} ${MONTHS[end.getUTCMonth()]}`;
}

export function DistributionDrawer({ isOpen, onClose }: DistributionDrawerProps) {
  const [weekStart, setWeekStart] = useState(getNextWeekMonday);
  const [result, setResult] = useState<GenerateWeekTokensResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isOpen) return;
    void (async () => {
      try {
        const res = await fetch(`/api/scheduling/tokens/week?weekStart=${weekStart}`);
        if (res.ok) {
          const data = (await res.json()) as GenerateWeekTokensResponse;
          if (data.tokens.length > 0) setResult(data);
        }
      } catch {
        // no tokens yet — that's fine
      }
    })();
  }, [isOpen, weekStart]);

  function navigateWeek(direction: -1 | 1) {
    setWeekStart((prev) => addDays(prev, direction * 7));
    setResult(null);
    setError(null);
  }

  function generateTokens() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/scheduling/tokens/generate-week", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weekStart })
        });
        if (!res.ok) throw new Error("Erro ao gerar links.");
        const data = (await res.json()) as GenerateWeekTokensResponse;
        setResult(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro inesperado.");
      }
    });
  }

  if (!isOpen) return null;

  const weekLabel = buildWeekLabel(weekStart);
  const confirmedCount = result?.tokens.filter((t) => t.status === "used").length ?? 0;
  const totalCount = result?.tokens.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(19,29,33,0.36)] p-4 backdrop-blur-[2px]">
      <div className="flex h-full w-full max-w-lg flex-col rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-contrast)] shadow-[0_30px_80px_rgba(15,76,92,0.24)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-6">
          <div>
            <Badge tone="info">Distribuição de links</Badge>
            <h2 className="mt-4 text-2xl font-semibold">Agendar semana</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Gere e envie links de agendamento para seus pacientes via WhatsApp.
            </p>
          </div>
          <Button onClick={onClose} type="button" variant="ghost">Fechar</Button>
        </div>

        {/* Week navigator */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-3">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            onClick={() => navigateWeek(-1)}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold">{weekLabel}</p>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            onClick={() => navigateWeek(1)}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!result ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <p className="text-center text-sm text-[var(--color-text-muted)]">
                Gere links para todos os pacientes ativos da semana de {weekLabel}.
              </p>
              {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
              <Button disabled={isPending} onClick={generateTokens} type="button">
                {isPending ? "Gerando..." : "Gerar links"}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-muted)]">
                  {confirmedCount}/{totalCount} confirmados
                </p>
                <button
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
                  disabled={isPending}
                  onClick={generateTokens}
                  type="button"
                >
                  <RefreshCw className="h-3 w-3" />
                  Atualizar
                </button>
              </div>
              {result.tokens.map((item) => (
                <TokenRow key={item.patientId} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TokenRow({ item }: { item: SchedulingTokenItem }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{item.patientName}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge tone={item.status === "used" ? "success" : item.status === "expired" ? "warning" : "neutral"}>
          {item.status === "used" ? "Confirmado" : item.status === "expired" ? "Expirado" : "Aguardando"}
        </Badge>
        {item.status === "pending" ? (
          <a
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white px-3 text-xs font-semibold transition hover:bg-[rgba(15,76,92,0.04)]"
            )}
            href={item.whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
            WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}
