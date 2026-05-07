// apps/api/src/modules/patients/patients.repository.ts
import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";

import type { DrizzleClient } from "@/db/client";
import { DATABASE_CLIENT } from "@/common/tokens";
import {
  appointments,
  financeCharges,
  documents,
  patients,
  patientInvites
} from "@/db/schema";

export type PatientRow = typeof patients.$inferSelect;
export type PatientInsert = typeof patients.$inferInsert;

export type CreatePatientInput = {
  tenantId: string;
  therapistId: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  paymentOrigin: "private" | "insurance";
};

export type PatientListFiltersInput = {
  query: string;
  status: string;   // all | invited | active | inactive | archived
  documents: string; // all | ok | pending | critical
  financial: string; // all | ok | open | overdue
  upcomingOnly: boolean;
  legalGuardianOnly: boolean;
  page: number;
  pageSize: number;
};

export type PatientWithMeta = PatientRow & {
  nextSessionDate: string | null;
  nextSessionTime: string | null;
  openChargesCount: number;
  overdueChargesCount: number;
  openChargesCents: number;
  pendingDocumentsCount: number;
  criticalDocumentsCount: number;
  completedSessionsCount: number;
};

@Injectable()
export class PatientsRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  async list(
    therapistId: string,
    filters: PatientListFiltersInput
  ): Promise<{ items: PatientWithMeta[]; total: number }> {
    const conditions = [eq(patients.therapistId, therapistId)];

    if (filters.status !== "all") {
      conditions.push(eq(patients.status, filters.status));
    }

    if (filters.query) {
      conditions.push(
        or(
          ilike(patients.fullName, `%${filters.query}%`),
          ilike(patients.email, `%${filters.query}%`),
          ilike(patients.externalCode, `%${filters.query}%`)
        )!
      );
    }

    const where = and(...conditions);

    const [totalRow] = await this.db
      .select({ count: count() })
      .from(patients)
      .where(where);

    const total = Number(totalRow?.count ?? 0);

    const offset = (filters.page - 1) * filters.pageSize;

    const rows = await this.db
      .select()
      .from(patients)
      .where(where)
      .orderBy(desc(patients.createdAt))
      .limit(filters.pageSize)
      .offset(offset);

    // Enrich each patient with aggregated data
    const enriched = await Promise.all(rows.map((p) => this._enrich(p)));

    return { items: enriched, total };
  }

  // ---------------------------------------------------------------------------
  // Find by id (scoped to therapist for security)
  // ---------------------------------------------------------------------------

  async findById(therapistId: string, patientId: string): Promise<PatientWithMeta | null> {
    const rows = await this.db
      .select()
      .from(patients)
      .where(and(eq(patients.id, patientId), eq(patients.therapistId, therapistId)))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return this._enrich(row);
  }

  // ---------------------------------------------------------------------------
  // Find all active (for dropdowns)
  // ---------------------------------------------------------------------------

  async findAllActive(therapistId: string): Promise<PatientRow[]> {
    return this.db
      .select()
      .from(patients)
      .where(
        and(
          eq(patients.therapistId, therapistId),
          or(eq(patients.status, "active"), eq(patients.status, "invited"))!
        )
      )
      .orderBy(patients.fullName);
  }

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  async create(input: CreatePatientInput): Promise<PatientRow> {
    // Generate human-readable external code: P-XXXX
    const countRow = await this.db
      .select({ count: count() })
      .from(patients)
      .where(eq(patients.tenantId, input.tenantId));

    const nextIndex = Number(countRow[0]?.count ?? 0) + 1;
    const externalCode = `P-${String(nextIndex).padStart(4, "0")}`;

    const [created] = await this.db
      .insert(patients)
      .values({
        id: randomUUID(),
        tenantId: input.tenantId,
        therapistId: input.therapistId,
        externalCode,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        birthDate: input.birthDate,
        paymentOrigin: input.paymentOrigin,
        status: "invited"
      })
      .returning();

    return created!;
  }

  // ---------------------------------------------------------------------------
  // Update status
  // ---------------------------------------------------------------------------

  async updateStatus(patientId: string, status: string): Promise<void> {
    await this.db
      .update(patients)
      .set({ status, updatedAt: new Date() })
      .where(eq(patients.id, patientId));
  }

  // ---------------------------------------------------------------------------
  // Invite token
  // ---------------------------------------------------------------------------

  async createInviteToken(patientId: string, expiresInDays = 7): Promise<string> {
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await this.db.insert(patientInvites).values({
      id: randomUUID(),
      patientId,
      token,
      expiresAt
    });

    return token;
  }

  async findValidInvite(token: string) {
    const rows = await this.db
      .select()
      .from(patientInvites)
      .where(eq(patientInvites.token, token))
      .limit(1);

    const invite = rows[0];
    if (!invite) return null;
    if (invite.acceptedAt || invite.revokedAt) return null;
    if (invite.expiresAt < new Date()) return null;

    return invite;
  }

  // ---------------------------------------------------------------------------
  // Internal: enrich a patient row with aggregated relational data
  // ---------------------------------------------------------------------------

  private async _enrich(patient: PatientRow): Promise<PatientWithMeta> {
    // Next upcoming appointment
    const today = new Date().toISOString().slice(0, 10);

    const nextAppt = await this.db
      .select({
        date: appointments.date,
        startTime: appointments.startTime
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.patientId, patient.id),
          sql`${appointments.date} >= ${today}`,
          or(
            eq(appointments.status, "scheduled"),
            eq(appointments.status, "confirmed")
          )!
        )
      )
      .orderBy(appointments.date, appointments.startTime)
      .limit(1);

    // Finance aggregation
    const chargeRows = await this.db
      .select({
        status: financeCharges.status,
        amountCents: financeCharges.amountCents
      })
      .from(financeCharges)
      .where(
        and(
          eq(financeCharges.patientId, patient.id),
          or(
            eq(financeCharges.status, "pending"),
            eq(financeCharges.status, "overdue")
          )!
        )
      );

    const openChargesCount = chargeRows.length;
    const overdueChargesCount = chargeRows.filter((c) => c.status === "overdue").length;
    const openChargesCents = chargeRows.reduce((sum, c) => sum + c.amountCents, 0);

    // Document aggregation
    const docRows = await this.db
      .select({ criticality: documents.criticality })
      .from(documents)
      .where(
        and(
          eq(documents.patientId, patient.id),
          or(
            eq(documents.signatureStatus, "pending"),
            eq(documents.signatureStatus, "not_sent")
          )!
        )
      );

    const pendingDocumentsCount = docRows.length;
    const criticalDocumentsCount = docRows.filter((d) => d.criticality === "critical").length;

    // Completed sessions count
    const [completedRow] = await this.db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.patientId, patient.id),
          eq(appointments.status, "completed")
        )
      );

    const completedSessionsCount = Number(completedRow?.count ?? 0);

    return {
      ...patient,
      nextSessionDate: nextAppt[0]?.date ?? null,
      nextSessionTime: nextAppt[0]?.startTime ?? null,
      openChargesCount,
      overdueChargesCount,
      openChargesCents,
      pendingDocumentsCount,
      criticalDocumentsCount,
      completedSessionsCount
    };
  }
}
