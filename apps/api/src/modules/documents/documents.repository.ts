// apps/api/src/modules/documents/documents.repository.ts
import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, inArray } from "drizzle-orm";

import type { DrizzleClient } from "@/db/client";
import { DATABASE_CLIENT } from "@/common/tokens";
import { documentEvents, documents, patients } from "@/db/schema";

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------

export type DocumentRow = typeof documents.$inferSelect;
export type DocumentEventRow = typeof documentEvents.$inferSelect;

export type DocumentWithPatient = DocumentRow & {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientBirthDate: string;
};

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export type CreateDocumentInput = {
  tenantId: string;
  patientId: string;
  appointmentId: string;
  code: string;
  documentType: string;
  templateVersion: string;
  deliveryChannel: string;
  signatureStatus: string;
  consentStatus: string;
  criticality: string;
  criticalReason: string;
};

export type UpdateDocumentInput = {
  signatureStatus?: string;
  consentStatus?: string;
  criticality?: string;
  criticalReason?: string;
  signedByLabel?: string;
  lastSentAt?: Date;
  lastEventAt?: Date;
  revokedAt?: Date;
};

export type AddDocumentEventInput = {
  documentId: string;
  eventType: string;
  actorType: string;
  actorId: string;
  description: string;
};

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

@Injectable()
export class DocumentsRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  // ---------------------------------------------------------------------------
  // List all documents for a tenant with patient context
  // ---------------------------------------------------------------------------

  async listWithPatient(tenantId: string): Promise<DocumentWithPatient[]> {
    const rows = await this.db
      .select({
        id: documents.id,
        tenantId: documents.tenantId,
        patientId: documents.patientId,
        appointmentId: documents.appointmentId,
        code: documents.code,
        documentType: documents.documentType,
        templateVersion: documents.templateVersion,
        deliveryChannel: documents.deliveryChannel,
        signatureStatus: documents.signatureStatus,
        consentStatus: documents.consentStatus,
        criticality: documents.criticality,
        criticalReason: documents.criticalReason,
        fileReference: documents.fileReference,
        signedByLabel: documents.signedByLabel,
        generatedAt: documents.generatedAt,
        lastSentAt: documents.lastSentAt,
        lastEventAt: documents.lastEventAt,
        revokedAt: documents.revokedAt,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        patientName: patients.fullName,
        patientEmail: patients.email,
        patientPhone: patients.phone,
        patientBirthDate: patients.birthDate
      })
      .from(documents)
      .innerJoin(patients, eq(documents.patientId, patients.id))
      .where(eq(documents.tenantId, tenantId))
      .orderBy(desc(documents.createdAt));

    return rows as DocumentWithPatient[];
  }

  // ---------------------------------------------------------------------------
  // Find single document by id
  // ---------------------------------------------------------------------------

  async findByIdWithPatient(
    tenantId: string,
    documentId: string
  ): Promise<DocumentWithPatient | null> {
    const rows = await this.db
      .select({
        id: documents.id,
        tenantId: documents.tenantId,
        patientId: documents.patientId,
        appointmentId: documents.appointmentId,
        code: documents.code,
        documentType: documents.documentType,
        templateVersion: documents.templateVersion,
        deliveryChannel: documents.deliveryChannel,
        signatureStatus: documents.signatureStatus,
        consentStatus: documents.consentStatus,
        criticality: documents.criticality,
        criticalReason: documents.criticalReason,
        fileReference: documents.fileReference,
        signedByLabel: documents.signedByLabel,
        generatedAt: documents.generatedAt,
        lastSentAt: documents.lastSentAt,
        lastEventAt: documents.lastEventAt,
        revokedAt: documents.revokedAt,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        patientName: patients.fullName,
        patientEmail: patients.email,
        patientPhone: patients.phone,
        patientBirthDate: patients.birthDate
      })
      .from(documents)
      .innerJoin(patients, eq(documents.patientId, patients.id))
      .where(and(eq(documents.id, documentId), eq(documents.tenantId, tenantId)))
      .limit(1);

    return (rows[0] as DocumentWithPatient) ?? null;
  }

  // ---------------------------------------------------------------------------
  // Events — batch fetch for multiple documents
  // ---------------------------------------------------------------------------

  async listEventsForDocuments(documentIds: string[]): Promise<DocumentEventRow[]> {
    if (documentIds.length === 0) return [];

    return this.db
      .select()
      .from(documentEvents)
      .where(inArray(documentEvents.documentId, documentIds))
      .orderBy(desc(documentEvents.occurredAt));
  }

  // ---------------------------------------------------------------------------
  // Events — single document (detail view)
  // ---------------------------------------------------------------------------

  async listEvents(documentId: string): Promise<DocumentEventRow[]> {
    return this.db
      .select()
      .from(documentEvents)
      .where(eq(documentEvents.documentId, documentId))
      .orderBy(desc(documentEvents.occurredAt));
  }

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  async create(input: CreateDocumentInput): Promise<DocumentRow> {
    const id = randomUUID();

    const [row] = await this.db
      .insert(documents)
      .values({
        id,
        tenantId: input.tenantId,
        patientId: input.patientId,
        appointmentId: input.appointmentId,
        code: input.code,
        documentType: input.documentType,
        templateVersion: input.templateVersion,
        deliveryChannel: input.deliveryChannel,
        signatureStatus: input.signatureStatus,
        consentStatus: input.consentStatus,
        criticality: input.criticality,
        criticalReason: input.criticalReason,
        generatedAt: new Date(),
        lastSentAt: new Date(),
        lastEventAt: new Date()
      })
      .returning();

    return row!;
  }

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  async update(documentId: string, data: UpdateDocumentInput): Promise<void> {
    await this.db
      .update(documents)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(documents.id, documentId));
  }

  // ---------------------------------------------------------------------------
  // Add event
  // ---------------------------------------------------------------------------

  async addEvent(input: AddDocumentEventInput): Promise<void> {
    await this.db.insert(documentEvents).values({
      id: randomUUID(),
      documentId: input.documentId,
      eventType: input.eventType,
      actorType: input.actorType,
      actorId: input.actorId,
      description: input.description
    });
  }

  // ---------------------------------------------------------------------------
  // Count for code generation
  // ---------------------------------------------------------------------------

  async countForTenant(tenantId: string): Promise<number> {
    const rows = await this.db
      .select({ id: documents.id })
      .from(documents)
      .where(eq(documents.tenantId, tenantId));

    return rows.length;
  }

  // ---------------------------------------------------------------------------
  // Patient info for document creation context
  // ---------------------------------------------------------------------------

  async getPatientInfo(
    patientId: string
  ): Promise<{ id: string; fullName: string; email: string; phone: string } | null> {
    const rows = await this.db
      .select({
        id: patients.id,
        fullName: patients.fullName,
        email: patients.email,
        phone: patients.phone
      })
      .from(patients)
      .where(eq(patients.id, patientId))
      .limit(1);

    return rows[0] ?? null;
  }
}
