"use client";

import { useCallback, useEffect, useState } from "react";
import type { BookSlotResponse, PublicSchedulingPage, SchedulingSlot } from "@terapia/contracts";

type PageState =
  | { type: "loading" }
  | { type: "available"; data: PublicSchedulingPage }
  | { type: "confirming"; data: PublicSchedulingPage; slot: SchedulingSlot }
  | { type: "success"; confirmedAt: string; therapistName: string }
  | { type: "used" }
  | { type: "expired" }
  | { type: "not_found" }
  | { type: "error"; message: string };

export function BookingPage({ token }: { token: string }) {
  const [state, setState] = useState<PageState>({ type: "loading" });

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/public/scheduling/${token}`);
        const data = (await res.json()) as { state: string; data?: PublicSchedulingPage };
        if (data.state === "available" && data.data) {
          setState({ type: "available", data: data.data });
        } else if (data.state === "used") {
          setState({ type: "used" });
        } else if (data.state === "expired") {
          setState({ type: "expired" });
        } else {
          setState({ type: "not_found" });
        }
      } catch {
        setState({ type: "error", message: "Não foi possível carregar o link." });
      }
    })();
  }, [token]);

  async function handleBook(slot: SchedulingSlot) {
    if (state.type !== "confirming") return;
    const currentData = state.data;
    try {
      const res = await fetch(`/api/public/scheduling/${token}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: slot.date, startTime: slot.startTime })
      });
      const result = (await res.json()) as BookSlotResponse;
      if (result.success) {
        setState({ type: "success", confirmedAt: result.confirmedAt, therapistName: result.therapistName });
      } else if (result.error === "slot_taken") {
        // Re-fetch available slots
        const refresh = await fetch(`/api/public/scheduling/${token}`);
        const refreshed = (await refresh.json()) as { state: string; data?: PublicSchedulingPage };
        if (refreshed.state === "available" && refreshed.data) {
          setState({ type: "available", data: refreshed.data });
          alert("Este horário acabou de ser reservado. Por favor, escolha outro.");
        } else {
          setState({ type: "used" });
        }
      } else {
        setState({ type: "error", message: result.message });
      }
    } catch {
      setState({ type: "error", message: "Erro ao confirmar. Tente novamente." });
    }
  }

  const slotsByDay = useCallback(
    (slots: SchedulingSlot[]) => {
      const map = new Map<string, SchedulingSlot[]>();
      for (const slot of slots) {
        const existing = map.get(slot.date) ?? [];
        map.set(slot.date, [...existing, slot]);
      }
      return map;
    },
    []
  );

  if (state.type === "loading") {
    return (
      <Wrapper>
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      </Wrapper>
    );
  }

  if (state.type === "used") {
    return (
      <Wrapper>
        <StatusCard
          title="Link já utilizado"
          description="Este link já foi usado para agendar uma sessão. Entre em contato com seu terapeuta se precisar de ajuda."
        />
      </Wrapper>
    );
  }

  if (state.type === "expired") {
    return (
      <Wrapper>
        <StatusCard
          title="Link expirado"
          description="Este link não está mais disponível. Peça ao seu terapeuta um novo link."
        />
      </Wrapper>
    );
  }

  if (state.type === "not_found" || state.type === "error") {
    return (
      <Wrapper>
        <StatusCard
          title="Link inválido"
          description={state.type === "error" ? state.message : "Este link não existe ou foi removido."}
        />
      </Wrapper>
    );
  }

  if (state.type === "success") {
    return (
      <Wrapper>
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-panel)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(15,76,92,0.10)] text-[var(--color-primary)]">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Sessão confirmada!</h2>
          <p className="mt-3 text-[var(--color-text-muted)]">{state.confirmedAt}</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">com {state.therapistName}</p>
        </div>
      </Wrapper>
    );
  }

  if (state.type === "confirming") {
    const { data, slot } = state;
    return (
      <Wrapper>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Olá, {data.patientFirstName}!</p>
            <h1 className="mt-1 text-2xl font-semibold">Confirmar agendamento</h1>
          </div>
          <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-panel)]">
            <p className="text-lg font-semibold">{slot.dayLabel}</p>
            <p className="mt-1 text-[var(--color-text-muted)]">{slot.startTime} – {slot.endTime}</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">com {data.therapistName}</p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold transition hover:bg-[var(--color-surface-raised)]"
              onClick={() => setState({ type: "available", data })}
              type="button"
            >
              Voltar
            </button>
            <button
              className="flex-1 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              onClick={() => void handleBook(slot)}
              type="button"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Wrapper>
    );
  }

  // state.type === "available"
  const { data } = state;
  const dayMap = slotsByDay(data.slots);

  return (
    <Wrapper>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">Olá, {data.patientFirstName}!</p>
          <h1 className="mt-1 text-2xl font-semibold">Escolha seu horário</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Semana de {data.weekLabel} · {data.therapistName}</p>
        </div>

        {dayMap.size === 0 ? (
          <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 text-center">
            <p className="text-[var(--color-text-muted)]">Nenhum horário disponível esta semana. Entre em contato com seu terapeuta.</p>
          </div>
        ) : (
          Array.from(dayMap.entries()).map(([date, slots]) => (
            <div key={date}>
              <p className="mb-2 text-sm font-semibold text-[var(--color-text-muted)]">{slots[0]!.dayLabel}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slots.map((slot) => (
                  <button
                    key={`${slot.date}-${slot.startTime}`}
                    className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold transition hover:border-[var(--color-primary)] hover:bg-[rgba(15,76,92,0.04)]"
                    onClick={() => setState({ type: "confirming", data, slot })}
                    type="button"
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-[var(--color-surface-contrast)] px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

function StatusCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-panel)]">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}
