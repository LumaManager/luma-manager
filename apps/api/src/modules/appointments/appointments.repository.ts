// apps/api/src/modules/appointments/appointments.repository.ts
import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { and, eq, gte, lte, sql } from "drizzle-orm";

import type { DrizzleClient } from "@/db/client";
import { DATABASE_CLIENT } from "@/common/tokens";
import {
  appointments,
  availabilityRules,
  availabilityWindows,
  patients,
  scheduleBlocks
} from "@/db/schema";

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------

export type AppointmentRow = typeof appointments.$inferSelect;
export type ScheduleBlockRow = typeof scheduleBlocks.$inferSelect;
export type AvailabilityRuleRow = typeof availabilityRules.$inferSelect;
export type AvailabilityWindowRow = typeof availabilityWindows.$inferSelect;

export type AppointmentWithPatient = AppointmentRow & {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientBirthDate: string;
  patientPaymentOrigin: string;
};

export type AvailabilityRuleWithWindows = AvailabilityRuleRow & {
  windows: AvailabilityWindowRow[];
};

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export type CreateAppointmentInput = {
  tenantId: string;
  therapistId: string;
  patientId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  modality: string;
  note: string;
};

export type RescheduleInput = {
  date: string;
  startTime: string;
  durationMinutes: number;
  modality: string;
  note: string;
};

export type CreateScheduleBlockInput = {
  therapistId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  subtitle: string;
  tone: string;
};

export type UpsertAvailabilityRuleInput = {
  weekday: number;
  enabled: boolean;
  windows: { startTime: string; endTime: string }[];
};

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

