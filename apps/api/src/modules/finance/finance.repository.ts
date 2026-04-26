// apps/api/src/modules/finance/finance.repository.ts
import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

import type { DrizzleClient } from "@/db/client";
import { DATABASE_CLIENT } from "@/common/tokens";
import { appointments, financeChargeEvents, financeCharges, patients } from "@/db/schema";

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------

export type ChargeRow = typeof financeCharges.$inferSelect;
export type ChargeEventRow = typeof financeChargeEvents.$inferSelect;

export type ChargeWithPatient = ChargeRow & {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string | null;
  appointmentStartTime: string | null;
};

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export type CreateChargeInput = {
  tenantId: string;
  patientId: string;
  appointmentId: string;
  code: string;
  amountCents: number;
  dueDate: string; // YYYY-MM-DD
  originType: string;
  exportReference: string;
};

export type UpdateChargeInput = {
  status?: string;
  paidAt?: string;
  paidAmountCents?: number;
  paymentNote?: string;
};

export type AddEventInput = {
  chargeId: string;
  eventType: string;
  actorId: string;
  description: string;
};

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

@Injectable()
export class FinanceRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  // ---------------------------------------------------------------------------
  // List all charges for a tenant with patient + appointment context
  // ---------------------------------------------------------------------------

  async listWithPatient(tenantId: string): Promise<ChargeWithPatient[]> {
    const rows = await this.db
      .select({
        id: financeCharges.id,
        tenantId: financeCharges.tenantId,
        patientId: financeCharges.patientId,
        appointmentId: financeCharges.appointmentId,
        code: financeCharges.code,
        amountCents: financeCharges.amountCents,
        dueDate: financeCharges.dueDate,
        status: financeCharges.status,
        originType: financeCharges.originType,
        paidAt: financeCharges.paidAt,
        paidAmountCents: financeCharges.paidAmountCents,
        paymentNote: financeCharges.paymentNote,
        exportReference: financeCharges.exportReference,
        createdAt: financeCharges.createdAt,
        updatedAt: financeCharges.updatedAt,
        patientName: patients.fullName,
        patientEmail: patients.email,
        patientPhone: patients.phone,
        appointmentDate: appointments.date,
        appointmentStartTime: appointments.startTime
      })
      .from(financeCharges)
      .innerJoin(patients, eq(financeCharges.patientId, patients.id))
      .leftJoin(
        appointments,
        and(
          eq(financeCharges.appointmentId, appointments.id),
          sql`${financeCharges.appointmentId} != ''`
        )
      )
      .where(eq(financeCharges.tenantId, tenantId))
      .orderBy(desc(financeCharges.createdAt));

    return rows as ChargeWithPatient[];
  }

  // ---------------------------------------------------------------------------
  // Find single charge by id
  // ---------------------------------------------------------------------------

  async findByIdWithPatient(
    tenantId: string,
    chargeId: string
  ): Promise<ChargeWithPatient | null> {
    const rows = await this.db
      .select({
        id: financeCharges.id,
        tenantId: financeCharges.tenantId,
        patientId: financeCharges.patientId,
        appointmentId: financeCharges.appointmentId,
        code: financeCharges.code,
        amountCents: financeCharges.amountCents,
        dueDate: financeCharges.dueDate,
        status: financeCharges.status,
        originType: financeCharges.originType,
        paidAt: financeCharges.paidAt,
        paidAmountCents: financeCharges.paidAmountCents,
        paymentNote: financeCharges.paymentNote,
        exportReference: financeCharges.exportReference,
        createdAt: financeCharges.createdAt,
        updatedAt: financeCharges.updatedAt,
        patientName: patients.fullName,
        patientEmail: patients.email,
        patientPhone: patients.phone,
        appointmentDate: appointments.date,
        appointmentStartTime: appointments.startTime
      })
      .from(financeCharges)
      .innerJoin(patients, eq(financeCharges.patientId, patients.id))
      .leftJoin(
        appointments,
        and(
          eq(financeCharges.appointmentId, appointments.id),
          sql`${financeCharges.appointmentId} != ''`
        )
      )
      .where(and(eq(financeCharges.id, chargeId), eq(financeCharges.tenantId, tenantId)))
      .limit(1);

    return (rows[0] as ChargeWithPatient) ?? null;
  }

  // ---------------------------------------------------------------------------
  // Events — batch fetch for multiple charges
  // ---------------------------------------------------------------------------

  async listEventsForCharges(chargeIds: string[]): Promise<ChargeEventRow[]> {
    if (chargeIds.length === 0) return [];

    return this.db
      .select()
      .from(financeChargeEvents)
      .where(inArray(financeChargeEvents.chargeId, chargeIds))
      .orderBy(desc(financeChargeEvents.occurredAt));
  }

  // ---------------------------------------------------------------------------
  // Events — for a single charge (detail view)
  // ---------------------------------------------------------------------------

  async listEvents(chargeId: string): Promise<ChargeEventRow[]> {
    return this.db
      .select()
      .from(financeChargeEvents)
      .where(eq(financeChargeEvents.chargeId, chargeId))
      .orderBy(desc(financeChargeEvents.occurredAt));
  }

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  async create(input: CreateChargeInput): Promise<ChargeRow> {
    const id = randomUUID();

    const [row] = await this.db
      .insert(financeCharges)
      .values({
        id,
        tenantId: input.tenantId,
        patientId: input.patientId,
        appointmentId: input.appointmentId,
        code: input.code,
        amountCents: input.amountCents,
        dueDate: input.dueDate,
        status: "pending",
        originType: input.originType,
        exportReference: input.exportReference
      })
      .returning();

    return row!;
  }

  // ---------------------------------------------------------------------------
  // Update status
  // ---------------------------------------------------------------------------

  async updateStatus(chargeId: string, data: UpdateChargeInput): Promise<void> {
    await this.db
      .update(financeCharges)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(financeCharges.id, chargeId));
  }

  // ---------------------------------------------------------------------------
  // Add event
  // ---------------------------------------------------------------------------

  async addEvent(input: AddEventInput): Promise<void> {
    await this.db.insert(financeChargeEvents).values({
      id: randomUUID(),
      chargeId: input.chargeId,
      eventType: input.eventType,
      actorId: input.actorId,
      description: input.description
    });
  }

  // ---------------------------------------------------------------------------
  // Patient options for filter UI
  // ---------------------------------------------------------------------------

  async listDistinctPatients(
    tenantId: string
  ): Promise<{ value: string; label: string }[]> {
    const rows = await this.db
      .selectDistinctOn([financeCharges.patientId], {
        value: financeCharges.patientId,
        label: patients.fullName
      })
      .from(financeCharges)
      .innerJoin(patients, eq(financeCharges.patientId, patients.id))
      .where(eq(financeCharges.tenantId, tenantId));

    return rows;
  }

  // ---------------------------------------------------------------------------
  // Appointment options for charge creation UI (recent completed appointments)
  // ---------------------------------------------------------------------------

  async listLinkableAppointments(
    tenantId: string
  ): Promise<{ value: string; label: string; patientId: string }[]> {
    const rows = await this.db
      .select({
        value: appointments.id,
        label: sql<string>`${patients.fullName} || ' · ' || ${appointments.date} || ' · ' || left(${appointments.startTime}, 5)`,
        patientId: appointments.patientId
      })
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientId, patients.id))
      .where(
        and(
          eq(appointments.tenantId, tenantId),
          inArray(appointments.status, ["completed", "scheduled"])
        )
      )
      .orderBy(desc(appointments.date))
      .limit(20);

    return rows;
  }

  // ---------------------------------------------------------------------------
  // Count charges for code generation (e.g. CHG-2026-XXX)
  // ---------------------------------------------------------------------------

  async countForTenant(tenantId: string): Promise<number> {
    const [row] = await this.db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(financeCharges)
      .where(eq(financeCharges.tenantId, tenantId));

    return row?.count ?? 0;
  }
}
