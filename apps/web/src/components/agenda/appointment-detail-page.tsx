"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import type {
  AppointmentCancelRequest,
  AppointmentDetail,
  AppointmentRescheduleRequest
} from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";
import {
  AlertTriangle,
  Ban,
  CalendarClock,
  CalendarRange,
  ChevronRight,
  ClipboardCheck,
  DoorOpen,
  ShieldCheck,
  Wallet,
  X
} from "lucide-react";

import { OperationalHero } from "@/components/shared/operational-surface";

type AppointmentDetailPageProps = {
  appointment: AppointmentDetail;
};

export function AppointmentDetailPageView({ appointment }: AppointmentDetailPageProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<"cancel" | "reschedule" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [rescheduleForm, setRescheduleForm] = useState<AppointmentRescheduleRequest>({
    date: appointment.dateKey,
    startTime: appointment.startTime,
    durationMinutes: Number.parseInt(appointment.durationLabel, 10) || 50,
    modality: appointment.modality,
    note:
      appointment.sessionData.find((item) => item.label === "Observação operacional")?.value ?? ""
  });
  const [cancelForm, setCancelForm] = useState<AppointmentCancelRequest>({
    reason: ""
  });

  function runMutation(
    action: "cancel" | "reschedule",
    body: AppointmentCancelRequest | AppointmentRescheduleRequest,
    successMessage: string
  ) {
    setFeedback(null);

    startTransition(async () => {
      const response = await fetch(`/api/appointments/${appointment.id}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setFeedback(payload?.message ?? "Não foi possível concluir a ação agora.");
        return;
      }

      setFeedback(successMessage);
      setActivePanel(null);
      router.refresh();
    });
  }

  return (
    <>
      <div className="space-y-6">
        <nav className="text-sm text-[var(--color-text-muted)]">
          <Link className="font-medium text-[var(--color-primary)]" href="/app/agenda">
            Agenda
          </Link>
          <span className="mx-2">/</span>
          <span>
            Sessão de {appointment.dateLabel} · {appointment.timeRangeLabel}
          </span>
        </nav>

        {feedback ? (
          <div className="rounded-[28px] border border-[rgba(15,76,92,0.14)] bg-[rgba(15,76,92,0.06)] px-5 py-4 text-sm font-medium text-[var(--color-primary)]">
            {feedback}
          </div>
        ) : null}

        <OperationalHero
          actions={
            <>
              <Button asChild>
                <Link href={appointment.primaryAction.href}>{appointment.primaryAction.label}</Link>
              </Button>
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
              <Button asChild variant="ghost">
                <Link href={appointment.patientHref}>
                  Abrir paciente
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          }
          badges={
            <>
              <Badge tone={appointment.roomState === "ready" || appointment.roomState === "open" ? "info" : "neutral"}>
                {appointment.roomStatusLabel}
              </Badge>
              <Badge tone={statusToneMap[appointment.statusLabel] ?? "info"}>{appointment.statusLabel}</Badge>
              <Badge tone="neutral">{appointment.modalityLabel}</Badge>
            </>
          }
          description={`${appointment.dateLabel} · ${appointment.durationLabel} · ${appointment.modalityLabel}`}
          stats={[
            {
              detail: appointment.primaryAction.disabledReason ?? "Próxima ação já liberada.",
              label: "Próxima decisão",
              tone: appointment.primaryAction.disabledReason ? "warning" : "info",
              value: appointment.primaryAction.label
            },
            {
              detail: "Janela operacional desta sessão.",
              label: "Janela",
              tone: "neutral",
              value: appointment.timeRangeLabel
            },
            {
              detail: "Estado atual da sala e do handoff.",
              label: "Execução",
              tone: appointment.roomState === "ready" || appointment.roomState === "open" ? "success" : "neutral",
              value: appointment.roomStatusLabel
            }
          ]}
          title={appointment.patientName}
        />

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryRibbon
            label="Próxima decisão"
            title={appointment.primaryAction.label}
            tone={appointment.primaryAction.disabledReason ? "warning" : "info"}
          />
          <SummaryRibbon label="Janela da sessão" title={appointment.dateLabel} tone="neutral" />
          <SummaryRibbon label="Execução" title={appointment.roomStatusLabel} tone="success" />
        </section>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <DetailCard
              description="Contexto mínimo do paciente sem forçar navegação."
              icon={<ShieldCheck className="h-4 w-4" />}
              items={appointment.patientSummary}
              linkItems={{
                Cadastro: {
                  href: appointment.patientHref,
                  label: "Abrir ficha do paciente"
                }
              }}
              title="Resumo do paciente"
            />
            <DetailCard
              description="Informação operacional consolidada desta sessão."
              icon={<CalendarRange className="h-4 w-4" />}
              items={appointment.sessionData}
              title="Dados da sessão"
            />
            <ConsentCard items={appointment.consentStates} />
            <DetailCard
              description="Visibilidade financeira resumida, sem transformar a tela em financeiro completo."
              icon={<Wallet className="h-4 w-4" />}
              items={appointment.paymentSummary}
              title="Pagamento resumido"
            />
          </div>

          <div className="space-y-4">
            <ChecklistCard items={appointment.readinessChecklist} />
            <VirtualRoomCard appointment={appointment} />
            <TimelineCard items={appointment.timeline} />
          </div>
        </div>
      </div>

      {activePanel === "reschedule" ? (
        <ActionPanel
          title="Reagendar sessão"
          subtitle="Ajuste data, hora e modalidade sem sair do detalhe. O backend continua validando conflito e estado operacional."
          onClose={() => setActivePanel(null)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Data"
              value={rescheduleForm.date}
              onChange={(value) => setRescheduleForm((current) => ({ ...current, date: value }))}
              type="date"
            />
            <Field
              label="Hora de início"
              value={rescheduleForm.startTime}
              onChange={(value) => setRescheduleForm((current) => ({ ...current, startTime: value }))}
              type="time"
            />
            <NumericField
              label="Duração (min)"
              value={rescheduleForm.durationMinutes}
              onChange={(value) =>
                setRescheduleForm((current) => ({ ...current, durationMinutes: value }))
              }
            />
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
              className="min-h-[120px] w-full rounded-[24px] border border-[var(--color-border-strong)] bg-white px-4 py-3 outline-none"
              onChange={(event) =>
                setRescheduleForm((current) => ({ ...current, note: event.target.value }))
              }
              value={rescheduleForm.note}
            />
          </label>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
            <Button onClick={() => setActivePanel(null)} type="button" variant="ghost">
              Fechar
            </Button>
            <Button
              disabled={isPending}
              onClick={() =>
                runMutation("reschedule", rescheduleForm, "Sessão reagendada com sucesso.")
              }
              type="button"
            >
              Salvar reagendamento
            </Button>
          </div>
        </ActionPanel>
      ) : null}

      {activePanel === "cancel" ? (
        <ActionPanel
          title="Cancelar sessão"
          subtitle="O cancelamento preserva histórico e fecha a janela operacional desta sessão."
          onClose={() => setActivePanel(null)}
        >
          <div className="rounded-[24px] border border-[rgba(178,74,58,0.18)] bg-[rgba(178,74,58,0.08)] p-4 text-sm leading-6 text-[var(--color-danger)]">
            Use esta ação quando a sessão realmente não deve mais acontecer no horário atual.
          </div>

          <label className="mt-4 block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Motivo do cancelamento
            </span>
            <textarea
              className="min-h-[132px] w-full rounded-[24px] border border-[var(--color-border-strong)] bg-white px-4 py-3 outline-none"
              onChange={(event) =>
                setCancelForm({
                  reason: event.target.value
                })
              }
              placeholder="Ex.: paciente pediu cancelamento antes da janela, remarcação será feita depois."
              value={cancelForm.reason}
            />
          </label>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
            <Button onClick={() => setActivePanel(null)} type="button" variant="ghost">
              Voltar
            </Button>
            <Button
              disabled={isPending || cancelForm.reason.trim().length < 3}
              onClick={() => runMutation("cancel", cancelForm, "Sessão cancelada com sucesso.")}
              type="button"
              variant="secondary"
            >
              Confirmar cancelamento
            </Button>
          </div>
        </ActionPanel>
      ) : null}
    </>
  );
}

function SummaryRibbon({
  label,
  title,
  tone
}: {
  label: string;
  title: string;
  tone: "info" | "neutral" | "success" | "warning";
}) {
  const toneMap = {
    info: "bg-[rgba(15,76,92,0.05)] text-[var(--color-primary)]",
    neutral: "bg-[rgba(31,41,51,0.04)] text-[var(--color-text)]",
    success: "bg-[rgba(63,107,97,0.08)] text-[var(--color-success)]",
    warning: "bg-[rgba(198,122,69,0.10)] text-[var(--color-accent)]"
  } as const;

  return (
    <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-panel)]">
      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${toneMap[tone]}`}>
        {label}
      </span>
      <p className="mt-4 text-lg font-semibold text-[var(--color-text)]">{title}</p>
    </div>
  );
}

function DetailCard({
  description,
  icon,
  items,
  linkItems,
  title
}: {
  description: string;
  icon: ReactNode;
  items: Array<{ label: string; value: string }>;
  linkItems?: Record<string, { href: string; label: string }>;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-lg font-semibold">{title}</p>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item) => {
          const linkItem = linkItems?.[item.label];

          return (
          <div
            className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4"
            key={`${title}-${item.label}`}
          >
            <p className="text-sm font-semibold">{item.label}</p>
            {linkItem ? (
              <Link
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition hover:opacity-80"
                href={linkItem.href}
              >
                {linkItem.label}
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{item.value}</p>
            )}
          </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ConsentCard({
  items
}: {
  items: AppointmentDetail["consentStates"];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-lg font-semibold">Consentimentos e documentos</p>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          Apenas o que impacta a realização segura da sessão aparece aqui.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4" key={item.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{item.label}</p>
              <Badge tone={consentToneMap[item.state]}>{consentLabelMap[item.state]}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{item.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ChecklistCard({
  items
}: {
  items: AppointmentDetail["readinessChecklist"];
}) {
  const overallState = items.some((item) => item.state === "blocked")
    ? "Bloqueado"
    : items.some((item) => item.state === "attention")
      ? "Atenção necessária"
      : "Pronto para iniciar";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4" />
          <p className="text-lg font-semibold">Checklist pré-sessão</p>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">{overallState}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4" key={item.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{item.label}</p>
              <Badge tone={checklistToneMap[item.state]}>{checklistLabelMap[item.state]}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{item.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function VirtualRoomCard({ appointment }: { appointment: AppointmentDetail }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DoorOpen className="h-4 w-4" />
          <p className="text-lg font-semibold">Sala virtual</p>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          A videochamada não fica embutida aqui. O detalhe controla prontidão e encaminhamento.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
          <p className="text-sm font-semibold">Estado atual</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{appointment.roomStatusLabel}</p>
        </div>
        <Button asChild className="w-full">
          <Link href={appointment.primaryAction.href}>{appointment.primaryAction.label}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function TimelineCard({
  items
}: {
  items: AppointmentDetail["timeline"];
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-lg font-semibold">Timeline resumida</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Eventos operacionais que ajudam a explicar o estado atual da sessão.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4" key={item.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{item.title}</p>
              <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                {item.occurredAtLabel}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{item.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ActionPanel({
  children,
  onClose,
  subtitle,
  title
}: {
  children: ReactNode;
  onClose: () => void;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(19,29,33,0.34)] p-4 backdrop-blur-[2px]">
      <div className="flex h-full w-full max-w-xl flex-col overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-contrast)] shadow-[0_30px_80px_rgba(15,76,92,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-6">
          <div>
            <Badge tone="info">Ação operacional</Badge>
            <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{subtitle}</p>
          </div>
          <button
            className="rounded-2xl border border-[var(--color-border)] p-2 text-[var(--color-text-muted)]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
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

function NumericField({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </span>
      <input
        className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
        min={30}
        onChange={(event) => onChange(Number.parseInt(event.target.value || "0", 10))}
        step={10}
        type="number"
        value={value}
      />
    </label>
  );
}

const statusToneMap: Record<string, "warning" | "info" | "success" | "critical"> = {
  Agendada: "success",
  Confirmada: "info",
  "Em andamento": "info",
  Concluída: "success",
  Cancelada: "critical",
  "No-show": "warning"
};

const consentToneMap = {
  ok: "success",
  pending: "warning",
  critical: "critical"
} as const;

const consentLabelMap = {
  ok: "OK",
  pending: "Pendente",
  critical: "Crítico"
} as const;

const checklistToneMap = {
  ok: "success",
  attention: "warning",
  blocked: "critical"
} as const;

const checklistLabelMap = {
  ok: "OK",
  attention: "Atenção",
  blocked: "Bloqueado"
} as const;
