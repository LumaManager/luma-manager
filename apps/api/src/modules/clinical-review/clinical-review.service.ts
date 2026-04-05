import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  ClinicalReviewDetail,
  ClinicalReviewDraftUpdateRequest,
  ClinicalReviewQueueResponse
} from "@terapia/contracts";
import { clinicalReviewDraftUpdateRequestSchema } from "@terapia/contracts";

type ReviewRecord = {
  appointmentId: string;
  draftContent: ClinicalReviewDetail["draftContent"];
  draftStatus: ClinicalReviewDetail["draftStatus"];
  endedAtLabel: string;
  latestApprovedRecordMeta: string;
  modalityLabel: string;
  patientId: string;
  patientName: string;
  reviewState: ClinicalReviewDetail["reviewState"];
  sessionLabel: string;
  slaLabel: string;
  slaState: ClinicalReviewQueueResponse["items"][number]["slaState"];
  transcriptBlocks: ClinicalReviewDetail["transcriptBlocks"];
  transcriptStatus: ClinicalReviewDetail["transcriptStatus"];
  versionHistory: ClinicalReviewDetail["versionHistory"];
};

const seedRecords: ReviewRecord[] = [
  {
    appointmentId: "appt_1018",
    patientId: "patient_maria_souza",
    patientName: "Maria Souza",
    sessionLabel: "23 Mar 2026 · 13:30",
    modalityLabel: "Teleatendimento",
    endedAtLabel: "Encerrada ha 7 dias",
    transcriptStatus: "ready",
    draftStatus: "ready",
    reviewState: "ready_for_review",
    slaState: "overdue",
    slaLabel: "Atrasado · 7 dias",
    draftContent: {
      summary:
        "Sessao focada em reorganizacao de rotina, com melhora parcial no manejo de ansiedade e maior clareza sobre sobrecarga no trabalho.",
      topics:
        "- rotina semanal mais previsivel\n- gatilhos de ansiedade ligados a sobrecarga\n- combinados de pausa ativa entre atendimentos",
      continuity:
        "Retomar experimento de distribuicao de energia na semana seguinte e revisar aderencia aos limites combinados.",
      pending:
        "Conferir se a paciente deseja atualizar a politica de pagamentos em abril."
    },
    transcriptBlocks: [
      {
        id: "tr_1018_1",
        timestampLabel: "00:02",
        speakerLabel: "Paciente",
        text: "A semana ficou melhor quando eu consegui delimitar os horarios de trabalho."
      },
      {
        id: "tr_1018_2",
        timestampLabel: "08:14",
        speakerLabel: "Terapeuta",
        text: "O que ajudou mais a reduzir a pressao nessa reorganizacao?"
      },
      {
        id: "tr_1018_3",
        timestampLabel: "17:42",
        speakerLabel: "Paciente",
        text: "Perceber que eu nao precisava resolver tudo no mesmo dia."
      }
    ],
    versionHistory: [
      {
        id: "ver_1018_a",
        label: "Rascunho IA v1",
        statusLabel: "Pronto",
        authorLabel: "IA assistida",
        createdAtLabel: "23 Mar · 14:28"
      }
    ],
    latestApprovedRecordMeta: "Nenhuma versao aprovada ainda"
  },
  {
    appointmentId: "appt_1026",
    patientId: "patient_lucas_santos",
    patientName: "Lucas Santos",
    sessionLabel: "22 Mar 2026 · 15:00",
    modalityLabel: "Presencial",
    endedAtLabel: "Encerrada ha 8 dias",
    transcriptStatus: "ready",
    draftStatus: "failed",
    reviewState: "ready_for_review",
    slaState: "attention",
    slaLabel: "Atencao · 2 dias",
    draftContent: {
      summary: "",
      topics: "",
      continuity: "",
      pending: ""
    },
    transcriptBlocks: [
      {
        id: "tr_1026_1",
        timestampLabel: "00:05",
        speakerLabel: "Paciente",
        text: "A sessao presencial ajudou a estabilizar a sensacao de confusao da semana."
      },
      {
        id: "tr_1026_2",
        timestampLabel: "19:10",
        speakerLabel: "Terapeuta",
        text: "Vamos consolidar o que ficou mais claro para voce desde a ultima consulta."
      }
    ],
    versionHistory: [
      {
        id: "ver_1026_a",
        label: "Geracao IA",
        statusLabel: "Falha",
        authorLabel: "Pipeline IA",
        createdAtLabel: "22 Mar · 16:03"
      }
    ],
    latestApprovedRecordMeta: "Nenhuma versao aprovada ainda"
  },
  {
    appointmentId: "appt_1042",
    patientId: "patient_renata_costa",
    patientName: "Renata Costa",
    sessionLabel: "28 Mar 2026 · 17:10",
    modalityLabel: "Teleatendimento",
    endedAtLabel: "Encerrada ha 2 dias",
    transcriptStatus: "failed",
    draftStatus: "waiting_transcript",
    reviewState: "blocked",
    slaState: "attention",
    slaLabel: "Atencao · transcript falhou",
    draftContent: {
      summary: "",
      topics: "",
      continuity: "",
      pending: "Necessario reprocessar transcript antes da geracao do rascunho."
    },
    transcriptBlocks: [],
    versionHistory: [
      {
        id: "ver_1042_a",
        label: "Transcript",
        statusLabel: "Falha",
        authorLabel: "Pipeline ASR",
        createdAtLabel: "28 Mar · 18:11"
      }
    ],
    latestApprovedRecordMeta: "Nenhuma versao aprovada ainda"
  },
  {
    appointmentId: "appt_1048",
    patientId: "patient_caio_oliveira",
    patientName: "Caio Oliveira",
    sessionLabel: "27 Mar 2026 · 11:00",
    modalityLabel: "Teleatendimento",
    endedAtLabel: "Encerrada ha 3 dias",
    transcriptStatus: "disabled",
    draftStatus: "disabled",
    reviewState: "blocked",
    slaState: "within_sla",
    slaLabel: "Dentro do prazo",
    draftContent: {
      summary: "",
      topics: "",
      continuity: "",
      pending: "Fluxo manual puro. Transcript desativado por politica da conta."
    },
    transcriptBlocks: [],
    versionHistory: [
      {
        id: "ver_1048_a",
        label: "Processamento clinico",
        statusLabel: "Desativado",
        authorLabel: "Politica da conta",
        createdAtLabel: "27 Mar · 11:55"
      }
    ],
    latestApprovedRecordMeta: "Nenhuma versao aprovada ainda"
  }
];

