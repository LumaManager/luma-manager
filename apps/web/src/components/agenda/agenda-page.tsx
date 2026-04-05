"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import type {
  AgendaAvailabilityRule,
  AgendaAvailabilityUpdateRequest,
  AgendaResponse,
  AppointmentCreateRequest,
  AppointmentCreateResponse,
  AppointmentDetail,
  AppointmentRescheduleRequest,
  AppointmentCancelRequest,
  ScheduleBlock,
  ScheduleBlockCreateRequest
} from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader, cn } from "@terapia/ui";
import {
  Ban,
  CalendarDays,
  CalendarPlus2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Clock3,
  DoorOpen,
  Filter,
  LockKeyhole,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { OperationalHero, ToolbarPanel } from "@/components/shared/operational-surface";

type AgendaPageViewProps = {
  initialData: AgendaResponse;
  initialSelectedAppointment: AppointmentDetail | null;
  patientOptions: Array<{
    id: string;
    label: string;
    meta: string;
  }>;
};

const DAY_GRID_HEIGHT = 720;
const DAY_GRID_START = 8 * 60;

export function AgendaPageView({
  initialData,
  initialSelectedAppointment,
  patientOptions
}: AgendaPageViewProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBlockDrawerOpen, setIsBlockDrawerOpen] = useState(false);
  const [isAvailabilityDrawerOpen, setIsAvailabilityDrawerOpen] = useState(false);
  const [gridMoveMode, setGridMoveMode] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const readOnly = initialData.accountStatus !== "ready_for_operations";
  const appointmentBlocks = initialData.scheduleBlocks.filter((block) => block.type === "appointment");
  const blockCount = initialData.scheduleBlocks.filter((block) => block.type === "block").length;
  const availabilityDayCount = initialData.availabilityRules.filter((rule) => rule.enabled).length;
  const nextActionLabel = readOnly ? "Leitura preservada" : "Nova sessão liberada";
  const focusDayKey =
    initialData.dayColumns.find((day) => day.isToday)?.key ?? initialData.dayColumns[0]?.key ?? "2026-03-30";
  const focusDayLabel =
    initialData.dayColumns.find((day) => day.key === focusDayKey)?.dateLabel ?? focusDayKey;
  const focusDayAppointments = appointmentBlocks.filter((block) => block.dayKey === focusDayKey);
  const focusDayBlocks = initialData.scheduleBlocks.filter(
    (block) => block.type === "block" && block.dayKey === focusDayKey
  );
  const selectedBlockId = searchParams.get("block");
  const selectedAppointmentId = searchParams.get("appointment");
  const selectedBlock =
    initialData.scheduleBlocks.find(
      (block): block is ScheduleBlock => block.type === "block" && block.id === selectedBlockId
    ) ?? null;
  const selectedAppointment =
    initialSelectedAppointment && initialSelectedAppointment.id === selectedAppointmentId
      ? initialSelectedAppointment
      : null;

  function updateParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value.length === 0) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function shiftDate(direction: "prev" | "next") {
    const source = searchParams.get("date") ?? initialData.dayColumns[0]?.key ?? "2026-03-30";
    const date = new Date(`${source}T12:00:00Z`);

    if (initialData.currentView === "month") {
      date.setUTCMonth(date.getUTCMonth() + (direction === "next" ? 1 : -1));
    } else {
      const amount = initialData.currentView === "day" ? 1 : 7;
      date.setUTCDate(date.getUTCDate() + (direction === "next" ? amount : -amount));
    }

    updateParam("date", date.toISOString().slice(0, 10));
  }

  function closeBlockPanel() {
    setIsBlockDrawerOpen(false);
    updateParam("block", "");
  }

  function closeAppointmentPanel() {
    updateParam("appointment", "");
    setGridMoveMode(false);
    setMoveError(null);
  }

  function startGridMoveMode() {
    setMoveError(null);
    setGridMoveMode(true);
  }

  function stopGridMoveMode() {
    setGridMoveMode(false);
    setMoveError(null);
  }

  async function moveAppointmentToSlot(dayKey: string, startTime: string) {
    if (!selectedAppointment) {
      return;
    }

    setMoveError(null);

    const currentNote =
      selectedAppointment.sessionData.find((item) => item.label === "Observação operacional")?.value ?? "";

    const response = await fetch(`/api/appointments/${selectedAppointment.id}/reschedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: dayKey,
        startTime,
        durationMinutes: Number.parseInt(selectedAppointment.durationLabel, 10) || 50,
        modality: selectedAppointment.modality,
        note: currentNote
      } satisfies AppointmentRescheduleRequest)
    });

    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      setMoveError(payload?.message ?? "Não foi possível reposicionar a sessão na grade.");
      return;
    }

    setGridMoveMode(false);
    router.refresh();
  }

  return (
    <>
      <div className="space-y-6">
        <OperationalHero
          actions={
            <>
              <Button disabled={readOnly} onClick={() => setIsDrawerOpen(true)} type="button">
                <CalendarPlus2 className="h-4 w-4" />
                Nova sessão
              </Button>
              <Button onClick={() => setIsAvailabilityDrawerOpen(true)} type="button" variant="secondary">
                Editar disponibilidade
              </Button>
              <Button
                disabled={readOnly}
                onClick={() => {
                  updateParam("block", "");
                  setIsBlockDrawerOpen(true);
                }}
                type="button"
                variant="ghost"
              >
                <Ban className="h-4 w-4" />
                Novo bloqueio
              </Button>
            </>
          }
          aside={
            <div className="space-y-3">
              <Badge tone="neutral">Foco do dia</Badge>
              <p className="text-lg font-semibold tracking-[-0.02em]">{focusDayLabel}</p>
              <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                {focusDayAppointments.length} sessão(ões) e {focusDayBlocks.length} bloqueio(s) no
                dia em destaque.
              </p>
              {readOnly ? (
                <div className="rounded-2xl border border-[rgba(198,122,69,0.22)] bg-[rgba(198,122,69,0.08)] p-3 text-sm leading-6 text-[var(--color-accent)]">
                  Conta em modo de leitura. Criação e alteração ficam bloqueadas até voltar para
                  `ready_for_operations`.
                </div>
              ) : null}
            </div>
          }
          badges={
            <>
              <Badge tone="info">Agenda calendar-first</Badge>
              <Badge tone={readOnly ? "warning" : "success"}>{nextActionLabel}</Badge>
            </>
          }
          description="Gerencie disponibilidade, sessões e conflitos do consultório sem transformar a tela em lista solta. A semana continua como visão principal."
          stats={[
            {
              detail: "Sessões visíveis no período atual.",
              label: "Sessões",
              tone: appointmentBlocks.length > 0 ? "info" : "neutral",
              value: String(appointmentBlocks.length)
            },
            {
              detail: "Bloqueios operacionais e intervalos já marcados.",
              label: "Bloqueios",
              tone: blockCount > 0 ? "warning" : "neutral",
              value: String(blockCount)
            },
            {
              detail: "Dias com disponibilidade recorrente ativa.",
              label: "Disponibilidade",
              tone: availabilityDayCount > 0 ? "success" : "warning",
              value: String(availabilityDayCount)
            }
          ]}
          title="Agenda"
        />

        <ToolbarPanel description="Troque visão, período e filtros sem perder o contexto da grade atual." title="Controlar a grade">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => shiftDate("prev")} type="button" variant="ghost">
                <ChevronLeft className="h-4 w-4" />
                Período anterior
              </Button>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.04)] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Período visível
                </p>
                <p className="mt-1 text-base font-semibold">{initialData.visibleRangeLabel}</p>
              </div>
              <Button
                onClick={() => {
                  updateParam("date", "2026-03-30");
                  updateParam("view", "week");
                }}
                type="button"
                variant="secondary"
              >
                Hoje
              </Button>
              <Button onClick={() => shiftDate("next")} type="button" variant="ghost">
                Próximo período
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 xl:grid-cols-[repeat(4,minmax(0,auto))]">
              <SegmentedControl
                label="Visualização"
                onChange={(value) => updateParam("view", value)}
                options={[
                  { label: "Dia", value: "day" },
                  { label: "Semana", value: "week" },
                  { label: "Mês", value: "month" }
                ]}
                value={initialData.currentView}
              />
              <SelectField
                label="Status"
                onChange={(value) => updateParam("status", value === "all" ? "" : value)}
                options={[
                  { label: "Todos", value: "all" },
                  { label: "Agendada", value: "scheduled" },
                  { label: "Confirmada", value: "confirmed" },
                  { label: "Em andamento", value: "in_progress" },
                  { label: "Concluída", value: "completed" },
                  { label: "Cancelada", value: "cancelled" },
                  { label: "No-show", value: "no_show" }
                ]}
                value={initialData.filters.status}
              />
              <SelectField
                label="Modalidade"
                onChange={(value) => updateParam("modality", value === "all" ? "" : value)}
                options={[
                  { label: "Todas", value: "all" },
                  { label: "Teleatendimento", value: "telehealth" },
                  { label: "Presencial", value: "in_person" }
                ]}
                value={initialData.filters.modality}
              />
              <div className="rounded-2xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.04)] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Foco operacional
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {appointmentBlocks.length} sessões na grade atual
                </p>
              </div>
            </div>
          </div>
        </ToolbarPanel>

        {gridMoveMode && selectedAppointment ? (
          <section className="rounded-[28px] border border-[rgba(15,76,92,0.18)] bg-[rgba(15,76,92,0.08)] px-5 py-4 shadow-[var(--shadow-panel)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  Reposicionando {selectedAppointment.patientName}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                  Clique na nova faixa horária da grade para remarcar. O backend continua validando conflito antes de salvar.
                </p>
              </div>
              <Button onClick={stopGridMoveMode} type="button" variant="ghost">
                Sair do modo de reposicionamento
              </Button>
            </div>
            {moveError ? (
              <div className="mt-4 rounded-2xl border border-[rgba(178,74,58,0.18)] bg-[rgba(178,74,58,0.08)] px-4 py-3 text-sm text-[var(--color-danger)]">
                {moveError}
              </div>
            ) : null}
          </section>
        ) : null}

        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_292px]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">Grade operacional</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Sessões e bloqueios ficam acima da disponibilidade. O objetivo aqui é escanear
                    e agir, não analisar BI.
                  </p>
                </div>
                <Badge tone="neutral">
                  <CalendarDays className="mr-2 inline h-3.5 w-3.5" />
                  {initialData.currentView === "week"
                    ? "Semana padrão"
                    : initialData.currentView === "day"
                      ? "Precisão diária"
                      : "Panorama mensal"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {initialData.currentView === "month" ? (
                <MonthView data={initialData} onOpenDay={(dayKey) => {
                  updateParam("date", dayKey);
                  updateParam("view", "day");
                }} />
              ) : (
                <TimeGridView
                  activeAppointmentId={selectedAppointment?.id ?? null}
                  activeBlockId={selectedBlock?.id ?? null}
                  data={initialData}
                  moveModeAppointment={gridMoveMode ? selectedAppointment : null}
                  onSlotSelect={moveAppointmentToSlot}
                />
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <p className="text-lg font-semibold">Foco do dia</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  A leitura lateral resume a coluna em destaque sem tirar você da grade.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
                  <p className="text-sm font-semibold">{focusDayLabel}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                    {focusDayAppointments.length} sessões e {focusDayBlocks.length} bloqueios no foco atual.
                  </p>
                </div>
                {focusDayAppointments.slice(0, 3).map((block) => (
                  <Link
                    className="block rounded-3xl border border-[var(--color-border)] px-4 py-4 transition hover:bg-[rgba(15,76,92,0.03)]"
                    href={block.href ?? "/app/agenda"}
                    key={block.id}
                  >
                    <p className="text-sm font-semibold">{block.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                      {block.subtitle}
                    </p>
                  </Link>
                ))}
                {focusDayBlocks.slice(0, 2).map((block) => (
                  <Link
                    className="block rounded-3xl border border-[var(--color-border)] bg-[rgba(198,122,69,0.07)] px-4 py-4 transition hover:bg-[rgba(198,122,69,0.12)]"
                    href={block.href ?? `/app/agenda?date=${block.dayKey}&view=${initialData.currentView}&block=${block.id}`}
                    key={block.id}
                  >
                    <p className="text-sm font-semibold">{block.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                      {block.subtitle}
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-lg font-semibold">Mesa de ação</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  O resumo lateral filtra o que exige movimento agora.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuickMetric
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Próximas sessões"
                  value={`${focusDayAppointments.length} no foco atual`}
                />
                <QuickMetric
                  icon={<Filter className="h-4 w-4" />}
                  label="Bloqueios"
                  value={`${initialData.scheduleBlocks.filter((block) => block.type === "block").length} na faixa visível`}
                />
                <QuickMetric
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Disponibilidade"
                  value={`${initialData.scheduleBlocks.filter((block) => block.type === "availability").length} janelas recorrentes`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-lg font-semibold">Ações rápidas</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {initialData.quickActions.map((action) => (
                  <Link
                    className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--color-border)] px-4 py-4 transition hover:bg-[rgba(15,76,92,0.03)]"
                    href={action.href}
                    key={action.id}
                  >
                    <div>
                      <p className="font-semibold">{action.label}</p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Navegação curta para o próximo passo operacional.
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-lg font-semibold">Legenda operacional</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <LegendItem tone="success" label="Disponível ou concluída sem bloqueio" />
                <LegendItem tone="info" label="Sessão ativa, confirmada ou pronta para atenção" />
                <LegendItem tone="warning" label="Pendência ou bloqueio não definitivo" />
                <LegendItem tone="critical" label="Cancelamento ou bloqueio forte" />
                <div className="rounded-3xl bg-[rgba(15,76,92,0.04)] p-4 text-sm leading-6 text-[var(--color-text-muted)]">
                  O fluxo de pós-sessão continua útil com texto ou ditado. Áudio segue capability
                  condicional, não requisito da agenda.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AppointmentCreateDrawer
        currentView={initialData.currentView}
        defaultDate={searchParams.get("date") ?? initialData.dayColumns[0]?.key ?? "2026-03-30"}
        isOpen={isDrawerOpen}
        isPending={isPending}
        onClose={() => setIsDrawerOpen(false)}
        onCreated={(href) => {
          setIsDrawerOpen(false);
          startTransition(() => {
            router.push(href);
            router.refresh();
          });
        }}
        patientOptions={patientOptions}
        readOnly={readOnly}
      />
      <BlockDrawer
        block={selectedBlock}
        defaultDate={searchParams.get("date") ?? initialData.dayColumns[0]?.key ?? "2026-03-30"}
        isOpen={isBlockDrawerOpen || selectedBlock !== null}
        isPending={isPending}
        onClose={closeBlockPanel}
        onCompleted={() => {
          closeBlockPanel();
          startTransition(() => {
            router.refresh();
          });
        }}
        onDeleted={() => {
          closeBlockPanel();
          startTransition(() => {
            router.refresh();
          });
        }}
        readOnly={readOnly}
      />
      <AvailabilityDrawer
        initialRules={initialData.availabilityRules}
        isOpen={isAvailabilityDrawerOpen}
        isPending={isPending}
        onClose={() => setIsAvailabilityDrawerOpen(false)}
        onSaved={() => {
          setIsAvailabilityDrawerOpen(false);
          startTransition(() => {
            router.refresh();
          });
        }}
        readOnly={readOnly}
      />
      <AppointmentQuickDrawer
        appointment={selectedAppointment}
        gridMoveAvailable={initialData.currentView !== "month"}
        gridMoveMode={gridMoveMode}
        onEnterGridMoveMode={startGridMoveMode}
        isOpen={selectedAppointment !== null}
        onClose={closeAppointmentPanel}
      />
    </>
  );
}

function TimeGridView({
  activeAppointmentId,
  activeBlockId,
  data,
  moveModeAppointment,
  onSlotSelect
}: {
  activeAppointmentId: string | null;
  activeBlockId: string | null;
  data: AgendaResponse;
  moveModeAppointment: AppointmentDetail | null;
  onSlotSelect: (dayKey: string, startTime: string) => void;
}) {
  const dayCount = data.dayColumns.length;
  const slotHeight = DAY_GRID_HEIGHT / data.timeSlots.length;
  const slotMinutes = getSlotMinutes(data.timeSlots);

  return (
    <div className="overflow-x-auto">
      <div
        className={cn("grid", dayCount > 1 && "min-w-[780px] 2xl:min-w-0")}
        style={{
          gridTemplateColumns: `72px repeat(${dayCount}, minmax(0, 1fr))`
        }}
      >
        <div className="border-r border-[var(--color-border)] bg-[rgba(15,76,92,0.02)]" />
        {data.dayColumns.map((day) => (
          <div
            className={cn(
              "border-r border-[var(--color-border)] px-3 py-3",
              day.isToday ? "bg-[rgba(15,76,92,0.06)]" : "bg-[rgba(15,76,92,0.02)]"
            )}
            key={day.key}
          >
            <p className="text-sm font-semibold">{day.label}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              {day.dateLabel}
            </p>
          </div>
        ))}

        <div className="relative border-r border-[var(--color-border)] bg-[rgba(15,76,92,0.02)]">
          {data.timeSlots.map((slot) => (
            <div
              className="relative border-b border-[rgba(214,224,229,0.72)] px-2 pt-2 text-[11px] text-[var(--color-text-muted)]"
              key={slot}
              style={{ height: `${slotHeight}px` }}
            >
              {slot}
            </div>
          ))}
        </div>

        {data.dayColumns.map((day) => (
          <div
            className={cn(
              "relative grid border-r border-[var(--color-border)]",
              day.isToday ? "bg-[rgba(15,76,92,0.02)]" : "bg-white"
            )}
            key={day.key}
            style={{
              gridTemplateRows: `repeat(${data.timeSlots.length}, minmax(0, 1fr))`,
              height: `${DAY_GRID_HEIGHT}px`
            }}
          >
            {data.timeSlots.map((slot, index) => (
              <div
                className={cn(
                  "border-b border-[rgba(214,224,229,0.72)]",
                  index % 2 === 0 ? "bg-[rgba(15,76,92,0.015)]" : "bg-transparent"
                )}
                key={`${day.key}-${slot}`}
                style={{ minHeight: `${slotHeight}px` }}
              />
            ))}
            {moveModeAppointment ? (
              <div className="absolute inset-0 z-20 grid" style={{ gridTemplateRows: `repeat(${data.timeSlots.length}, minmax(0, 1fr))` }}>
                {data.timeSlots.map((slot) => (
                  <button
                    className="border-b border-transparent transition hover:bg-[rgba(15,76,92,0.08)]"
                    key={`${day.key}-${slot}-target`}
                    onClick={() => onSlotSelect(day.key, slot)}
                    type="button"
                  >
                    <span className="sr-only">
                      Reposicionar {moveModeAppointment.patientName} para {day.label} às {slot}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
            {data.scheduleBlocks
              .filter((block) => block.dayKey === day.key)
              .sort((left, right) => blockOrder[left.type] - blockOrder[right.type])
              .map((block) => (
                <CalendarBlock
                  active={
                    (block.type === "appointment" && block.id === activeAppointmentId) ||
                    (block.type === "block" && block.id === activeBlockId)
                  }
                  dimmed={moveModeAppointment?.id === block.id}
                  block={block}
                  key={block.id}
                  slotMinutes={slotMinutes}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthView({
  data,
  onOpenDay
}: {
  data: AgendaResponse;
  onOpenDay: (dayKey: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-px bg-[var(--color-border)]">
      {data.dayColumns.map((day) => {
        const items = data.scheduleBlocks.filter(
          (block) => block.dayKey === day.key && block.type === "appointment"
        );
        const blocks = data.scheduleBlocks.filter(
          (block) => block.dayKey === day.key && block.type === "block"
        );

        return (
          <button
            className={cn(
              "min-h-[160px] bg-white p-4 text-left transition hover:bg-[rgba(15,76,92,0.03)]",
              day.isToday ? "bg-[rgba(15,76,92,0.06)]" : ""
            )}
            key={day.key}
            onClick={() => onOpenDay(day.key)}
            type="button"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{day.dateLabel}</p>
              {day.isToday ? <Badge tone="info">Hoje</Badge> : null}
            </div>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              {items.length} sessões · {blocks.length} bloqueios
            </p>
            <div className="mt-4 space-y-2">
              {items.slice(0, 3).map((item) => (
                <div
                  className={cn(
                    "rounded-2xl px-3 py-2 text-xs font-medium",
                    toneClasses[item.tone]
                  )}
                  key={item.id}
                >
                  {item.title} · {item.startsAt.slice(11, 16)}
                </div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CalendarBlock({
  active,
  block,
  dimmed,
  slotMinutes
}: {
  active: boolean;
  block: ScheduleBlock;
  dimmed: boolean;
  slotMinutes: number;
}) {
  const style = getBlockGridStyle(block, slotMinutes);
  const className = cn(
    "relative z-10 mx-1.5 my-1 min-h-[48px] overflow-hidden rounded-2xl border px-2.5 py-2 text-left shadow-sm transition",
    block.type === "availability"
      ? "border-dashed border-[rgba(63,107,97,0.24)] bg-[rgba(63,107,97,0.08)] text-[var(--color-success)]"
      : toneClasses[block.tone],
    active && "ring-2 ring-[rgba(15,76,92,0.22)] shadow-[0_10px_24px_rgba(15,76,92,0.18)]",
    dimmed && "opacity-45"
  );
  const content = (
    <>
      <p className="truncate text-[13px] font-semibold leading-5">{block.title}</p>
      <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 opacity-80">{block.subtitle}</p>
    </>
  );

  if (block.href) {
    return (
      <Link className={className} href={block.href} key={block.id} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className} style={style}>
      {content}
    </div>
  );
}

function SegmentedControl({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <div className="inline-flex rounded-2xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.04)] p-1">
        {options.map((option) => (
          <button
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold transition",
              value === option.value
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-muted)]"
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </span>
      <select
        className="h-12 min-w-[150px] rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function QuickMetric({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
      <div className="flex items-center gap-2 text-[var(--color-primary)]">{icon}</div>
      <p className="mt-3 text-sm font-semibold">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{value}</p>
    </div>
  );
}

function LegendItem({
  label,
  tone
}: {
  label: string;
  tone: keyof typeof toneClasses;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] px-3 py-3">
      <span className={cn("h-3 w-3 rounded-full", dotToneClasses[tone])} />
      <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}

function AppointmentCreateDrawer({
  currentView,
  defaultDate,
  isOpen,
  isPending,
  onClose,
  onCreated,
  patientOptions,
  readOnly
}: {
  currentView: AgendaResponse["currentView"];
  defaultDate: string;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onCreated: (href: string) => void;
  patientOptions: AgendaPageViewProps["patientOptions"];
  readOnly: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AppointmentCreateRequest>({
    patientId: patientOptions[0]?.id ?? "",
    date: defaultDate,
    startTime: currentView === "day" ? "09:00" : "14:00",
    durationMinutes: 50,
    modality: "telehealth",
    note: ""
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(19,29,33,0.36)] p-4 backdrop-blur-[2px]">
      <div className="flex h-full w-full max-w-xl flex-col rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-contrast)] shadow-[0_30px_80px_rgba(15,76,92,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-6">
          <div>
            <div className="flex items-center gap-3">
              <Badge tone={readOnly ? "warning" : "info"}>{readOnly ? "Leitura" : "Drawer principal"}</Badge>
              {readOnly ? <LockKeyhole className="h-4 w-4 text-[var(--color-accent)]" /> : null}
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Nova sessão</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              O agendamento nasce aqui com dados suficientes para operação. Regras clínicas e
              auditoria continuam do lado do backend.
            </p>
          </div>
          <Button onClick={onClose} type="button" variant="ghost">
            Fechar
          </Button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Paciente
            </span>
            <select
              className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
              onChange={(event) => setForm((current) => ({ ...current, patientId: event.target.value }))}
              value={form.patientId}
            >
              {patientOptions.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.label} · {patient.meta}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Data"
              value={form.date}
              onChange={(value) => setForm((current) => ({ ...current, date: value }))}
              type="date"
            />
            <Field
              label="Hora"
              value={form.startTime}
              onChange={(value) => setForm((current) => ({ ...current, startTime: value }))}
              type="time"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Duração
              </span>
              <select
                className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    durationMinutes: Number(event.target.value)
                  }))
                }
                value={String(form.durationMinutes)}
              >
                <option value="50">50 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Modalidade
              </span>
              <select
                className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    modality: event.target.value as AppointmentCreateRequest["modality"]
                  }))
                }
                value={form.modality}
              >
                <option value="telehealth">Teleatendimento</option>
                <option value="in_person">Presencial</option>
              </select>
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Observação operacional
            </span>
            <textarea
              className="min-h-[140px] w-full rounded-[24px] border border-[var(--color-border-strong)] bg-white px-4 py-4 outline-none"
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              placeholder="Ex.: confirmar endereço, revisar sala online ou orientar pagamento."
              value={form.note}
            />
          </label>

          <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.04)] p-4">
            <div className="flex items-center gap-2 text-[var(--color-primary)]">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-sm font-semibold">Direção do produto</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              O core do fluxo continua funcional sem áudio. A sessão pode nascer por texto e o
              backend continua guardando autorização, auditoria e regras do domínio clínico.
            </p>
          </div>

          {error ? (
            <div className="rounded-3xl border border-[rgba(178,74,58,0.24)] bg-[rgba(178,74,58,0.08)] p-4 text-sm leading-6 text-[var(--color-danger)]">
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] p-6">
          <Button onClick={onClose} type="button" variant="ghost">
            Cancelar
          </Button>
          <Button
            disabled={isPending || readOnly || form.patientId.length === 0}
            onClick={async () => {
              setError(null);

              const response = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
              });

              if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { message?: string } | null;
                setError(payload?.message ?? "Não foi possível criar a sessão.");
                return;
              }

              const payload = (await response.json()) as AppointmentCreateResponse;
              onCreated(payload.href);
            }}
            type="button"
          >
            <CalendarPlus2 className="h-4 w-4" />
            Criar sessão
          </Button>
        </div>
      </div>
    </div>
  );
}

function BlockDrawer({
  block,
  defaultDate,
  isOpen,
  isPending,
  onClose,
  onCompleted,
  onDeleted,
  readOnly
}: {
  block: ScheduleBlock | null;
  defaultDate: string;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onCompleted: () => void;
  onDeleted: () => void;
  readOnly: boolean;
}) {
  const isEditing = block !== null;
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ScheduleBlockCreateRequest>({
    date: defaultDate,
    startTime: "12:00",
    endTime: "13:00",
    title: "Bloqueio interno",
    subtitle: "Janela reservada para atividade sem atendimento.",
    tone: "warning"
  });

  useEffect(() => {
    if (block) {
      setForm({
        date: block.dayKey,
        startTime: block.startsAt.slice(11, 16),
        endTime: block.endsAt.slice(11, 16),
        title: block.title,
        subtitle: block.subtitle,
        tone: block.tone
      });
      return;
    }

    setForm({
      date: defaultDate,
      startTime: "12:00",
      endTime: "13:00",
      title: "Bloqueio interno",
      subtitle: "Janela reservada para atividade sem atendimento.",
      tone: "warning"
    });
  }, [block, defaultDate]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(19,29,33,0.36)] p-4 backdrop-blur-[2px]">
      <div className="flex h-full w-full max-w-xl flex-col rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-contrast)] shadow-[0_30px_80px_rgba(15,76,92,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-6">
          <div>
            <div className="flex items-center gap-3">
              <Badge tone={readOnly ? "warning" : "neutral"}>
                {readOnly ? "Leitura" : isEditing ? "Editar bloqueio" : "Proteção da agenda"}
              </Badge>
              <Ban className="h-4 w-4 text-[var(--color-accent)]" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">
              {isEditing ? "Editar bloqueio" : "Novo bloqueio"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {isEditing
                ? "Ajuste a janela protegida sem sair da agenda. O backend continua validando conflitos antes de salvar."
                : "Reserve um intervalo para supervisão, reunião, deslocamento ou qualquer janela em que a agenda não deva aceitar sessão."}
            </p>
          </div>
          <Button onClick={onClose} type="button" variant="ghost">
            Fechar
          </Button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Data"
              value={form.date}
              onChange={(value) => setForm((current) => ({ ...current, date: value }))}
              type="date"
            />
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Severidade visual
              </span>
              <select
                className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    tone: event.target.value as ScheduleBlockCreateRequest["tone"]
                  }))
                }
                value={form.tone}
              >
                <option value="warning">Atenção</option>
                <option value="critical">Crítico</option>
                <option value="info">Informativo</option>
                <option value="success">Leve</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Hora inicial"
              value={form.startTime}
              onChange={(value) => setForm((current) => ({ ...current, startTime: value }))}
              type="time"
            />
            <Field
              label="Hora final"
              value={form.endTime}
              onChange={(value) => setForm((current) => ({ ...current, endTime: value }))}
              type="time"
            />
          </div>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Título
            </span>
            <input
              className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              value={form.title}
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Motivo operacional
            </span>
            <textarea
              className="min-h-[120px] w-full rounded-[24px] border border-[var(--color-border-strong)] bg-white px-4 py-4 outline-none"
              onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))}
              placeholder="Ex.: supervisão clínica, reunião interna, deslocamento ou pausa protegida."
              value={form.subtitle}
            />
          </label>

          <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(198,122,69,0.07)] p-4 text-sm leading-6 text-[var(--color-text-muted)]">
            O bloqueio vira um artefato operacional explícito na grade. Isso reduz conflito manual
            e deixa claro por que a janela não pode receber nova sessão.
          </div>

          {error ? (
            <div className="rounded-3xl border border-[rgba(178,74,58,0.24)] bg-[rgba(178,74,58,0.08)] p-4 text-sm leading-6 text-[var(--color-danger)]">
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] p-6">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <Button
                disabled={isPending || readOnly || !block}
                onClick={async () => {
                  if (!block) {
                    return;
                  }

                  setError(null);

                  const response = await fetch(`/api/appointments/blocks/${block.id}/delete`, {
                    method: "POST"
                  });

                  if (!response.ok) {
                    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
                    setError(payload?.message ?? "Não foi possível excluir o bloqueio.");
                    return;
                  }

                  onDeleted();
                }}
                type="button"
                variant="ghost"
              >
                Excluir
              </Button>
            ) : (
              <Button onClick={onClose} type="button" variant="ghost">
                Cancelar
              </Button>
            )}
          </div>
          <Button
            disabled={isPending || readOnly || form.title.trim().length < 3 || form.subtitle.trim().length < 3}
            onClick={async () => {
              setError(null);

              const response = await fetch(
                isEditing && block ? `/api/appointments/blocks/${block.id}` : "/api/appointments/blocks",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(form)
                }
              );

              if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { message?: string } | null;
                setError(
                  payload?.message ??
                    (isEditing ? "Não foi possível atualizar o bloqueio." : "Não foi possível criar o bloqueio.")
                );
                return;
              }

              onCompleted();
            }}
            type="button"
            variant="secondary"
          >
            <Ban className="h-4 w-4" />
            {isEditing ? "Salvar bloqueio" : "Criar bloqueio"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AvailabilityDrawer({
  initialRules,
  isOpen,
  isPending,
  onClose,
  onSaved,
  readOnly
}: {
  initialRules: AgendaAvailabilityRule[];
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSaved: () => void;
  readOnly: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<AgendaAvailabilityRule[]>(initialRules);

  useEffect(() => {
    setRules(initialRules);
  }, [initialRules]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(19,29,33,0.36)] p-4 backdrop-blur-[2px]">
      <div className="flex h-full w-full max-w-2xl flex-col rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-contrast)] shadow-[0_30px_80px_rgba(15,76,92,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-6">
          <div>
            <div className="flex items-center gap-3">
              <Badge tone={readOnly ? "warning" : "info"}>
                {readOnly ? "Leitura" : "Disponibilidade recorrente"}
              </Badge>
              <CalendarDays className="h-4 w-4 text-[var(--color-primary)]" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Editar disponibilidade</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Ajuste a base recorrente da agenda sem sair da semana. A intenção é reduzir conflito e
              deixar claro quando existe janela para nova sessão.
            </p>
          </div>
          <Button onClick={onClose} type="button" variant="ghost">
            Fechar
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {rules.map((rule, ruleIndex) => (
            <div
              className="rounded-[28px] border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-5"
              key={rule.weekday}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold">{rule.weekdayLabel}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {rule.enabled ? "Janelas ativas para atendimento recorrente." : "Dia sem atendimento recorrente."}
                  </p>
                </div>
                <label className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-semibold">
                  <input
                    checked={rule.enabled}
                    onChange={(event) =>
                      setRules((current) =>
                        current.map((item, index) =>
                          index === ruleIndex
                            ? {
                                ...item,
                                enabled: event.target.checked,
                                windows:
                                  event.target.checked && item.windows.length === 0
                                    ? [
                                        { id: `${item.weekday}_0`, startTime: "09:00", endTime: "12:00" }
                                      ]
                                    : item.windows
                              }
                            : item
                        )
                      )
                    }
                    type="checkbox"
                  />
                  Ativo
                </label>
              </div>

              <div className="mt-4 space-y-3">
                {rule.enabled ? (
                  rule.windows.map((window, windowIndex) => (
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end" key={window.id}>
                      <Field
                        label={`Início ${windowIndex + 1}`}
                        onChange={(value) =>
                          setRules((current) =>
                            current.map((item, index) =>
                              index === ruleIndex
                                ? {
                                    ...item,
                                    windows: item.windows.map((currentWindow, currentIndex) =>
                                      currentIndex === windowIndex
                                        ? { ...currentWindow, startTime: value }
                                        : currentWindow
                                    )
                                  }
                                : item
                            )
                          )
                        }
                        type="time"
                        value={window.startTime}
                      />
                      <Field
                        label={`Fim ${windowIndex + 1}`}
                        onChange={(value) =>
                          setRules((current) =>
                            current.map((item, index) =>
                              index === ruleIndex
                                ? {
                                    ...item,
                                    windows: item.windows.map((currentWindow, currentIndex) =>
                                      currentIndex === windowIndex
                                        ? { ...currentWindow, endTime: value }
                                        : currentWindow
                                    )
                                  }
                                : item
                            )
                          )
                        }
                        type="time"
                        value={window.endTime}
                      />
                      <Button
                        disabled={readOnly || isPending || rule.windows.length === 1}
                        onClick={() =>
                          setRules((current) =>
                            current.map((item, index) =>
                              index === ruleIndex
                                ? {
                                    ...item,
                                    windows: item.windows.filter((_, currentIndex) => currentIndex !== windowIndex)
                                  }
                                : item
                            )
                          )
                        }
                        type="button"
                        variant="ghost"
                      >
                        Remover
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] px-4 py-4 text-sm text-[var(--color-text-muted)]">
                    Nenhuma janela recorrente ativa neste dia.
                  </div>
                )}

                {rule.enabled && rule.windows.length < 3 ? (
                  <Button
                    disabled={readOnly || isPending}
                    onClick={() =>
                      setRules((current) =>
                        current.map((item, index) =>
                          index === ruleIndex
                            ? {
                                ...item,
                                windows: [
                                  ...item.windows,
                                  {
                                    id: `${item.weekday}_${item.windows.length}`,
                                    startTime: item.windows.length === 1 ? "13:00" : "18:00",
                                    endTime: item.windows.length === 1 ? "18:00" : "20:00"
                                  }
                                ]
                              }
                            : item
                        )
                      )
                    }
                    type="button"
                    variant="ghost"
                  >
                    Adicionar janela
                  </Button>
                ) : null}
              </div>
            </div>
          ))}

          {error ? (
            <div className="rounded-3xl border border-[rgba(178,74,58,0.24)] bg-[rgba(178,74,58,0.08)] p-4 text-sm leading-6 text-[var(--color-danger)]">
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] p-6">
          <Button onClick={onClose} type="button" variant="ghost">
            Cancelar
          </Button>
          <Button
            disabled={isPending || readOnly}
            onClick={async () => {
              setError(null);

              const payload: AgendaAvailabilityUpdateRequest = {
                rules: rules.map((rule) => ({
                  weekday: rule.weekday,
                  enabled: rule.enabled,
                  windows: rule.windows.map((window) => ({
                    startTime: window.startTime,
                    endTime: window.endTime
                  }))
                }))
              };

              const response = await fetch("/api/appointments/availability", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
              });

              if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { message?: string } | null;
                setError(payload?.message ?? "Não foi possível atualizar a disponibilidade.");
                return;
              }

              onSaved();
            }}
            type="button"
          >
            Salvar disponibilidade
          </Button>
        </div>
      </div>
    </div>
  );
}

function AppointmentQuickDrawer({
  appointment,
  gridMoveAvailable,
  gridMoveMode,
  onEnterGridMoveMode,
  isOpen,
  onClose
}: {
  appointment: AppointmentDetail | null;
  gridMoveAvailable: boolean;
  gridMoveMode: boolean;
  onEnterGridMoveMode: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<"cancel" | "reschedule" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [rescheduleForm, setRescheduleForm] = useState<AppointmentRescheduleRequest>({
    date: appointment?.dateKey ?? "2026-03-30",
    startTime: appointment?.startTime ?? "09:00",
    durationMinutes: appointment ? Number.parseInt(appointment.durationLabel, 10) || 50 : 50,
    modality: appointment?.modality ?? "telehealth",
    note:
      appointment?.sessionData.find((item) => item.label === "Observação operacional")?.value ?? ""
  });
  const [cancelForm, setCancelForm] = useState<AppointmentCancelRequest>({
    reason: ""
  });

  useEffect(() => {
    if (!appointment) {
      return;
    }

    setError(null);
    setActivePanel(null);
    setCancelForm({ reason: "" });
    setRescheduleForm({
      date: appointment.dateKey,
      startTime: appointment.startTime,
      durationMinutes: Number.parseInt(appointment.durationLabel, 10) || 50,
      modality: appointment.modality,
      note:
        appointment.sessionData.find((item) => item.label === "Observação operacional")?.value ?? ""
    });
  }, [appointment]);

  if (!isOpen || !appointment) {
    return null;
  }

  const appointmentId = appointment.id;

  function runMutation(
    action: "cancel" | "reschedule",
    body: AppointmentCancelRequest | AppointmentRescheduleRequest
  ) {
    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/appointments/${appointmentId}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(payload?.message ?? "Não foi possível concluir a ação.");
        return;
      }

      setActivePanel(null);
      router.refresh();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(19,29,33,0.28)] p-4 backdrop-blur-[2px]">
      <div className="flex h-full w-full max-w-[34rem] flex-col rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-contrast)] shadow-[0_30px_80px_rgba(15,76,92,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info">Sessão no contexto da agenda</Badge>
              <Badge tone="neutral">{appointment.modalityLabel}</Badge>
              <Badge tone="neutral">{appointment.statusLabel}</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">{appointment.patientName}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {appointment.dateLabel} · {appointment.timeRangeLabel} · {appointment.roomStatusLabel}
            </p>
          </div>
          <Button onClick={onClose} type="button" variant="ghost">
            Fechar
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Próxima ação
              </p>
              <p className="mt-2 text-base font-semibold">{appointment.primaryAction.label}</p>
            </div>
            <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Pagamento
              </p>
              <p className="mt-2 text-base font-semibold">
                {appointment.paymentSummary.find((item) => item.label === "Status")?.value ?? "Sem dado"}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-5">
            <p className="text-sm font-semibold">Resumo rápido</p>
            <div className="mt-4 space-y-3">
              {appointment.sessionData.slice(0, 4).map((item) => (
                <div className="flex items-start justify-between gap-4" key={item.label}>
                  <span className="text-sm text-[var(--color-text-muted)]">{item.label}</span>
                  <span className="text-right text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <Button asChild>
              <Link href={appointment.primaryAction.href}>
                <DoorOpen className="h-4 w-4" />
                {appointment.primaryAction.label}
              </Link>
            </Button>
            <Button
              disabled={!gridMoveAvailable}
              onClick={onEnterGridMoveMode}
              type="button"
              variant="secondary"
            >
              <CalendarDays className="h-4 w-4" />
              {!gridMoveAvailable
                ? "Abra dia ou semana para reposicionar"
                : gridMoveMode
                  ? "Reposicionamento ativo na grade"
                  : "Reposicionar pela grade"}
            </Button>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                disabled={!appointment.canReschedule || isPending}
                onClick={() => setActivePanel("reschedule")}
                type="button"
                variant="secondary"
              >
                <CalendarClock className="h-4 w-4" />
                Reagendar
              </Button>
              <Button
                disabled={!appointment.canCancel || isPending}
                onClick={() => setActivePanel("cancel")}
                type="button"
                variant="ghost"
              >
                <Ban className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
            <Button asChild variant="ghost">
              <Link href={`/app/appointments/${appointment.id}`}>Abrir detalhe completo</Link>
            </Button>
          </div>

          {activePanel === "reschedule" ? (
            <div className="rounded-[28px] border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-5">
              <p className="text-sm font-semibold">Reagendar sem sair da agenda</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field
                  label="Data"
                  onChange={(value) => setRescheduleForm((current) => ({ ...current, date: value }))}
                  type="date"
                  value={rescheduleForm.date}
                />
                <Field
                  label="Hora"
                  onChange={(value) => setRescheduleForm((current) => ({ ...current, startTime: value }))}
                  type="time"
                  value={rescheduleForm.startTime}
                />
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Duração
                  </span>
                  <select
                    className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
                    onChange={(event) =>
                      setRescheduleForm((current) => ({
                        ...current,
                        durationMinutes: Number(event.target.value)
                      }))
                    }
                    value={String(rescheduleForm.durationMinutes)}
                  >
                    <option value="50">50 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Modalidade
                  </span>
                  <select
                    className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
                    onChange={(event) =>
                      setRescheduleForm((current) => ({
                        ...current,
                        modality: event.target.value as AppointmentRescheduleRequest["modality"]
                      }))
                    }
                    value={rescheduleForm.modality}
                  >
                    <option value="telehealth">Teleatendimento</option>
                    <option value="in_person">Presencial</option>
                  </select>
                </label>
              </div>
              <label className="mt-4 block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Observação operacional
                </span>
                <textarea
                  className="min-h-[110px] w-full rounded-[24px] border border-[var(--color-border-strong)] bg-white px-4 py-3 outline-none"
                  onChange={(event) =>
                    setRescheduleForm((current) => ({ ...current, note: event.target.value }))
                  }
                  value={rescheduleForm.note}
                />
              </label>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => runMutation("reschedule", rescheduleForm)} type="button">
                  Salvar reagendamento
                </Button>
              </div>
            </div>
          ) : null}

          {activePanel === "cancel" ? (
            <div className="rounded-[28px] border border-[rgba(178,74,58,0.18)] bg-[rgba(178,74,58,0.08)] p-5">
              <p className="text-sm font-semibold text-[var(--color-danger)]">Cancelar sem sair da agenda</p>
              <label className="mt-4 block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Motivo
                </span>
                <textarea
                  className="min-h-[110px] w-full rounded-[24px] border border-[rgba(178,74,58,0.2)] bg-white px-4 py-3 outline-none"
                  onChange={(event) => setCancelForm({ reason: event.target.value })}
                  placeholder="Ex.: paciente pediu cancelamento e nova data será combinada depois."
                  value={cancelForm.reason}
                />
              </label>
              <div className="mt-4 flex justify-end">
                <Button
                  disabled={cancelForm.reason.trim().length < 3}
                  onClick={() => runMutation("cancel", cancelForm)}
                  type="button"
                  variant="secondary"
                >
                  Confirmar cancelamento
                </Button>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-3xl border border-[rgba(178,74,58,0.24)] bg-[rgba(178,74,58,0.08)] p-4 text-sm leading-6 text-[var(--color-danger)]">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  onChange,
  type,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  type: "date" | "time";
  value: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </span>
      <input
        className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function getSlotMinutes(timeSlots: string[]) {
  if (timeSlots.length < 2) {
    return 30;
  }

  const first = parseTimeLabel(timeSlots[0]!);
  const second = parseTimeLabel(timeSlots[1]!);
  return Math.max(15, second - first);
}

function parseTimeLabel(value: string) {
  const [hours = 0, minutes = 0] = value.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
}

function getBlockGridStyle(block: ScheduleBlock, slotMinutes: number) {
  const start = parseTimeLabel(block.startsAt.slice(11, 16));
  const end = parseTimeLabel(block.endsAt.slice(11, 16));
  const rowStart = Math.max(1, Math.floor((start - DAY_GRID_START) / slotMinutes) + 1);
  const rowSpan = Math.max(
    1,
    Math.ceil((Math.max(end, start + slotMinutes) - start) / slotMinutes)
  );

  return {
    gridRow: `${rowStart} / span ${rowSpan}`
  };
}

const blockOrder = {
  availability: 0,
  block: 1,
  appointment: 2
} as const;

const toneClasses = {
  critical:
    "border-[rgba(178,74,58,0.2)] bg-[rgba(178,74,58,0.14)] text-[var(--color-danger)]",
  warning:
    "border-[rgba(198,122,69,0.2)] bg-[rgba(198,122,69,0.14)] text-[var(--color-accent)]",
  info: "border-[rgba(15,76,92,0.18)] bg-[rgba(15,76,92,0.12)] text-[var(--color-primary)]",
  success:
    "border-[rgba(63,107,97,0.2)] bg-[rgba(63,107,97,0.14)] text-[var(--color-success)]"
} as const;

const dotToneClasses = {
  critical: "bg-[var(--color-danger)]",
  warning: "bg-[var(--color-accent)]",
  info: "bg-[var(--color-primary)]",
  success: "bg-[var(--color-success)]"
} as const;
