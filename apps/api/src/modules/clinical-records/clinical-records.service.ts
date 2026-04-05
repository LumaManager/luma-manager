import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  ClinicalRecordEntry,
  ClinicalRecordVersion,
  PatientClinicalRecord
} from "@terapia/contracts";

type RecordSeed = {
  latestApprovedRecordMeta: string;
  patientHref: string;
  patientId: string;
  patientName: string;
  pendingReviewMeta: PatientClinicalRecord["pendingReviewMeta"];
  records: ClinicalRecordEntry[];
};

const recordsByPatient: Record<string, RecordSeed> = {
  patient_maria_souza: {
    patientId: "patient_maria_souza",
    patientName: "Maria Souza",
    patientHref: "/app/patients/patient_maria_souza",
    latestApprovedRecordMeta: "Ultimo registro aprovado em 16 Mar 2026 · versao atual vigente",
    pendingReviewMeta: {
      exists: true,
      label: "1 revisao pendente da sessao de 23 Mar 2026",
      href: "/app/clinical-review/appt_1018"
    },
    records: [
      {
        id: "record_maria_20260316",
        sessionLabel: "16 Mar 2026 · 13:30 · Teleatendimento",
        approvedAtLabel: "16 Mar 2026 · 14:28",
        approvedByLabel: "Ana Almeida",
        currentVersionLabel: "Versao final v2",
        content: {
          summary:
            "Paciente relatou melhora parcial da autorregulacao na rotina de trabalho, com menor intensidade de ansiedade em comparacao com a semana anterior.",
          topics:
            "- maior previsibilidade da agenda\n- percepcao de limite entre trabalho e descanso\n- reducao de autoexigencia no fim do dia",
          continuity:
            "Manter observacao sobre carga de trabalho e revisar o impacto das pausas programadas na proxima sessao.",
          pending:
            "Retomar checagem de sono e nivel de exaustao caso a sobrecarga aumente novamente."
        },
        versions: [
          {
            id: "record_maria_20260316_v2",
            label: "Versao final v2",
            approvedAtLabel: "16 Mar 2026 · 14:28",
            approvedByLabel: "Ana Almeida"
          },
          {
            id: "record_maria_20260316_v1",
            label: "Versao final v1",
            approvedAtLabel: "16 Mar 2026 · 14:19",
            approvedByLabel: "Ana Almeida"
          }
        ]
      },
      {
        id: "record_maria_20260309",
        sessionLabel: "09 Mar 2026 · 13:30 · Teleatendimento",
        approvedAtLabel: "09 Mar 2026 · 14:22",
        approvedByLabel: "Ana Almeida",
        currentVersionLabel: "Versao final v1",
        content: {
          summary:
            "Sessao centrada em manejo de ansiedade antecipatoria relacionada a compromissos profissionais da semana.",
          topics:
            "- antecipacao de cenarios de falha\n- sobrecarga antes de reunioes\n- efeito das pausas curtas na regulacao emocional",
          continuity:
            "Acompanhar se a estrategia de ancoragem antes de reunioes permanece funcional na proxima semana.",
          pending:
            "Nenhuma pendencia relevante registrada."
        },
        versions: [
          {
            id: "record_maria_20260309_v1",
            label: "Versao final v1",
            approvedAtLabel: "09 Mar 2026 · 14:22",
            approvedByLabel: "Ana Almeida"
          }
        ]
      }
    ]
  },
  patient_lucas_santos: {
    patientId: "patient_lucas_santos",
    patientName: "Lucas Santos",
    patientHref: "/app/patients/patient_lucas_santos",
    latestApprovedRecordMeta: "Ultimo registro aprovado em 08 Mar 2026 · sem revisao pendente bloqueante",
    pendingReviewMeta: {
      exists: true,
      label: "1 item pronto para revisar da sessao de 22 Mar 2026",
      href: "/app/clinical-review/appt_1026"
    },
    records: [
      {
        id: "record_lucas_20260308",
        sessionLabel: "08 Mar 2026 · 15:00 · Presencial",
        approvedAtLabel: "08 Mar 2026 · 16:04",
        approvedByLabel: "Ana Almeida",
        currentVersionLabel: "Versao final v1",
        content: {
          summary:
            "Paciente apresentou maior clareza sobre conflitos de rotina e respondeu bem a intervencoes focadas em organizacao semanal.",
          topics:
            "- oscilacao entre produtividade e esgotamento\n- dificuldade de manter pausas\n- necessidade de reduzir acertos simultaneos",
          continuity:
            "Seguir observando aderencia aos combinados de rotina e impacto no humor durante a semana.",
          pending:
            "Avaliar se o paciente deseja consolidar dia fixo de atendimento."
        },
        versions: [
          {
            id: "record_lucas_20260308_v1",
            label: "Versao final v1",
            approvedAtLabel: "08 Mar 2026 · 16:04",
            approvedByLabel: "Ana Almeida"
          }
        ]
      }
    ]
  },
  patient_renata_costa: {
    patientId: "patient_renata_costa",
    patientName: "Renata Costa",
    patientHref: "/app/patients/patient_renata_costa",
    latestApprovedRecordMeta: "Ultimo registro aprovado em 21 Fev 2026 · novo material ainda bloqueado",
    pendingReviewMeta: {
      exists: true,
      label: "1 revisao bloqueada aguardando transcript",
      href: "/app/clinical-review/appt_1042"
    },
    records: [
      {
        id: "record_renata_20260221",
        sessionLabel: "21 Fev 2026 · 17:10 · Teleatendimento",
        approvedAtLabel: "21 Fev 2026 · 18:02",
        approvedByLabel: "Ana Almeida",
        currentVersionLabel: "Versao final v1",
        content: {
          summary:
            "Registro final anterior mantido como verdade vigente enquanto a revisao mais recente permanece bloqueada.",
          topics:
            "- estabilidade relativa entre sessoes\n- necessidade de revisar consentimento de teleatendimento\n- continuidade do acompanhamento semanal",
          continuity:
            "Aguardar regularizacao documental antes de consolidar nova entrada de prontuario.",
          pending:
            "Sem nova aprovacao ate a liberacao do fluxo de revisao."
        },
        versions: [
          {
            id: "record_renata_20260221_v1",
            label: "Versao final v1",
            approvedAtLabel: "21 Fev 2026 · 18:02",
            approvedByLabel: "Ana Almeida"
          }
        ]
      }
    ]
  }
};