@Injectable()
export class ClinicalReviewService {
  private readonly records = [...seedRecords];

  list(query: Record<string, string>): ClinicalReviewQueueResponse {
    const filters = {
      search: query.search ?? "",
      reviewState:
        query.reviewState === "processing" ||
        query.reviewState === "ready_for_review" ||
        query.reviewState === "in_review" ||
        query.reviewState === "blocked"
          ? query.reviewState
          : "all",
      transcriptStatus:
        query.transcriptStatus === "not_started" ||
        query.transcriptStatus === "processing" ||
        query.transcriptStatus === "ready" ||
        query.transcriptStatus === "failed" ||
        query.transcriptStatus === "disabled"
          ? query.transcriptStatus
          : "all",
      draftStatus:
        query.draftStatus === "not_started" ||
        query.draftStatus === "waiting_transcript" ||
        query.draftStatus === "generating" ||
        query.draftStatus === "ready" ||
        query.draftStatus === "failed" ||
        query.draftStatus === "disabled"
          ? query.draftStatus
          : "all",
      slaState:
        query.slaState === "within_sla" ||
        query.slaState === "attention" ||
        query.slaState === "overdue"
          ? query.slaState
          : "all",
      failuresOnly: query.failuresOnly === "true",
      thisWeekOnly: query.thisWeekOnly === "true",
      transcriptDisabledOnly: query.transcriptDisabledOnly === "true"
    } as const;

    const items = this.records
      .filter((record) => !["approved", "discarded"].includes(record.reviewState))
      .filter((record) =>
        filters.search.length === 0
          ? true
          : `${record.patientName} ${record.sessionLabel}`
              .toLowerCase()
              .includes(filters.search.toLowerCase())
      )
      .filter((record) => (filters.reviewState === "all" ? true : record.reviewState === filters.reviewState))
      .filter((record) =>
        filters.transcriptStatus === "all" ? true : record.transcriptStatus === filters.transcriptStatus
      )
      .filter((record) => (filters.draftStatus === "all" ? true : record.draftStatus === filters.draftStatus))
      .filter((record) => (filters.slaState === "all" ? true : record.slaState === filters.slaState))
      .filter((record) =>
        filters.failuresOnly
          ? record.transcriptStatus === "failed" || record.draftStatus === "failed"
          : true
      )
      .filter((record) => (filters.transcriptDisabledOnly ? record.transcriptStatus === "disabled" : true))
      .filter((record) => (filters.thisWeekOnly ? !record.endedAtLabel.includes("8 dias") : true))
      .sort((left, right) => priorityWeight[left.reviewState] - priorityWeight[right.reviewState] || slaWeight[right.slaState] - slaWeight[left.slaState])
      .map((record) => ({
        appointmentId: record.appointmentId,
        patientId: record.patientId,
        patientName: record.patientName,
        patientHref: `/app/patients/${record.patientId}`,
        sessionLabel: record.sessionLabel,
        modalityLabel: record.modalityLabel,
        transcriptStatus: record.transcriptStatus,
        draftStatus: record.draftStatus,
        reviewState: record.reviewState,
        slaState: record.slaState,
        slaLabel: record.slaLabel,
        endedAtLabel: record.endedAtLabel,
        openHref: `/app/clinical-review/${record.appointmentId}`
      }));

    return {
      items,
      total: items.length,
      filters,
      nextItemHref: items[0]?.openHref ?? "",
      availablePageSizes: [10, 20, 50]
    };
  }

