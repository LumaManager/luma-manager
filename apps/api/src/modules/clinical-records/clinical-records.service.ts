// apps/api/src/modules/clinical-records/clinical-records.service.ts
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type {
  ClinicalRecordEntry,
  ClinicalRecordVersion,
  PatientClinicalRecord
} from "@terapia/contracts";

import type { ApprovedDraftWithContext, ClinicalDraftVersionRow } from "./clinical-records.repository";
import { ClinicalRecordsRepository } from "./clinical-records.repository";

// ---------------------------------------------------------------------------
// Date / label helpers
// ---------------------------------------------------------------------------

const PT_MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

/**
 * "YYYY-MM-DD" → "DD Mmm YYYY"
 */
function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  const m = parseInt(month ?? "1", 10) - 1;
  return `${parseInt(day ?? "1", 10)} ${PT_MONTHS[m] ?? ""} ${year ?? ""}`;
}

/**
 * Date + "HH:MM:SS" → "DD Mmm YYYY · HH:MM"
 */
function formatDateAndTime(isoDate: string, timeStr: string): string {
  const hhmm = timeStr.slice(0, 5);
  return `${formatDate(isoDate)} · ${hhmm}`;
}

/**
 * Timestamp → "DD Mmm YYYY · HH:MM"
 */
function formatTimestamp(ts: Date | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${PT_MONTHS[month] ?? ""} ${year} · ${hh}:${mm}`;
}

/**
 * Modality DB value → display label
 */
function modalityLabel(modality: string): string {
  switch (modality.toLowerCase()) {
    case "online":
    case "teleatendimento":
      return "Teleatendimento";
    case "presencial":
    case "in_person":
      return "Presencial";
    default:
      return "Presencial";
  }
}

/**
 * "DD Mmm YYYY · HH:MM" from session date/time/modality
 */
function sessionLabel(date: string, startTime: string, modality: string): string {
  return `${formatDateAndTime(date, startTime)} · ${modalityLabel(modality)}`;
}

/**
 * Version label: "Versão final v{N}" (N = 1-indexed from oldest)
 */
function versionLabel(index: number): string {
  return `Versão final v${index + 1}`;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapDraftToEntry(
  draft: ApprovedDraftWithContext,
  versions: ClinicalDraftVersionRow[]
): ClinicalRecordEntry {
  const mappedVersions: ClinicalRecordVersion[] = versions.map((v, i) => ({
    id: v.id,
    label: versionLabel(i),
    approvedAtLabel: formatTimestamp(v.createdAt),
    approvedByLabel: draft.approvedBy
  }));

  const currentVersionLabel =
    mappedVersions.length > 0
      ? (mappedVersions[mappedVersions.length - 1]?.label ?? "Versão final v1")
      : "Versão final v1";

  return {
    id: draft.id,
    sessionLabel: sessionLabel(draft.appointmentDate, draft.appointmentStartTime, draft.appointmentModality),
    approvedAtLabel: formatTimestamp(draft.approvedAt),
    approvedByLabel: draft.approvedBy,
    currentVersionLabel,
    content: {
      summary: draft.draftSummary,
      topics: draft.draftTopics,
      continuity: draft.draftContinuity,
      pending: draft.draftPending
    },
    versions: mappedVersions
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class ClinicalRecordsService {
  constructor(
    @Inject(ClinicalRecordsRepository)
    private readonly repo: ClinicalRecordsRepository
  ) {}

  async getPatientClinicalRecord(
    therapistId: string,
    patientId: string
  ): Promise<PatientClinicalRecord> {
    const [drafts, pendingReview] = await Promise.all([
      this.repo.listApprovedForPatient(therapistId, patientId),
      this.repo.findPendingReview(therapistId, patientId)
    ]);

    if (drafts.length === 0 && !pendingReview) {
      throw new NotFoundException("Prontuário longitudinal não encontrado para este paciente.");
    }

    // Load versions for all drafts in parallel
    const versionsByDraft = await Promise.all(
      drafts.map((d) => this.repo.listVersionsForDraft(d.id))
    );

    const entries: ClinicalRecordEntry[] = drafts.map((d, i) =>
      mapDraftToEntry(d, versionsByDraft[i] ?? [])
    );

    const patientName = drafts[0]?.patientName ?? "";

    // Latest approved meta
    const latestDraft = drafts[0];
    const latestApprovedRecordMeta = latestDraft
      ? `Último registro aprovado em ${formatDate(latestDraft.appointmentDate)} · versão atual vigente`
      : "Nenhum registro aprovado";

    // Pending review meta
    const pendingReviewMeta = pendingReview
      ? {
          exists: true,
          label: `1 revisão pendente`,
          href: `/app/clinical-review/${pendingReview.appointmentId}`
        }
      : { exists: false, label: "", href: "" };

    const timeline = entries.map((entry, index) => ({
      id: entry.id,
      sessionLabel: entry.sessionLabel,
      approvalLabel: entry.approvedAtLabel,
      approvedByLabel: entry.approvedByLabel,
      reviewHref: pendingReviewMeta.href,
      isLatest: index === 0
    }));

    return {
      patientId,
      patientName,
      patientHref: `/app/patients/${patientId}`,
      totalApprovedRecords: entries.length,
      latestApprovedRecordMeta,
      pendingReviewMeta,
      entries,
      timeline,
      selectedEntry: entries[0] ?? this.emptyEntry()
    };
  }

  async getClinicalRecordEntry(
    therapistId: string,
    patientId: string,
    draftId: string
  ): Promise<ClinicalRecordEntry> {
    const draft = await this.repo.findApprovedById(therapistId, draftId);

    if (!draft || draft.patientId !== patientId) {
      throw new NotFoundException("Entrada de prontuário não encontrada.");
    }

    const versions = await this.repo.listVersionsForDraft(draftId);
    return mapDraftToEntry(draft, versions);
  }

  async getClinicalRecordVersions(
    therapistId: string,
    patientId: string,
    draftId: string
  ): Promise<ClinicalRecordVersion[]> {
    const entry = await this.getClinicalRecordEntry(therapistId, patientId, draftId);
    return entry.versions;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private emptyEntry(): ClinicalRecordEntry {
    return {
      id: "",
      sessionLabel: "",
      approvedAtLabel: "",
      approvedByLabel: "",
      currentVersionLabel: "",
      content: { summary: "", topics: "", continuity: "", pending: "" },
      versions: []
    };
  }
}
