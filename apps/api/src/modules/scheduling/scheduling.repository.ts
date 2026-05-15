import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";

import type { DrizzleClient } from "@/db/client";
import { DATABASE_CLIENT } from "@/common/tokens";
import {
  appointments,
  availabilityRules,
  availabilityWindows,
  patients,
  scheduleBlocks,
  schedulingTokens,
  therapistPolicies,
  therapists
} from "@/db/schema";

export type SchedulingTokenRow = typeof schedulingTokens.$inferSelect;

export type AvailabilityRuleWithWindows = {
  weekday: number;
  enabled: boolean;
  windows: Array<{ startTime: string; endTime: string }>;
};

export type ActivePatientRow = {
  id: string;
  fullName: string;
  phone: string;
  tenantId: string;
};

export type AppointmentSlim = {
  date: string;
  startTime: string;
  durationMinutes: number;
};

export type BlockSlim = {
  date: string;
  startTime: string;
  endTime: string;
};

export type TokenWithPatient = SchedulingTokenRow & {
  patientName: string;
  phone: string;
};

@Injectable()
export class SchedulingRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  async getActivePatients(therapistId: string): Promise<ActivePatientRow[]> {
    return this.db
      .select({
        id: patients.id,
        fullName: patients.fullName,
        phone: patients.phone,
        tenantId: patients.tenantId
      })
      .from(patients)
      .where(and(eq(patients.therapistId, therapistId), eq(patients.status, "active")))
      .orderBy(patients.fullName);
  }

  async getOrCreateToken(input: {
    tenantId: string;
    therapistId: string;
    patientId: string;
    weekStart: string;
    weekEnd: string;
    expiresAt: Date;
  }): Promise<SchedulingTokenRow> {
    const existing = await this.db
      .select()
      .from(schedulingTokens)
      .where(
        and(
          eq(schedulingTokens.therapistId, input.therapistId),
          eq(schedulingTokens.patientId, input.patientId),
          eq(schedulingTokens.weekStart, input.weekStart)
        )
      )
      .limit(1);

    if (existing[0]) return existing[0];

    const token = randomUUID().replace(/-/g, "").slice(0, 20);
    const [created] = await this.db
      .insert(schedulingTokens)
      .values({
        id: randomUUID(),
        tenantId: input.tenantId,
        therapistId: input.therapistId,
        patientId: input.patientId,
        token,
        weekStart: input.weekStart,
        weekEnd: input.weekEnd,
        status: "pending",
        expiresAt: input.expiresAt
      })
      .returning();
    return created!;
  }

  async getWeekTokens(therapistId: string, weekStart: string): Promise<TokenWithPatient[]> {
    const rows = await this.db
      .select({
        id: schedulingTokens.id,
        tenantId: schedulingTokens.tenantId,
        therapistId: schedulingTokens.therapistId,
        patientId: schedulingTokens.patientId,
        token: schedulingTokens.token,
        weekStart: schedulingTokens.weekStart,
        weekEnd: schedulingTokens.weekEnd,
        status: schedulingTokens.status,
        appointmentId: schedulingTokens.appointmentId,
        expiresAt: schedulingTokens.expiresAt,
        usedAt: schedulingTokens.usedAt,
        createdAt: schedulingTokens.createdAt,
        updatedAt: schedulingTokens.updatedAt,
        patientName: patients.fullName,
        phone: patients.phone
      })
      .from(schedulingTokens)
      .innerJoin(patients, eq(schedulingTokens.patientId, patients.id))
      .where(
        and(
          eq(schedulingTokens.therapistId, therapistId),
          eq(schedulingTokens.weekStart, weekStart)
        )
      )
      .orderBy(patients.fullName);
    return rows;
  }

  async getTokenByValue(token: string): Promise<SchedulingTokenRow | null> {
    const [row] = await this.db
      .select()
      .from(schedulingTokens)
      .where(eq(schedulingTokens.token, token))
      .limit(1);
    return row ?? null;
  }

  async getAvailabilityRules(therapistId: string): Promise<AvailabilityRuleWithWindows[]> {
    const rules = await this.db
      .select()
      .from(availabilityRules)
      .where(eq(availabilityRules.therapistId, therapistId));

    if (rules.length === 0) return [];

    const ruleIds = rules.map((r) => r.id);
    const windows = await this.db
      .select()
      .from(availabilityWindows)
      .where(inArray(availabilityWindows.ruleId, ruleIds))
      .orderBy(availabilityWindows.startTime);

    return rules.map((rule) => ({
      weekday: rule.weekday,
      enabled: rule.enabled,
      windows: windows
        .filter((w) => w.ruleId === rule.id)
        .map((w) => ({ startTime: w.startTime, endTime: w.endTime }))
    }));
  }

  async getAppointmentsInRange(
    therapistId: string,
    weekStart: string,
    weekEnd: string
  ): Promise<AppointmentSlim[]> {
    return this.db
      .select({
        date: appointments.date,
        startTime: appointments.startTime,
        durationMinutes: appointments.durationMinutes
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.therapistId, therapistId),
          gte(appointments.date, weekStart),
          lte(appointments.date, weekEnd),
          sql`${appointments.status} IN ('scheduled', 'confirmed', 'in_progress')`
        )
      );
  }

  async getScheduleBlocksInRange(
    therapistId: string,
    weekStart: string,
    weekEnd: string
  ): Promise<BlockSlim[]> {
    return this.db
      .select({
        date: scheduleBlocks.date,
        startTime: scheduleBlocks.startTime,
        endTime: scheduleBlocks.endTime
      })
      .from(scheduleBlocks)
      .where(
        and(
          eq(scheduleBlocks.therapistId, therapistId),
          gte(scheduleBlocks.date, weekStart),
          lte(scheduleBlocks.date, weekEnd)
        )
      );
  }

  async getTherapistPolicies(
    therapistId: string
  ): Promise<{ sessionDurationMinutes: number; gapMinutes: number }> {
    const [row] = await this.db
      .select({
        sessionDurationMinutes: therapistPolicies.sessionDurationMinutes,
        gapMinutes: therapistPolicies.gapMinutes
      })
      .from(therapistPolicies)
      .where(eq(therapistPolicies.therapistId, therapistId))
      .limit(1);
    return row ?? { sessionDurationMinutes: 50, gapMinutes: 10 };
  }

  async getTherapistName(therapistId: string): Promise<string> {
    const [row] = await this.db
      .select({ fullName: therapists.fullName })
      .from(therapists)
      .where(eq(therapists.id, therapistId))
      .limit(1);
    return row?.fullName ?? "Terapeuta";
  }

  async getPatientFirstName(patientId: string): Promise<string> {
    const [row] = await this.db
      .select({ fullName: patients.fullName })
      .from(patients)
      .where(eq(patients.id, patientId))
      .limit(1);
    return row?.fullName.split(" ")[0] ?? "paciente";
  }

  async markTokenUsed(tokenId: string, appointmentId: string): Promise<void> {
    await this.db
      .update(schedulingTokens)
      .set({ status: "used", appointmentId, usedAt: new Date(), updatedAt: new Date() })
      .where(eq(schedulingTokens.id, tokenId));
  }

  async createAppointment(input: {
    id: string;
    tenantId: string;
    therapistId: string;
    patientId: string;
    date: string;
    startTime: string;
    durationMinutes: number;
    modality: string;
  }): Promise<void> {
    await this.db.insert(appointments).values({
      ...input,
      status: "confirmed",
      note: "",
      roomState: "not_provisioned"
    });
  }

  async getConflictingAppointments(
    therapistId: string,
    date: string
  ): Promise<AppointmentSlim[]> {
    return this.db
      .select({
        date: appointments.date,
        startTime: appointments.startTime,
        durationMinutes: appointments.durationMinutes
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.therapistId, therapistId),
          eq(appointments.date, date),
          sql`${appointments.status} IN ('scheduled', 'confirmed', 'in_progress')`
        )
      );
  }
}