  getDetail(appointmentId: string): ClinicalReviewDetail {
    const record = this.getRecord(appointmentId);

    return {
      appointmentId: record.appointmentId,
      patientId: record.patientId,
      patientName: record.patientName,
      patientHref: `/app/patients/${record.patientId}`,
      sessionLabel: `${record.sessionLabel} · ${record.modalityLabel}`,
      transcriptStatus: record.transcriptStatus,
      draftStatus: record.draftStatus,
      reviewState: record.reviewState,
      transcriptStatusLabel: transcriptLabelMap[record.transcriptStatus],
      draftStatusLabel: draftLabelMap[record.draftStatus],
      reviewStateLabel: reviewLabelMap[record.reviewState],
      transcriptBlocks: record.transcriptBlocks,
      draftContent: record.draftContent,
      versionHistory: record.versionHistory,
      latestApprovedRecordMeta: record.latestApprovedRecordMeta,
      pipelineHighlights: [
        {
          label: "Transcript",
          value: transcriptLabelMap[record.transcriptStatus]
        },
        {
          label: "Rascunho IA",
          value: draftLabelMap[record.draftStatus]
        },
        {
          label: "Estado",
          value: reviewLabelMap[record.reviewState]
        }
      ],
      primaryActions: {
        saveDraftEnabled: true,
        approveEnabled: record.transcriptStatus === "ready" || record.draftStatus === "ready",
        discardEnabled: record.reviewState !== "approved"
      }
    };
  }

  updateDraft(
    appointmentId: string,
    input: ClinicalReviewDraftUpdateRequest
  ): ClinicalReviewDetail {
    const payload = clinicalReviewDraftUpdateRequestSchema.parse(input);
    const record = this.getRecord(appointmentId);

    record.draftContent = payload;
    record.draftStatus = "ready";
    record.reviewState = "in_review";
    record.versionHistory.unshift({
      id: `ver_${appointmentId}_${record.versionHistory.length + 1}`,
      label: "Rascunho salvo",
      statusLabel: "Em revisao",
      authorLabel: "Terapeuta",
      createdAtLabel: "Agora"
    });

    return this.getDetail(appointmentId);
  }

  approve(appointmentId: string): ClinicalReviewDetail {
    const record = this.getRecord(appointmentId);
    record.reviewState = "approved";
    record.latestApprovedRecordMeta = "Versao aprovada agora pelo terapeuta";
    record.versionHistory.unshift({
      id: `ver_${appointmentId}_approved`,
      label: "Registro final aprovado",
      statusLabel: "Aprovado",
      authorLabel: "Terapeuta",
      createdAtLabel: "Agora"
    });
    return this.getDetail(appointmentId);
  }

  discard(appointmentId: string): ClinicalReviewDetail {
    const record = this.getRecord(appointmentId);
    record.reviewState = "discarded";
    record.versionHistory.unshift({
      id: `ver_${appointmentId}_discarded`,
      label: "Rascunho descartado",
      statusLabel: "Descartado",
      authorLabel: "Terapeuta",
      createdAtLabel: "Agora"
    });
    return this.getDetail(appointmentId);
  }

  retryTranscript(appointmentId: string): ClinicalReviewDetail {
    const record = this.getRecord(appointmentId);
    record.transcriptStatus = "processing";
    record.draftStatus = "waiting_transcript";
    record.reviewState = "processing";
    record.versionHistory.unshift({
      id: `ver_${appointmentId}_retry_transcript`,
      label: "Retry transcript",
      statusLabel: "Processando",
      authorLabel: "Sistema",
      createdAtLabel: "Agora"
    });
    return this.getDetail(appointmentId);
  }

  retryDraft(appointmentId: string): ClinicalReviewDetail {
    const record = this.getRecord(appointmentId);
    record.draftStatus = "generating";
    record.reviewState = "processing";
    record.versionHistory.unshift({
      id: `ver_${appointmentId}_retry_draft`,
      label: "Retry rascunho",
      statusLabel: "Gerando",
      authorLabel: "Sistema",
      createdAtLabel: "Agora"
    });
    return this.getDetail(appointmentId);
  }

  private getRecord(appointmentId: string) {
    const record = this.records.find((item) => item.appointmentId === appointmentId);

    if (!record) {
      throw new NotFoundException("Item de revisao clinica nao encontrado.");
    }

    return record;
  }
}

const priorityWeight = {
  ready_for_review: 0,
  in_review: 1,
  blocked: 2,
  processing: 3,
  approved: 4,
  discarded: 5
} as const;

const slaWeight = {
  within_sla: 0,
  attention: 1,
  overdue: 2
} as const;

const transcriptLabelMap = {
  not_started: "Nao iniciado",
  processing: "Processando",
  ready: "Pronto",
  failed: "Falha",
  disabled: "Desativado"
} as const;

const draftLabelMap = {
  not_started: "Nao iniciado",
  waiting_transcript: "Aguardando transcript",
  generating: "Gerando",
  ready: "Pronto",
  failed: "Falha",
  disabled: "Desativado"
} as const;

const reviewLabelMap = {
  processing: "Aguardando processamento",
  ready_for_review: "Pronto para revisar",
  in_review: "Em revisao",
  blocked: "Bloqueado",
  approved: "Aprovado",
  discarded: "Descartado"
} as const;
