// apps/api/src/modules/clinical-records/clinical-records.repository.ts
import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, inArray, not } from "drizzle-orm";

import type { DrizzleClient } from "@/db/client";
import { DATABASE_CLIENT } from "@/common/tokens";
import { appointments, clinicalDraftVersions, clinicalDrafts, patients } from "@/db/schema";

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------

export type ClinicalDraftRow = typeof clinicalDrafts.$inferSelect;
export type ClinicalDraftVersionRow = typeof clinicalDraftVersions.$inferSelect;

export type ApprovedDraftWithContext = ClinicalDraftRow & {
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentModality: string;
  patientName: string;
};

export type PendingReviewDraft = {
  id: string;
  appointmentId: string;
  reviewState: string;
  createdAt: Date;
};

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

@Injectable()
export class ClinicalRecordsRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  // ---------------------------------------------------------------------------
  // List approved drafts for a patient (= prontuário longitudinal)
  // ---------------------------------------------------------------------------

  async listApprovedForPatient(
    therapistId: string,
    patientId: string
  ): Promise<ApprovedDraftWithContext[]> {
    const rows = await this.db
      .select({
        id: clinicalDrafts.id,
        appointmentId: clinicalDrafts.appointmentId,
        patientId: clinicalDrafts.patientId,
        therapistId: clinicalDrafts.therapistId,
        transcriptStatus: clinicalDrafts.transcriptStatus,
        draftStatus: clinicalDrafts.draftStatus,
        reviewState: clinicalDrafts.reviewState,
        draftSummary: clinicalDrafts.draftSummary,
        draftTopics: clinicalDrafts.draftTopics,
        draftContinuity: clinicalDrafts.draftContinuity,
        draftPending: clinicalDrafts.draftPending,
        approvedAt: clinicalDrafts.approvedAt,
        approvedBy: clinicalDrafts.approvedBy,
        discardedAt: clinicalDrafts.discardedAt,
        createdAt: clinicalDrafts.createdAt,
        updatedAt: clinicalDrafts.updatedAt,
        appointmentDate: appointments.date,
        appointmentStartTime: appointments.startTime,
        appointmentModality: appointments.modality,
        patientName: patients.fullName
      })
      .from(clinicalDrafts)
      .innerJoin(appointments, eq(clinicalDrafts.appointmentId, appointments.id))
      .innerJoin(patients, eq(clinicalDrafts.patientId, patients.id))
      .where(
        and(
          eq(clinicalDrafts.therapistId, therapistId),
          eq(clinicalDrafts.patientId, patientId),
          eq(clinicalDrafts.reviewState, "approved")
        )
      )
      .orderBy(desc(clinicalDrafts.approvedAt));

    return rows as ApprovedDraftWithContext[];
  }

  // ---------------------------------------------------------------------------
  // Find single approved draft by id
  // ---------------------------------------------------------------------------

  async findApprovedById(
    therapistId: string,
    draftId: string
  ): Promise<ApprovedDraftWithContext | null> {
    const rows = await this.db
      .select({
        id: clinicalDrafts.id,
        appointmentId: clinicalDrafts.appointmentId,
        patientId: clinicalDrafts.patientId,
        therapistId: clinicalDrafts.therapistId,
        transcriptStatus: clinicalDrafts.transcriptStatus,
        draftStatus: clinicalDrafts.draftStatus,
        reviewState: clinicalDrafts.reviewState,
        draftSummary: clinicalDrafts.draftSummary,
        draftTopics: clinicalDrafts.draftTopics,
        draftContinuity: clinicalDrafts.draftContinuity,
        draftPending: clinicalDrafts.draftPending,
        approvedAt: clinicalDrafts.approvedAt,
        approvedBy: clinicalDrafts.approvedBy,
        discardedAt: clinicalDrafts.discardedAt,
        createdAt: clinicalDrafts.createdAt,
        updatedAt: clinicalDrafts.updatedAt,
        appointmentDate: appointments.date,
        appointmentStartTime: appointments.startTime,
        appointmentModality: appointments.modality,
        patientName: patients.fullName
      })
      .from(clinicalDrafts)
      .innerJoin(appointments, eq(clinicalDrafts.appointmentId, appointments.id))
      .innerJoin(patients, eq(clinicalDrafts.patientId, patients.id))
      .where(
        and(eq(clinicalDrafts.id, draftId), eq(clinicalDrafts.therapistId, therapistId))
      )
      .limit(1);

    return (rows[0] as ApprovedDraftWithContext) ?? null;
  }

  // ---------------------------------------------------------------------------
  // Versions for a draft (ordered oldest → newest)
  // ---------------------------------------------------------------------------

  async listVersionsForDraft(draftId: string): Promise<ClinicalDraftVersionRow[]> {
    return this.db
      .select()
      .from(clinicalDraftVersions)
      .where(eq(clinicalDraftVersions.draftId, draftId))
      .orderBy(clinicalDraftVersions.createdAt);
  }

  // ---------------------------------------------------------------------------
  // Most recent pending review for a patient (not approved or discarded)
  // ---------------------------------------------------------------------------

  async findPendingReview(
    therapistId: string,
    patientId: string
  ): Promise<PendingReviewDraft | null> {
    const rows = await this.db
      .select({
        id: clinicalDrafts.id,
        appointmentId: clinicalDrafts.appointmentId,
        reviewState: clinicalDrafts.reviewState,
        createdAt: clinicalDrafts.createdAt
      })
      .from(clinicalDrafts)
      .where(
        and(
          eq(clinicalDrafts.therapistId, therapistId),
          eq(clinicalDrafts.patientId, patientId),
          not(inArray(clinicalDrafts.reviewState, ["approved", "discarded"]))
        )
      )
      .orderBy(desc(clinicalDrafts.createdAt))
      .limit(1);

    return rows[0] ?? null;
  }
}
