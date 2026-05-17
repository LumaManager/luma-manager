import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import type {
  AuthSession,
  BookSlotRequest,
  BookSlotResponse,
  GenerateWeekTokensResponse,
  PublicSchedulingResponse,
  SchedulingSlot,
  SchedulingTokenItem
} from "@terapia/contracts";

import type { AppointmentSlim, AvailabilityRuleWithWindows, BlockSlim, TokenWithPatient } from "./scheduling.repository";
import { SchedulingRepository } from "./scheduling.repository";

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h! * 60 + m!;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function timesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && aEnd > bStart;
}

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
const MONTH_LABELS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"] as const;
const MONTH_LABELS_LONG = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"] as const;
const DAY_LABELS_LONG = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"] as const;

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return `${DAY_LABELS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTH_LABELS_SHORT[d.getUTCMonth()]}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildWeekLabel(weekStart: string, weekEnd: string): string {
  const start = new Date(weekStart + "T12:00:00Z");
  const end = new Date(weekEnd + "T12:00:00Z");
  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${start.getUTCDate()}–${end.getUTCDate()} de ${MONTH_LABELS_SHORT[start.getUTCMonth()]}`;
  }
  return `${start.getUTCDate()} ${MONTH_LABELS_SHORT[start.getUTCMonth()]} – ${end.getUTCDate()} ${MONTH_LABELS_SHORT[end.getUTCMonth()]}`;
}

function formatConfirmedAt(date: string, startTime: string): string {
  const d = new Date(date + "T12:00:00Z");
  return `${DAY_LABELS_LONG[d.getUTCDay()]}, ${d.getUTCDate()} de ${MONTH_LABELS_LONG[d.getUTCMonth()]} às ${startTime}`;
}