@Injectable()
export class ClinicalRecordsService {
  getPatientClinicalRecord(patientId: string): PatientClinicalRecord {
    const record = this.getPatientSeed(patientId);

    return {
      patientId: record.patientId,
      patientName: record.patientName,
      patientHref: record.patientHref,
      totalApprovedRecords: record.records.length,
      latestApprovedRecordMeta: record.latestApprovedRecordMeta,
      pendingReviewMeta: record.pendingReviewMeta,
      entries: record.records,
      timeline: record.records.map((entry, index) => ({
        id: entry.id,
        sessionLabel: entry.sessionLabel,
        approvalLabel: entry.approvedAtLabel,
        approvedByLabel: entry.approvedByLabel,
        reviewHref: record.pendingReviewMeta.href,
        isLatest: index === 0
      })),
      selectedEntry: record.records[0]!
    };
  }

  getClinicalRecordEntry(patientId: string, recordId: string): ClinicalRecordEntry {
    const patient = this.getPatientSeed(patientId);
    const entry = patient.records.find((item) => item.id === recordId);

    if (!entry) {
      throw new NotFoundException("Entrada de prontuario nao encontrada.");
    }

    return entry;
  }

  getClinicalRecordVersions(patientId: string, recordId: string): ClinicalRecordVersion[] {
    return this.getClinicalRecordEntry(patientId, recordId).versions;
  }

  private getPatientSeed(patientId: string) {
    const patient = recordsByPatient[patientId];

    if (!patient) {
      throw new NotFoundException("Prontuario longitudinal nao encontrado para este paciente.");
    }

    return patient;
  }
}
