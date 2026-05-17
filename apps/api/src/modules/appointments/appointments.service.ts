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
  RecordingConsentSendResponse,
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

import { randomUUID } from "node:crypto";

import { readEnv } from "@/common/config/env";
import { ConsentRepository } from "@/modules/consent/consent.repository";
import { buildMockAgenda, buildMockAppointmentDetail, buildMockCall, isMockEmail } from "@/modules/mock";
import type { AppointmentWithPatient, AvailabilityRuleWithWindows } from "./appointments.repository";
import { AppointmentsRepository } from "./appointments.repository";
import { DailyClient } from "./daily.client";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
const MONTH_LABELS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"] as const;

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject(AppointmentsRepository) private readonly repo: AppointmentsRepository,
    @Inject(DailyClient) private readonly dailyClient: DailyClient,
    @Inject(ConsentRepository) private readonly consentRepo: ConsentRepository
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

    const consentDoc = await this.consentRepo.findByPatientAndTherapist(a.patientId, a.therapistId);
    const env = readEnv();
    const recordingConsentStatus = (consentDoc?.status ?? "not_sent") as "not_sent" | "pending" | "signed" | "expired";
    const recordingConsentLink = consentDoc ? `${env.APP_PUBLIC_URL}/consentimento/${consentDoc.token}` : "";

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
      paymentContext: { model: "per_session", chargeLinked: false, note: "Nenhuma cobrança vinculada a esta sessão ainda." },
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
      ],
      patientPhone: a.patientPhone,
      recordingConsentStatus,
      recordingConsentLink,
      transcriptStatus: (a.recordingStatus ?? "none") as "none" | "requested" | "processing" | "ready" | "failed",
      transcriptDraft: a.transcriptDraft ?? null,
      transcriptApprovedAt: a.transcriptApprovedAt?.toISOString() ?? null
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

    const a = await this.repo.findById(session.therapist.id, appointmentId);
    if (!a) throw new NotFoundException("Sessão não encontrada.");

    const consentDoc = await this.consentRepo.findByPatientAndTherapist(a.patientId, a.therapistId);
    const recordingConsented = consentDoc?.status === "signed";

    let hostToken = "";
    const roomUrl = a.roomUrl ?? "";

    if ((a.roomState === "ready" || a.roomState === "open") && roomUrl) {
      const roomName = `luma-${appointmentId}`;
      try {
        const tokenResult = await this.dailyClient.createMeetingToken(roomName, true);
        hostToken = tokenResult.token;
      } catch {
        hostToken = "";
      }
    }

    const canJoin = hostToken !== "";
    const endTime = this.addMinutes(a.startTime, a.durationMinutes);

    return {
      appointment: {
        id: a.id,
        patientName: a.patientName,
        dateLabel: this.formatDateLabel(a.date),
        timeRangeLabel: `${a.startTime}–${endTime}`,
        durationLabel: `${a.durationMinutes} min`,
        detailHref: `/app/appointments/${a.id}`
      },
      experienceState: canJoin ? "prejoin" : "unavailable",
      experienceLabel: canJoin ? "Pronto para entrar" : "Sala não disponível",
      roomSummary: {
        state: a.roomState as "not_provisioned" | "ready" | "open" | "closed" | "failed",
        label: this.roomStatusLabel(a.roomState),
        providerLabel: "Daily.co",
        joinUrlLabel: roomUrl ? "Sala criada" : "—"
      },
      joinWindow: {
        therapistOpensAtLabel: `${a.date} ${a.startTime}`,
        patientOpensAtLabel: `${a.date} ${a.startTime}`,
        scheduledStartLabel: `${a.date} ${a.startTime}`,
        scheduledEndLabel: `${a.date} ${endTime}`,
        canJoinNow: canJoin,
        blockedReason: canJoin ? "" : "Sala não provisionada ou não disponível."
      },
      readiness: {
        outcome: canJoin ? "ready" : "blocked",
        items: [
          {
            label: "Sala de vídeo",
            state: canJoin ? "ok" : "blocked",
            description: canJoin ? "Sala pronta para uso." : "Execute 'Provisionar sala' antes de entrar."
          },
          {
            label: "Consentimento de gravação",
            state: recordingConsented ? "ok" : "attention",
            description: recordingConsented
              ? "Paciente autorizou gravação da sessão."
              : "Paciente não autorizou gravação — sessão não será gravada."
          }
        ]
      },
      transcript: {
        state: recordingConsented ? "active" : "disabled_by_consent",
        label: recordingConsented ? "Transcrição ativa" : "Transcrição desativada",
        description: recordingConsented
          ? "Sessão será gravada e transcrita automaticamente ao encerrar."
          : "Envie o link de consentimento ao paciente para ativar gravação e transcrição."
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
        canProvisionRoom: a.roomState === "not_provisioned",
        canCheckIn: canJoin,
        canEndSession: a.status === "in_progress"
      },
      connection: {
        state: canJoin ? "ready" : "failed",
        label: canJoin ? "Pronto" : "Indisponível",
        description: canJoin ? "Sala disponível." : "Sala não disponível."
      },
      participants: {
        therapistJoined: false,
        patientPresence: "absent",
        patientLabel: a.patientName
      },
      sidePanel: [
        { label: "Paciente", value: a.patientName },
        { label: "Sessão", value: `${this.formatDateLabel(a.date)} · ${a.startTime}` }
      ],
      notices: [],
      hostToken,
      roomUrl,
      recordingConsented
    };
  }

  async provisionRoom(session: AuthSession, appointmentId: string): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };

    const a = await this.repo.findById(session.therapist.id, appointmentId);
    if (!a) throw new NotFoundException("Sessão não encontrada.");
    if (a.roomState !== "not_provisioned") return { success: true };

    const roomName = `luma-${appointmentId}`;
    const room = await this.dailyClient.createRoom(roomName);
    await this.repo.setRoom(appointmentId, room.url, room.name);
    return { success: true };
  }

  async sendRecordingConsent(
    session: AuthSession,
    appointmentId: string
  ): Promise<RecordingConsentSendResponse> {
    if (isMockEmail(session.therapist.email)) {
      return { consentId: "mock-consent-id", token: "mocktoken", expiresAt: new Date().toISOString() };
    }

    const a = await this.repo.findById(session.therapist.id, appointmentId);
    if (!a) throw new NotFoundException("Sessão não encontrada.");

    const env = readEnv();
    const token = randomUUID().replace(/-/g, "");
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const consentDoc = await this.consentRepo.create({
      patientId: a.patientId,
      therapistId: session.therapist.id,
      documentVersion: env.RECORDING_CONSENT_DOCUMENT_VERSION,
      token,
      tokenExpiresAt
    });

    await this.repo.setRecordingConsent(appointmentId, consentDoc.id);

    return {
      consentId: consentDoc.id,
      token: consentDoc.token,
      expiresAt: tokenExpiresAt.toISOString()
    };
  }

  async approveTranscript(
    session: AuthSession,
    appointmentId: string
  ): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };

    const a = await this.repo.findById(session.therapist.id, appointmentId);
    if (!a) throw new NotFoundException("Sessão não encontrada.");

    await this.repo.approveTranscript(appointmentId, session.therapist.id);
    return { success: true };
  }

  async startRecording(session: AuthSession, appointmentId: string): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };

    const a = await this.repo.findById(session.therapist.id, appointmentId);
    if (!a) throw new NotFoundException("Sessão não encontrada.");

    const roomName = `luma-${appointmentId}`;
    await this.dailyClient.startRecording(roomName);
    await this.repo.setRecordingDailyId(appointmentId, "");
    return { success: true };
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
          isToday: key === today,
          isCurrentMonth: true
        };
      });

      return { dateFrom, dateTo, dayColumns };
    }

    if (view === "month") {
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth();
      const firstOfMonth = new Date(Date.UTC(year, month, 1));
      const lastOfMonth = new Date(Date.UTC(year, month + 1, 0));

      // Start from Monday on or before the 1st
      const startDow = firstOfMonth.getUTCDay(); // 0=Sun,1=Mon,...
      const gridStart = new Date(firstOfMonth);
      gridStart.setUTCDate(firstOfMonth.getUTCDate() - ((startDow + 6) % 7));

      // End at Sunday on or after the last day
      const endDow = lastOfMonth.getUTCDay();
      const gridEnd = new Date(lastOfMonth);
      gridEnd.setUTCDate(lastOfMonth.getUTCDate() + ((7 - endDow) % 7));

      const dateFrom = gridStart.toISOString().slice(0, 10);
      const dateTo = gridEnd.toISOString().slice(0, 10);

      const dayColumns: Array<{ key: string; label: string; dateLabel: string; isToday: boolean; isCurrentMonth: boolean }> = [];
      const cur = new Date(gridStart);
      while (cur <= gridEnd) {
        const key = cur.toISOString().slice(0, 10);
        dayColumns.push({
          key,
          label: DAY_LABELS[cur.getUTCDay()]!,
          dateLabel: `${cur.getUTCDate()}`,
          isToday: key === today,
          isCurrentMonth: cur.getUTCMonth() === month
        });
        cur.setUTCDate(cur.getUTCDate() + 1);
      }

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
        isToday: targetDate === today,
        isCurrentMonth: true
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
    if (view === "month") {
      const d = new Date(dateFrom + "T12:00:00Z");
      const PT_MONTHS_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
      return `${PT_MONTHS_FULL[d.getUTCMonth()] ?? ""} de ${d.getUTCFullYear()}`;
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
