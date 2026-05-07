// apps/api/src/modules/appointments/appointments.service.ts
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type {
  AgendaAvailabilityUpdateRequest,
  AgendaResponse,
  AppointmentCancelRequest,
  AppointmentCall,
  AppointmentCreateRequest,
  AppointmentCreateResponse,
  AppointmentDetail,
  AppointmentRescheduleRequest,
  AuthSession,
  ScheduleBlockCreateRequest,
  ScheduleBlockCreateResponse,
  ScheduleBlockUpdateRequest
} from "@terapia/contracts";
import {
  agendaAvailabilityUpdateRequestSchema,
  appointmentCancelRequestSchema,
  appointmentCreateRequestSchema,
  appointmentRescheduleRequestSchema,
  scheduleBlockCreateRequestSchema,
  scheduleBlockUpdateRequestSchema
} from "@terapia/contracts";

import { buildMockAgenda, buildMockAppointmentDetail, buildMockCall, isMockEmail } from "@/modules/mock";
import type { AppointmentWithPatient, AvailabilityRuleWithWindows } from "./appointments.repository";
import { AppointmentsRepository } from "./appointments.repository";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
const MONTH_LABELS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"] as const;

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject(AppointmentsRepository) private readonly repo: AppointmentsRepository
  ) {}

  // ---------------------------------------------------------------------------
  // List agenda
  // ---------------------------------------------------------------------------

  async listAgenda(session: AuthSession, query: Record<string, string>): Promise<AgendaResponse> {
    if (isMockEmail(session.therapist.email)) return buildMockAgenda(query);

    const view = (query.view === "week" || query.view === "month" || query.view === "day") ? query.view : "week";
    const targetDate = query.date ?? this.today();
    const { dateFrom, dateTo, dayColumns } = this.buildRange(view, targetDate);

    const [appts, blocks, rules] = await Promise.all([
      this.repo.listForRange(session.therapist.id, dateFrom, dateTo),
      this.repo.listScheduleBlocks(session.therapist.id, dateFrom, dateTo),
      this.repo.getAvailabilityRules(session.therapist.id)
    ]);

    const statusFilter = this.coerceStatusFilter(query.status);
    const modalityFilter = this.coerceModalityFilter(query.modality);

    const filteredAppts = appts.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (modalityFilter !== "all" && a.modality !== modalityFilter) return false;
      return true;
    });

    const scheduleBlocks = [
      ...filteredAppts.map((a) => this.apptToBlock(a)),
      ...blocks.map((b) => ({
        id: b.id,
        type: "block" as const,
        title: b.title,
        subtitle: b.subtitle,
        startsAt: `${b.date}T${b.startTime}:00`,
        endsAt: `${b.date}T${b.endTime}:00`,
        dayKey: b.date,
        tone: b.tone as any,
        href: undefined
      }))
    ];

    return {
      accountStatus: session.accountStatus,
      currentView: view,
      visibleRangeLabel: this.rangeLabel(dateFrom, dateTo, view),
      dayColumns,
      timeSlots: this.buildTimeSlots(),
      availabilityRules: this.formatRules(rules),
      filters: {
        status: statusFilter,
        modality: modalityFilter
      },
      quickActions: [
        { id: "new_appt", label: "Nova sessão", href: "/app/agenda?action=new" },
        { id: "view_patients", label: "Ver pacientes", href: "/app/patients" }
      ],
      scheduleBlocks
    };
  }

  // ---------------------------------------------------------------------------
  // Create appointment
  // ---------------------------------------------------------------------------

  async createAppointment(
    session: AuthSession,
    input: AppointmentCreateRequest
  ): Promise<AppointmentCreateResponse> {
    if (isMockEmail(session.therapist.email)) {
      return { id: "appt_1032", href: "/app/appointments/appt_1032" };
    }
    const payload = appointmentCreateRequestSchema.parse(input);

    const created = await this.repo.create({
      tenantId: session.tenant.id,
      therapistId: session.therapist.id,
      patientId: payload.patientId,
      date: payload.date,
      startTime: payload.startTime,
      durationMinutes: payload.durationMinutes,
      modality: payload.modality,
      note: payload.note
    });

    return {
      id: created.id,
      href: `/app/appointments/${created.id}`
    };
  }

  // ---------------------------------------------------------------------------
  // Appointment detail
  // ---------------------------------------------------------------------------

  async getAppointmentDetail(session: AuthSession, appointmentId: string): Promise<AppointmentDetail> {
    if (isMockEmail(session.therapist.email)) {
      const mock = buildMockAppointmentDetail(appointmentId);
      if (mock) return mock;
      throw new NotFoundException("Sessão não encontrada.");
    }

    const a = await this.repo.findById(session.therapist.id, appointmentId);
    if (!a) throw new NotFoundException("Sessão não encontrada.");

    const endTime = this.addMinutes(a.startTime, a.durationMinutes);
    const dateLabel = this.formatDateLabel(a.date);
    const timeRange = `${a.startTime}–${endTime}`;

    return {
      id: a.id,
      patientId: a.patientId,
      patientName: a.patientName,
      patientHref: `/app/patients/${a.patientId}`,
      dateKey: a.date,
      startTime: a.startTime,
      endTime,
      dateLabel,
      timeRangeLabel: timeRange,
      durationLabel: `${a.durationMinutes} min`,
      modality: a.modality as any,
      modalityLabel: a.modality === "telehealth" ? "Teleatendimento" : "Presencial",
      status: a.status as any,
      statusLabel: this.statusLabel(a.status),
      roomStatusLabel: this.roomStatusLabel(a.roomState),
      roomState: a.roomState as any,
      canReschedule: ["scheduled", "confirmed"].includes(a.status),
      canCancel: ["scheduled", "confirmed", "in_progress"].includes(a.status),
      primaryAction: this.primaryAction(a),
      sessionData: [
        { label: "Data", value: dateLabel },
        { label: "Horário", value: timeRange },
        { label: "Duração", value: `${a.durationMinutes} min` },
        { label: "Modalidade", value: a.modality === "telehealth" ? "Teleatendimento" : "Presencial" },
        { label: "Status", value: this.statusLabel(a.status) }
      ],
      patientSummary: [
        { label: "Nome", value: a.patientName },
        { label: "Contato", value: [a.patientEmail, a.patientPhone].filter(Boolean).join(" · ") || "Sem contato" },
        { label: "Pagamento", value: a.patientPaymentOrigin === "private" ? "Particular" : "Convênio" }
      ],
      consentStates: [],
      paymentSummary: [],
      readinessChecklist: [
        {
          label: "Paciente cadastrado",
          state: "ok",
          description: "Cadastro ativo no sistema."
        }
      ],
      timeline: [
        {
          id: "created",
          title: "Sessão criada",
          occurredAtLabel: this.formatDateLabel(a.createdAt.toISOString().slice(0, 10)),
          description: "Agendamento registrado."
        },
        ...(a.cancelledAt ? [{
          id: "cancelled",
          title: "Sessão cancelada",
          occurredAtLabel: this.formatDateLabel(a.cancelledAt.toISOString().slice(0, 10)),
          description: a.cancelReason || "Sem motivo registrado."
        }] : [])
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Reschedule
  // ---------------------------------------------------------------------------

  async rescheduleAppointment(
    session: AuthSession,
    appointmentId: string,
    input: AppointmentRescheduleRequest
  ): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };
    const payload = appointmentRescheduleRequestSchema.parse(input);
    const a = await this.repo.findById(session.therapist.id, appointmentId);
    if (!a) throw new NotFoundException("Sessão não encontrada.");

    await this.repo.reschedule(appointmentId, payload);
    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  async cancelAppointment(
    session: AuthSession,
    appointmentId: string,
    input: AppointmentCancelRequest
  ): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };
    const payload = appointmentCancelRequestSchema.parse(input);
    const a = await this.repo.findById(session.therapist.id, appointmentId);
    if (!a) throw new NotFoundException("Sessão não encontrada.");

    await this.repo.cancel(appointmentId, payload.reason);
    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // Check-in / end session
  // ---------------------------------------------------------------------------

  async checkIn(session: AuthSession, appointmentId: string): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };
    const a = await this.repo.findById(session.therapist.id, appointmentId);
    if (!a) throw new NotFoundException("Sessão não encontrada.");
    await this.repo.checkIn(appointmentId);
    return { success: true };
  }

  async endSession(session: AuthSession, appointmentId: string): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };
    const a = await this.repo.findById(session.therapist.id, appointmentId);
    if (!a) throw new NotFoundException("Sessão não encontrada.");
    await this.repo.endSession(appointmentId);
    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // Video call (stub — fora do escopo MVP)
  // ---------------------------------------------------------------------------

  async getAppointmentCall(session: AuthSession, appointmentId: string): Promise<AppointmentCall> {
    if (isMockEmail(session.therapist.email)) return buildMockCall(appointmentId);
    return {
      appointment: {
        id: appointmentId,
        patientName: "",
        dateLabel: "",
        timeRangeLabel: "",
        durationLabel: "",
        detailHref: `/app/appointments/${appointmentId}`
      },
      experienceState: "unavailable",
      experienceLabel: "Sala não disponível",
      roomSummary: {
        state: "not_provisioned",
        label: "Não provisionada",
        providerLabel: "—",
        joinUrlLabel: "—"
      },
      joinWindow: {
        therapistOpensAtLabel: "",
        patientOpensAtLabel: "",
        scheduledStartLabel: "",
        scheduledEndLabel: "",
        canJoinNow: false,
        blockedReason: "Teleatendimento fora do escopo MVP."
      },
      readiness: { outcome: "blocked", items: [] },
      transcript: {
        state: "disabled_by_policy",
        label: "Transcript desativado",
        description: "Funcionalidade fora do escopo MVP."
      },
      devices: {
        cameraPermission: "prompt",
        microphonePermission: "prompt",
        availableCameras: [],
        availableMicrophones: [],
        previewAvailable: false,
        microphoneLevel: 0
      },
      callPermissions: {
        canProvisionRoom: false,
        canCheckIn: false,
        canEndSession: false
      },
      connection: {
        state: "failed",
        label: "Sem conexão",
        description: "Sala não disponível neste plano."
      },
      participants: {
        therapistJoined: false,
        patientPresence: "absent",
        patientLabel: "Paciente"
      },
      sidePanel: [],
      notices: []
    };
  }

  async provisionRoom(_session: AuthSession, _appointmentId: string): Promise<{ success: boolean }> {
    return { success: false };
  }

  // ---------------------------------------------------------------------------
  // Availability
  // ---------------------------------------------------------------------------

  async updateAvailability(
    session: AuthSession,
    input: AgendaAvailabilityUpdateRequest
  ): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };
    const payload = agendaAvailabilityUpdateRequestSchema.parse(input);
    await this.repo.upsertAvailabilityRules(session.therapist.id, payload.rules);
    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // Schedule blocks CRUD
  // ---------------------------------------------------------------------------

  async createBlock(
    session: AuthSession,
    input: ScheduleBlockCreateRequest
  ): Promise<ScheduleBlockCreateResponse> {
    if (isMockEmail(session.therapist.email)) return { id: "block_mock_001" };
    const payload = scheduleBlockCreateRequestSchema.parse(input);
    const block = await this.repo.createScheduleBlock({
      therapistId: session.therapist.id,
      ...payload
    });
    return { id: block.id };
  }

  async updateBlock(
    session: AuthSession,
    blockId: string,
    input: ScheduleBlockUpdateRequest
  ): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };
    const payload = scheduleBlockUpdateRequestSchema.parse(input);
    await this.repo.updateScheduleBlock(blockId, payload);
    return { success: true };
  }

  async deleteBlock(session: AuthSession, blockId: string): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };
    await this.repo.deleteScheduleBlock(blockId);
    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // Helpers — date/time
  // ---------------------------------------------------------------------------

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private buildRange(view: string, targetDate: string) {
    const d = new Date(targetDate + "T12:00:00Z");
    const today = this.today();

    if (view === "week") {
      const dow = d.getUTCDay();
      const monday = new Date(d);
      monday.setUTCDate(d.getUTCDate() - ((dow + 6) % 7));
      const sunday = new Date(monday);
      sunday.setUTCDate(monday.getUTCDate() + 6);

      const dateFrom = monday.toISOString().slice(0, 10);
      const dateTo = sunday.toISOString().slice(0, 10);

      const dayColumns = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(monday);
        day.setUTCDate(monday.getUTCDate() + i);
        const key = day.toISOString().slice(0, 10);
        return {
          key,
          label: DAY_LABELS[day.getUTCDay()]!,
          dateLabel: `${DAY_LABELS[day.getUTCDay()]} ${day.getUTCDate()}`,
          isToday: key === today
        };
      });

      return { dateFrom, dateTo, dayColumns };
    }

    // day view
    return {
      dateFrom: targetDate,
      dateTo: targetDate,
      dayColumns: [{
        key: targetDate,
        label: DAY_LABELS[d.getUTCDay()]!,
        dateLabel: `${DAY_LABELS[d.getUTCDay()]} ${d.getUTCDate()}`,
        isToday: targetDate === today
      }]
    };
  }

  private buildTimeSlots(): string[] {
    const slots: string[] = [];
    for (let h = 6; h <= 22; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    return slots;
  }

  private rangeLabel(dateFrom: string, dateTo: string, view: string): string {
    if (view === "week") {
      const from = new Date(dateFrom + "T12:00:00Z");
      const to = new Date(dateTo + "T12:00:00Z");
      return `${from.getUTCDate()} – ${to.getUTCDate()} de ${MONTH_LABELS[to.getUTCMonth()]}, ${to.getUTCFullYear()}`;
    }
    const d = new Date(dateFrom + "T12:00:00Z");
    return `${d.getUTCDate()} de ${MONTH_LABELS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
  }

  private formatRules(rules: AvailabilityRuleWithWindows[]) {
    return Array.from({ length: 7 }, (_, weekday) => {
      const rule = rules.find((r) => r.weekday === weekday);
      return {
        weekday,
        weekdayLabel: DAY_LABELS[weekday]!,
        enabled: rule?.enabled ?? false,
        windows: (rule?.windows ?? []).map((w) => ({
          id: w.id,
          startTime: w.startTime,
          endTime: w.endTime
        }))
      };
    });
  }

  private apptToBlock(a: AppointmentWithPatient) {
    const endTime = this.addMinutes(a.startTime, a.durationMinutes);
    const tone = a.status === "cancelled" || a.status === "no_show" ? "warning"
      : a.status === "completed" ? "success"
      : a.status === "in_progress" ? "info"
      : "neutral";

    return {
      id: a.id,
      type: "appointment" as const,
      title: a.patientName,
      subtitle: `${a.startTime}–${endTime} · ${a.modality === "telehealth" ? "Teleatendimento" : "Presencial"}`,
      startsAt: `${a.date}T${a.startTime}:00`,
      endsAt: `${a.date}T${endTime}:00`,
      dayKey: a.date,
      tone: tone as any,
      href: `/app/appointments/${a.id}`
    };
  }

  private addMinutes(time: string, minutes: number): string {
    const [h, m] = time.split(":").map(Number);
    const total = (h ?? 0) * 60 + (m ?? 0) + minutes;
    return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }

  private formatDateLabel(date: string): string {
    const d = new Date(date + "T12:00:00Z");
    return `${d.getUTCDate()} de ${MONTH_LABELS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
  }

  private statusLabel(status: string): string {
    const map: Record<string, string> = {
      scheduled: "Agendada",
      confirmed: "Confirmada",
      in_progress: "Em andamento",
      completed: "Concluída",
      cancelled: "Cancelada",
      no_show: "Falta"
    };
    return map[status] ?? status;
  }

  private roomStatusLabel(roomState: string): string {
    const map: Record<string, string> = {
      not_provisioned: "Sala não criada",
      ready: "Sala pronta",
      open: "Sala aberta",
      closed: "Sala encerrada",
      failed: "Falha na sala"
    };
    return map[roomState] ?? roomState;
  }

  private primaryAction(a: AppointmentWithPatient) {
    if (a.status === "scheduled" || a.status === "confirmed") {
      return { label: "Iniciar sessão", href: `/app/appointments/${a.id}/call`, disabledReason: "" };
    }
    if (a.status === "in_progress") {
      return { label: "Entrar na sala", href: `/app/appointments/${a.id}/call`, disabledReason: "" };
    }
    return { label: "Ver detalhes", href: `/app/appointments/${a.id}`, disabledReason: "Sessão encerrada." };
  }

  private coerceStatusFilter(v?: string) {
    const valid = ["all", "scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"];
    return (valid.includes(v ?? "") ? v : "all") as AgendaResponse["filters"]["status"];
  }

  private coerceModalityFilter(v?: string) {
    const valid = ["all", "telehealth", "in_person"];
    return (valid.includes(v ?? "") ? v : "all") as AgendaResponse["filters"]["modality"];
  }
}