@Injectable()
export class AppointmentsRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  // ---------------------------------------------------------------------------
  // Appointments — list
  // ---------------------------------------------------------------------------

  async listForRange(
    therapistId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<AppointmentWithPatient[]> {
    const rows = await this.db
      .select({
        // appointment fields
        id: appointments.id,
        tenantId: appointments.tenantId,
        therapistId: appointments.therapistId,
        patientId: appointments.patientId,
        date: appointments.date,
        startTime: appointments.startTime,
        durationMinutes: appointments.durationMinutes,
        modality: appointments.modality,
        status: appointments.status,
        note: appointments.note,
        roomState: appointments.roomState,
        roomUrl: appointments.roomUrl,
        roomProviderRef: appointments.roomProviderRef,
        transcriptJobId: appointments.transcriptJobId,
        bookedByPatient: appointments.bookedByPatient,
        cancelReason: appointments.cancelReason,
        cancelledAt: appointments.cancelledAt,
        startedAt: appointments.startedAt,
        endedAt: appointments.endedAt,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        // patient fields
        patientName: patients.fullName,
        patientEmail: patients.email,
        patientPhone: patients.phone,
        patientBirthDate: patients.birthDate,
        patientPaymentOrigin: patients.paymentOrigin
      })
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientId, patients.id))
      .where(
        and(
          eq(appointments.therapistId, therapistId),
          gte(appointments.date, dateFrom),
          lte(appointments.date, dateTo)
        )
      )
      .orderBy(appointments.date, appointments.startTime);

    return rows as AppointmentWithPatient[];
  }

  // ---------------------------------------------------------------------------
  // Appointments — find by id
  // ---------------------------------------------------------------------------

  async findById(
    therapistId: string,
    appointmentId: string
  ): Promise<AppointmentWithPatient | null> {
    const rows = await this.db
      .select({
        id: appointments.id,
        tenantId: appointments.tenantId,
        therapistId: appointments.therapistId,
        patientId: appointments.patientId,
        date: appointments.date,
        startTime: appointments.startTime,
        durationMinutes: appointments.durationMinutes,
        modality: appointments.modality,
        status: appointments.status,
        note: appointments.note,
        roomState: appointments.roomState,
        roomUrl: appointments.roomUrl,
        roomProviderRef: appointments.roomProviderRef,
        transcriptJobId: appointments.transcriptJobId,
        bookedByPatient: appointments.bookedByPatient,
        cancelReason: appointments.cancelReason,
        cancelledAt: appointments.cancelledAt,
        startedAt: appointments.startedAt,
        endedAt: appointments.endedAt,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        patientName: patients.fullName,
        patientEmail: patients.email,
        patientPhone: patients.phone,
        patientBirthDate: patients.birthDate,
        patientPaymentOrigin: patients.paymentOrigin
      })
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientId, patients.id))
      .where(
        and(
          eq(appointments.id, appointmentId),
          eq(appointments.therapistId, therapistId)
        )
      )
      .limit(1);

    return (rows[0] as AppointmentWithPatient) ?? null;
  }

  // ---------------------------------------------------------------------------
  // Appointments — create
  // ---------------------------------------------------------------------------

  async create(input: CreateAppointmentInput): Promise<AppointmentRow> {
    const [row] = await this.db
      .insert(appointments)
      .values({
        id: randomUUID(),
        tenantId: input.tenantId,
        therapistId: input.therapistId,
        patientId: input.patientId,
        date: input.date,
        startTime: input.startTime,
        durationMinutes: input.durationMinutes,
        modality: input.modality,
        note: input.note,
        status: "scheduled"
      })
      .returning();

    return row!;
  }

  // ---------------------------------------------------------------------------
  // Appointments — reschedule
  // ---------------------------------------------------------------------------

  async reschedule(appointmentId: string, input: RescheduleInput): Promise<void> {
    await this.db
      .update(appointments)
      .set({
        date: input.date,
        startTime: input.startTime,
        durationMinutes: input.durationMinutes,
        modality: input.modality,
        note: input.note,
        updatedAt: new Date()
      })
      .where(eq(appointments.id, appointmentId));
  }

  // ---------------------------------------------------------------------------
  // Appointments — status transitions
  // ---------------------------------------------------------------------------

  async cancel(appointmentId: string, reason: string): Promise<void> {
    await this.db
      .update(appointments)
      .set({
        status: "cancelled",
        cancelReason: reason,
        cancelledAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(appointments.id, appointmentId));
  }

  async checkIn(appointmentId: string): Promise<void> {
    await this.db
      .update(appointments)
      .set({ status: "in_progress", startedAt: new Date(), updatedAt: new Date() })
      .where(eq(appointments.id, appointmentId));
  }

  async endSession(appointmentId: string): Promise<void> {
    await this.db
      .update(appointments)
      .set({
        status: "completed",
        endedAt: new Date(),
        roomState: "closed",
        updatedAt: new Date()
      })
      .where(eq(appointments.id, appointmentId));
  }

  // ---------------------------------------------------------------------------
  // Schedule blocks
  // ---------------------------------------------------------------------------

  async listScheduleBlocks(
    therapistId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<ScheduleBlockRow[]> {
    return this.db
      .select()
      .from(scheduleBlocks)
      .where(
        and(
          eq(scheduleBlocks.therapistId, therapistId),
          gte(scheduleBlocks.date, dateFrom),
          lte(scheduleBlocks.date, dateTo)
        )
      )
      .orderBy(scheduleBlocks.date, scheduleBlocks.startTime);
  }

  async createScheduleBlock(input: CreateScheduleBlockInput): Promise<ScheduleBlockRow> {
    const [row] = await this.db
      .insert(scheduleBlocks)
      .values({
        id: randomUUID(),
        therapistId: input.therapistId,
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        title: input.title,
        subtitle: input.subtitle,
        tone: input.tone
      })
      .returning();

    return row!;
  }

  async updateScheduleBlock(
    blockId: string,
    input: Omit<CreateScheduleBlockInput, "therapistId">
  ): Promise<void> {
    await this.db
      .update(scheduleBlocks)
      .set({
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        title: input.title,
        subtitle: input.subtitle,
        tone: input.tone
      })
      .where(eq(scheduleBlocks.id, blockId));
  }

  async deleteScheduleBlock(blockId: string): Promise<void> {
    await this.db.delete(scheduleBlocks).where(eq(scheduleBlocks.id, blockId));
  }

  // ---------------------------------------------------------------------------
  // Availability rules
  // ---------------------------------------------------------------------------

  async getAvailabilityRules(therapistId: string): Promise<AvailabilityRuleWithWindows[]> {
    const rules = await this.db
      .select()
      .from(availabilityRules)
      .where(eq(availabilityRules.therapistId, therapistId))
      .orderBy(availabilityRules.weekday);

    if (rules.length === 0) return [];

    const ruleIds = rules.map((r) => r.id);
    const windows = await this.db
      .select()
      .from(availabilityWindows)
      .where(sql`${availabilityWindows.ruleId} = ANY(${sql.raw(`ARRAY[${ruleIds.map((id) => `'${id}'`).join(",")}]`)})`)
      .orderBy(availabilityWindows.startTime);

    return rules.map((rule) => ({
      ...rule,
      windows: windows.filter((w) => w.ruleId === rule.id)
    }));
  }

  async upsertAvailabilityRules(
    therapistId: string,
    rules: UpsertAvailabilityRuleInput[]
  ): Promise<void> {
    for (const rule of rules) {
      // Find or create the rule for this weekday
      const existing = await this.db
        .select()
        .from(availabilityRules)
        .where(
          and(
            eq(availabilityRules.therapistId, therapistId),
            eq(availabilityRules.weekday, rule.weekday)
          )
        )
        .limit(1);

      let ruleId: string;

      if (existing[0]) {
        ruleId = existing[0].id;
        await this.db
          .update(availabilityRules)
          .set({ enabled: rule.enabled, updatedAt: new Date() })
          .where(eq(availabilityRules.id, ruleId));
      } else {
        ruleId = randomUUID();
        await this.db.insert(availabilityRules).values({
          id: ruleId,
          therapistId,
          weekday: rule.weekday,
          enabled: rule.enabled
        });
      }

      // Replace windows for this rule
      await this.db.delete(availabilityWindows).where(eq(availabilityWindows.ruleId, ruleId));

      if (rule.windows.length > 0) {
        await this.db.insert(availabilityWindows).values(
          rule.windows.map((w) => ({
            id: randomUUID(),
            ruleId,
            startTime: w.startTime,
            endTime: w.endTime
          }))
        );
      }
    }
  }
}