function normalizePhone(phone: string): string {
  const hasPlus = phone.trimStart().startsWith("+");
  const digits = phone.replace(/\D/g, "");
  if (hasPlus) return digits; // country code already present
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function buildWhatsappUrl(phone: string, firstName: string, weekLabel: string, bookingUrl: string): string {
  const number = normalizePhone(phone);
  const text = encodeURIComponent(
    `Oi ${firstName}, segue o link para você escolher seu horário da semana de ${weekLabel}: ${bookingUrl}`
  );
  return `https://wa.me/${number}?text=${text}`;
}

// ---------------------------------------------------------------------------
// Slot computation
// ---------------------------------------------------------------------------

function computeSlots(
  weekStart: string,
  weekEnd: string,
  rules: AvailabilityRuleWithWindows[],
  appts: AppointmentSlim[],
  blocks: BlockSlim[],
  sessionDuration: number,
  gapMinutes: number
): SchedulingSlot[] {
  const slots: SchedulingSlot[] = [];
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  let current = weekStart;
  while (current <= weekEnd) {
    const weekday = new Date(current + "T12:00:00Z").getUTCDay();
    const rule = rules.find((r) => r.weekday === weekday);

    if (rule?.enabled) {
      const dayAppts = appts.filter((a) => a.date === current);
      const dayBlocks = blocks.filter((b) => b.date === current);

      for (const window of rule.windows) {
        const windowStart = timeToMinutes(window.startTime);
        const windowEnd = timeToMinutes(window.endTime);
        let slotStart = windowStart;

        while (slotStart + sessionDuration <= windowEnd) {
          const slotEnd = slotStart + sessionDuration;

          if (current === todayStr && slotStart <= nowMinutes) {
            slotStart += sessionDuration;
            continue;
          }

          const apptConflict = dayAppts.some((a) => {
            const aStart = timeToMinutes(a.startTime);
            const aEnd = aStart + a.durationMinutes + gapMinutes;
            return timesOverlap(aStart, aEnd, slotStart, slotEnd);
          });

          const blockConflict = dayBlocks.some((b) => {
            return timesOverlap(timeToMinutes(b.startTime), timeToMinutes(b.endTime), slotStart, slotEnd);
          });

          if (!apptConflict && !blockConflict) {
            slots.push({
              date: current,
              dayLabel: formatDayLabel(current),
              startTime: minutesToTime(slotStart),
              endTime: minutesToTime(slotEnd)
            });
          }

          slotStart += sessionDuration;
        }
      }
    }

    current = addDays(current, 1);
  }

  return slots;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

const BASE_URL = process.env.APP_PUBLIC_URL ?? "https://lumamanager.com.br";

@Injectable()
export class SchedulingService {
  constructor(
    @Inject(SchedulingRepository) private readonly repo: SchedulingRepository
  ) {}

  async generateWeekTokens(session: AuthSession, weekStart: string): Promise<GenerateWeekTokensResponse> {
    const therapistId = session.therapist.id;
    const weekEnd = addDays(weekStart, 6);
    const expiresAt = new Date(weekEnd + "T23:59:59Z");
    const weekLabel = buildWeekLabel(weekStart, weekEnd);

    const [activePatients, therapistName] = await Promise.all([
      this.repo.getActivePatients(therapistId),
      this.repo.getTherapistName(therapistId)
    ]);

    const tokens: SchedulingTokenItem[] = await Promise.all(
      activePatients.map(async (patient) => {
        const tokenRow = await this.repo.getOrCreateToken({
          tenantId: patient.tenantId,
          therapistId,
          patientId: patient.id,
          weekStart,
          weekEnd,
          expiresAt
        });

        const bookingUrl = `${BASE_URL}/agendar/${tokenRow.token}`;
        const firstName = patient.fullName.split(" ")[0]!;

        return {
          patientId: patient.id,
          patientName: patient.fullName,
          phone: patient.phone,
          token: tokenRow.token,
          bookingUrl,
          whatsappUrl: buildWhatsappUrl(patient.phone, firstName, weekLabel, bookingUrl),
          status: tokenRow.status as "pending" | "used" | "expired"
        };
      })
    );

    void therapistName; // used for future email/notification features
    return { weekStart, weekEnd, tokens };
  }

  async getWeekTokens(session: AuthSession, weekStart: string): Promise<GenerateWeekTokensResponse> {
    const therapistId = session.therapist.id;
    const weekEnd = addDays(weekStart, 6);
    const weekLabel = buildWeekLabel(weekStart, weekEnd);

    const rows: TokenWithPatient[] = await this.repo.getWeekTokens(therapistId, weekStart);

    const tokens: SchedulingTokenItem[] = rows.map((row) => {
      const bookingUrl = `${BASE_URL}/agendar/${row.token}`;
      const firstName = row.patientName.split(" ")[0]!;
      return {
        patientId: row.patientId,
        patientName: row.patientName,
        phone: row.phone,
        token: row.token,
        bookingUrl,
        whatsappUrl: buildWhatsappUrl(row.phone, firstName, weekLabel, bookingUrl),
        status: row.status as "pending" | "used" | "expired"
      };
    });

    return { weekStart, weekEnd, tokens };
  }

  async getPublicSchedulingPage(token: string): Promise<PublicSchedulingResponse> {
    const tokenRow = await this.repo.getTokenByValue(token);
    if (!tokenRow) return { state: "not_found" };
    if (tokenRow.status === "used") return { state: "used" };
    if (tokenRow.status === "expired" || new Date() > tokenRow.expiresAt) return { state: "expired" };

    const [rules, appts, blocks, policies, therapistName, patientFirstName] = await Promise.all([
      this.repo.getAvailabilityRules(tokenRow.therapistId),
      this.repo.getAppointmentsInRange(tokenRow.therapistId, tokenRow.weekStart, tokenRow.weekEnd),
      this.repo.getScheduleBlocksInRange(tokenRow.therapistId, tokenRow.weekStart, tokenRow.weekEnd),
      this.repo.getTherapistPolicies(tokenRow.therapistId),
      this.repo.getTherapistName(tokenRow.therapistId),
      this.repo.getPatientFirstName(tokenRow.patientId)
    ]);

    const slots = computeSlots(
      tokenRow.weekStart,
      tokenRow.weekEnd,
      rules,
      appts,
      blocks,
      policies.sessionDurationMinutes,
      policies.gapMinutes
    );

    return {
      state: "available",
      data: {
        therapistName,
        patientFirstName,
        weekStart: tokenRow.weekStart,
        weekEnd: tokenRow.weekEnd,
        weekLabel: buildWeekLabel(tokenRow.weekStart, tokenRow.weekEnd),
        slots
      }
    };
  }

  async bookSlot(token: string, input: BookSlotRequest): Promise<BookSlotResponse> {
    const tokenRow = await this.repo.getTokenByValue(token);
    if (!tokenRow || tokenRow.status !== "pending" || new Date() > tokenRow.expiresAt) {
      return { success: false, error: "token_invalid", message: "Este link não está mais disponível." };
    }

    const [existingAppts, policies] = await Promise.all([
      this.repo.getConflictingAppointments(tokenRow.therapistId, input.date),
      this.repo.getTherapistPolicies(tokenRow.therapistId)
    ]);

    const slotStart = timeToMinutes(input.startTime);
    const slotEnd = slotStart + policies.sessionDurationMinutes;

    const conflict = existingAppts.some((a) => {
      const aStart = timeToMinutes(a.startTime);
      return timesOverlap(aStart, aStart + a.durationMinutes, slotStart, slotEnd);
    });

    if (conflict) {
      return { success: false, error: "slot_taken", message: "Este horário acabou de ser reservado. Por favor, escolha outro." };
    }

    const appointmentId = randomUUID();
    await this.repo.createAppointment({
      id: appointmentId,
      tenantId: tokenRow.tenantId,
      therapistId: tokenRow.therapistId,
      patientId: tokenRow.patientId,
      date: input.date,
      startTime: input.startTime,
      durationMinutes: policies.sessionDurationMinutes,
      modality: "in_person"
    });

    await this.repo.markTokenUsed(tokenRow.id, appointmentId);

    const [therapistName] = await Promise.all([this.repo.getTherapistName(tokenRow.therapistId)]);

    return { success: true, confirmedAt: formatConfirmedAt(input.date, input.startTime), therapistName };
  }
}
