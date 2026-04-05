import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  AuthSession,
  DocumentConsentStatus,
  DocumentCreateRequest,
  DocumentCreateResponse,
  DocumentCriticality,
  DocumentDetail,
  DocumentListItem,
  DocumentOperationalImpact,
  DocumentSignatureStatus,
  DocumentsListFilters,
  DocumentsListResponse,
  DocumentTimelineEvent,
  DocumentType
} from "@terapia/contracts";
import { documentCreateRequestSchema } from "@terapia/contracts";

type DocumentRecord = {
  id: string;
  code: string;
  patientId: string;
  patientName: string;
  patientContactLabel: string;
  documentType: DocumentType;
  documentTitle: string;
  templateVersion: string;
  generatedAtIso: string;
  generatedAtLabel: string;
  lastSentAtLabel: string;
  lastEventAtIso: string;
  lastEventAtLabel: string;
  lastEventLabel: string;
  sessionContextLabel: string;
  deliveryChannelLabel: string;
  fileReferenceLabel: string;
  signatureStatus: DocumentSignatureStatus;
  signatureStatusLabel: string;
  consentStatus: DocumentConsentStatus;
  consentStatusLabel: string;
  criticality: DocumentCriticality;
  criticalityLabel: string;
  criticalReason: string;
  signedByLabel: string;
  legalRepresentativeLabel: string;
  blockedFlowLabels: string[];
  canResend: boolean;
  canRevoke: boolean;
  canGenerateNewVersion: boolean;
  previewSections: DocumentDetail["previewSections"];
  operationalImpacts: DocumentOperationalImpact[];
  timeline: DocumentTimelineEvent[];
};

const seedDocuments: DocumentRecord[] = [
  {
    id: "doc_002",
    code: "DOC-2026-002",
    patientId: "patient_maria_souza",
    patientName: "Maria Souza",
    patientContactLabel: "maria.souza@email.com · (11) 98888-1101",
    documentType: "telehealth",
    documentTitle: "Termo de teleatendimento",
    templateVersion: "v2.3",
    generatedAtIso: "2026-03-19T08:10:00-03:00",
    generatedAtLabel: "Gerado em 19 Mar 2026",
    lastSentAtLabel: "Enviado por e-mail em 19 Mar · 08:12",
    lastEventAtIso: "2026-03-19T08:18:00-03:00",
    lastEventAtLabel: "19 Mar · 08:18",
    lastEventLabel: "Assinado pela paciente",
    sessionContextLabel: "Teleatendimento semanal · quartas 13:30",
    deliveryChannelLabel: "E-mail",
    fileReferenceLabel: "Arquivo PDF versionado no storage gerenciado",
    signatureStatus: "signed",
    signatureStatusLabel: "Assinado",
    consentStatus: "valid",
    consentStatusLabel: "Valido",
    criticality: "normal",
    criticalityLabel: "Sem bloqueio",
    criticalReason: "Documento vigente e consentimento operacional valido.",
    signedByLabel: "Maria Souza",
    legalRepresentativeLabel: "Nao se aplica",
    blockedFlowLabels: [],
    canResend: false,
    canRevoke: true,
    canGenerateNewVersion: true,
    previewSections: [
      {
        title: "Escopo do consentimento",
        body:
          "Autoriza a realizacao de sessoes por videochamada na plataforma, incluindo regras de confidencialidade, estabilidade de conexao e reconexao."
      },
      {
        title: "Condições de uso",
        body:
          "Explica responsabilidade de ambiente privado, orientacoes de seguranca e como a sessao pode ser interrompida em caso de falha operacional."
      }
    ],
    operationalImpacts: [
      {
        id: "impact_doc_002_1",
        title: "Teleatendimento liberado",
        description: "A paciente pode entrar na sala sem bloqueio documental.",
        tone: "success"
      },
      {
        id: "impact_doc_002_2",
        title: "Transcript opcional",
        description: "Nenhum bloqueio documental atual para fluxo pos-sessao assistido.",
        tone: "info"
      }
    ],
    timeline: [
      {
        id: "timeline_doc_002_1",
        title: "Documento assinado",
        description: "Aceite confirmado pela paciente no fluxo de assinatura.",
        occurredAtLabel: "19 Mar · 08:18",
        actorLabel: "Paciente"
      },
      {
        id: "timeline_doc_002_2",
        title: "Documento reenviado",
        description: "Link de assinatura reenviado por e-mail apos troca de versao.",
        occurredAtLabel: "19 Mar · 08:12",
        actorLabel: "Sistema"
      },
      {
        id: "timeline_doc_002_3",
        title: "Documento gerado",
        description: "Versao padrao do template vinculada ao caso da paciente.",
        occurredAtLabel: "19 Mar · 08:10",
        actorLabel: "Terapeuta"
      }
    ]
  },
  {
    id: "doc_101",
    code: "DOC-2026-101",
    patientId: "patient_lucas_santos",
    patientName: "Lucas Santos",
    patientContactLabel: "lucas.santos@email.com · (11) 97777-2012",
    documentType: "transcript_ai",
    documentTitle: "Termo de transcript e IA documental",
    templateVersion: "v1.4",
    generatedAtIso: "2026-03-30T09:05:00-03:00",
    generatedAtLabel: "Gerado em 30 Mar 2026",
    lastSentAtLabel: "Enviado por e-mail hoje · 09:06",
    lastEventAtIso: "2026-03-30T10:10:00-03:00",
    lastEventAtLabel: "Hoje · 10:10",
    lastEventLabel: "Reenvio realizado",
    sessionContextLabel: "Primeira avaliacao · presencial hoje 15:00",
    deliveryChannelLabel: "E-mail",
    fileReferenceLabel: "Arquivo PDF versionado no storage gerenciado",
    signatureStatus: "pending",
    signatureStatusLabel: "Pendente",
    consentStatus: "pending",
    consentStatusLabel: "Pendente",
    criticality: "attention",
    criticalityLabel: "Acompanha operacao",
    criticalReason: "Fluxo assistido por transcript/IA fica desativado ate o aceite do paciente.",
    signedByLabel: "Aguardando assinatura do paciente",
    legalRepresentativeLabel: "Nao se aplica",
    blockedFlowLabels: ["Transcript e IA documental"],
    canResend: true,
    canRevoke: true,
    canGenerateNewVersion: true,
    previewSections: [
      {
        title: "Escopo do uso de IA",
        body:
          "Define que transcript e rascunho documental sao capacidades opcionais e condicionadas ao aceite do paciente, sem reter bruto apos processamento."
      },
      {
        title: "Descarte e processamento",
        body:
          "Indica processamento com direcao Brasil-first e descarte tecnico de transcript bruto e audio bruto apos a janela operacional."
      }
    ],
    operationalImpacts: [
      {
        id: "impact_doc_101_1",
        title: "Pos-sessao manual",
        description: "A sessao continua possivel, mas o fechamento clinico fica em fluxo manual puro.",
        tone: "warning"
      },
      {
        id: "impact_doc_101_2",
        title: "Sem bloqueio para atendimento",
        description: "Nao bloqueia a sessao presencial de hoje.",
        tone: "info"
      }
    ],
    timeline: [
      {
        id: "timeline_doc_101_1",
        title: "Documento reenviado",
        description: "Novo link de assinatura disparado para reduzir atraso no aceite.",
        occurredAtLabel: "Hoje · 10:10",
        actorLabel: "Terapeuta"
      },
      {
        id: "timeline_doc_101_2",
        title: "Documento enviado",
        description: "Primeiro envio por e-mail logo apos a geracao.",
        occurredAtLabel: "Hoje · 09:06",
        actorLabel: "Sistema"
      }
    ]
  },
  {
    id: "doc_201",
    code: "DOC-2026-201",
    patientId: "patient_renata_costa",
    patientName: "Renata Costa",
    patientContactLabel: "renata.costa@email.com · (11) 96666-3313",
    documentType: "telehealth",
    documentTitle: "Termo de teleatendimento",
    templateVersion: "v2.2",
    generatedAtIso: "2026-02-02T11:20:00-03:00",
    generatedAtLabel: "Gerado em 02 Fev 2026",
    lastSentAtLabel: "Reenviado hoje · 11:48",
    lastEventAtIso: "2026-03-30T11:48:00-03:00",
    lastEventAtLabel: "Hoje · 11:48",
    lastEventLabel: "Reenvio realizado",
    sessionContextLabel: "Teleatendimento hoje · 17:10",
    deliveryChannelLabel: "E-mail",
    fileReferenceLabel: "Arquivo PDF versionado no storage gerenciado",
    signatureStatus: "expired",
    signatureStatusLabel: "Expirado",
    consentStatus: "pending",
    consentStatusLabel: "Pendente",
    criticality: "critical",
    criticalityLabel: "Bloqueia sessao online",
    criticalReason: "Sem revalidacao do teleatendimento a sala deve permanecer bloqueada.",
    signedByLabel: "Aceite anterior expirado",
    legalRepresentativeLabel: "Nao se aplica",
    blockedFlowLabels: ["Teleatendimento de hoje"],
    canResend: true,
    canRevoke: false,
    canGenerateNewVersion: true,
    previewSections: [
      {
        title: "Validade do aceite",
        body:
          "Esclarece que o aceite tem vigencia controlada e pode exigir revalidacao quando houver mudanca de politica, template ou janela regulatoria."
      },
      {
        title: "Consequencia operacional",
        body:
          "Enquanto expirado, o sistema deve tratar a sessao online como bloqueada para entrada segura."
      }
    ],
    operationalImpacts: [
      {
        id: "impact_doc_201_1",
        title: "Entrada na sala bloqueada",
        description: "A paciente nao deve entrar na call ate novo aceite.",
        tone: "critical"
      },
      {
        id: "impact_doc_201_2",
        title: "Dashboard com alerta",
        description: "A pendencia aparece na dashboard, agenda e detalhe da sessao.",
        tone: "warning"
      }
    ],
    timeline: [
      {
        id: "timeline_doc_201_1",
        title: "Documento reenviado",
        description: "Novo envio disparado para tentar revalidacao antes da sessao.",
        occurredAtLabel: "Hoje · 11:48",
        actorLabel: "Terapeuta"
      },
      {
        id: "timeline_doc_201_2",
        title: "Documento expirou",
        description: "A vigencia do aceite anterior encerrou e abriu bloqueio operacional.",
        occurredAtLabel: "Hoje · 08:00",
        actorLabel: "Sistema"
      }
    ]
  },
  {
    id: "doc_301",
    code: "DOC-2026-301",
    patientId: "patient_julia_prado",
    patientName: "Julia Prado",
    patientContactLabel: "julia.prado@email.com · (11) 95555-4414",
    documentType: "therapy_contract",
    documentTitle: "Contrato terapeutico",
    templateVersion: "v1.1",
    generatedAtIso: "2026-03-29T14:05:00-03:00",
    generatedAtLabel: "Gerado em 29 Mar 2026",
    lastSentAtLabel: "Enviado ontem · 14:08",
    lastEventAtIso: "2026-03-29T14:08:00-03:00",
    lastEventAtLabel: "Ontem · 14:08",
    lastEventLabel: "Aguardando responsavel legal",
    sessionContextLabel: "Convite inicial de menor de idade",
    deliveryChannelLabel: "E-mail",
    fileReferenceLabel: "Arquivo PDF versionado no storage gerenciado",
    signatureStatus: "pending",
    signatureStatusLabel: "Pendente",
    consentStatus: "pending",
    consentStatusLabel: "Pendente",
    criticality: "attention",
    criticalityLabel: "Precisa concluir antes da ativacao",
    criticalReason: "Como menor de idade, a assinatura precisa vir do responsavel legal.",
    signedByLabel: "Aguardando mae responsavel",
    legalRepresentativeLabel: "Mae responsavel cadastrada",
    blockedFlowLabels: ["Ativacao completa do paciente"],
    canResend: true,
    canRevoke: true,
    canGenerateNewVersion: true,
    previewSections: [
      {
        title: "Partes do contrato",
        body:
          "Identifica paciente e responsavel legal, incluindo regras de agendamento, faltas, pagamentos e contato."
      },
      {
        title: "Representacao legal",
        body:
          "Explica que o aceite do responsavel legal e o marco valido para liberar operacao com menor de idade."
      }
    ],
    operationalImpacts: [
      {
        id: "impact_doc_301_1",
        title: "Cadastro parcial",
        description: "Paciente segue como convidada ate concluir o aceite com o responsavel.",
        tone: "warning"
      }
    ],
    timeline: [
      {
        id: "timeline_doc_301_1",
        title: "Documento enviado",
        description: "Convite documental disparado para a responsavel legal.",
        occurredAtLabel: "Ontem · 14:08",
        actorLabel: "Sistema"
      }
    ]
  },
  {
    id: "doc_401",
    code: "DOC-2026-401",
    patientId: "patient_caio_oliveira",
    patientName: "Caio Oliveira",
    patientContactLabel: "caio.oliveira@email.com · (11) 94444-5515",
    documentType: "operational",
    documentTitle: "Politica de cancelamento",
    templateVersion: "v1.0",
    generatedAtIso: "2026-01-12T09:30:00-03:00",
    generatedAtLabel: "Gerado em 12 Jan 2026",
    lastSentAtLabel: "Assinado em 12 Jan · 10:02",
    lastEventAtIso: "2026-03-24T16:15:00-03:00",
    lastEventAtLabel: "24 Mar · 16:15",
    lastEventLabel: "Consentimento revogado",
    sessionContextLabel: "Politica operacional do consultorio",
    deliveryChannelLabel: "E-mail",
    fileReferenceLabel: "Arquivo PDF versionado no storage gerenciado",
    signatureStatus: "revoked",
    signatureStatusLabel: "Revogado",
    consentStatus: "revoked",
    consentStatusLabel: "Revogado",
    criticality: "attention",
    criticalityLabel: "Historico com consequencia operacional",
    criticalReason: "O historico precisa ser preservado e uma nova versao deve ser gerada se o fluxo for retomado.",
    signedByLabel: "Caio Oliveira",
    legalRepresentativeLabel: "Nao se aplica",
    blockedFlowLabels: ["Politica de faltas e remarcacoes"],
    canResend: false,
    canRevoke: false,
    canGenerateNewVersion: true,
    previewSections: [
      {
        title: "Escopo da politica",
        body:
          "Registra janelas de remarcacao, faltas, atrasos e organizacao operacional sem carregar conteudo clinico narrativo."
      },
      {
        title: "Revogacao",
        body:
          "A revogacao nao apaga o historico anterior e exige nova apresentacao documental se o fluxo voltar a ser utilizado."
      }
    ],
    operationalImpacts: [
      {
        id: "impact_doc_401_1",
        title: "Historico preservado",
        description: "Documento segue rastreavel mesmo apos a revogacao.",
        tone: "info"
      },
      {
        id: "impact_doc_401_2",
        title: "Nova versao necessaria",
        description: "Para retomar o paciente ativo, gere novo documento antes do retorno.",
        tone: "warning"
      }
    ],
    timeline: [
      {
        id: "timeline_doc_401_1",
        title: "Consentimento revogado",
        description: "Paciente solicitou descontinuidade do aceite operacional anterior.",
        occurredAtLabel: "24 Mar · 16:15",
        actorLabel: "Terapeuta"
      },
      {
        id: "timeline_doc_401_2",
        title: "Documento assinado",
        description: "Aceite registrado no onboarding documental do paciente.",
        occurredAtLabel: "12 Jan · 10:02",
        actorLabel: "Paciente"
      }
    ]
  }
];

const templateCatalog: DocumentsListResponse["templateOptions"] = [
  {
    documentType: "lgpd",
    label: "Termo LGPD do paciente",
    description: "Base minima de tratamento de dados pessoais e operacao do consultorio.",
    defaultVersion: "v1.2",
    versionOptions: ["v1.2", "v1.1"]
  },
  {
    documentType: "telehealth",
    label: "Termo de teleatendimento",
    description: "Regras de atendimento online, ambiente privado e estabilidade da sessao.",
    defaultVersion: "v2.3",
    versionOptions: ["v2.3", "v2.2"]
  },
  {
    documentType: "transcript_ai",
    label: "Termo de transcript e IA documental",
    description: "Habilita fluxo assistido opcional de transcript e rascunho pos-sessao.",
    defaultVersion: "v1.4",
    versionOptions: ["v1.4", "v1.3"]
  },
  {
    documentType: "therapy_contract",
    label: "Contrato terapeutico",
    description: "Acordos operacionais do acompanhamento e regras de relacao terapêutica.",
    defaultVersion: "v1.1",
    versionOptions: ["v1.1"]
  },
  {
    documentType: "operational",
    label: "Documento operacional",
    description: "Comprovantes e politicas operacionais vinculadas ao consultorio.",
    defaultVersion: "v1.0",
    versionOptions: ["v1.0"]
  }
];

@Injectable()
export class DocumentsService {
  private readonly documentsByEmail = new Map<string, DocumentRecord[]>();

  listDocuments(
    session: AuthSession,
    query: Partial<Record<string, string>>
  ): DocumentsListResponse {
    const records = this.getRecordsForSession(session);
    const filters: DocumentsListFilters = {
      search: query.search?.trim() ?? "",
      patientId: query.patientId?.trim() ?? "",
      documentType: this.isDocumentTypeFilter(query.documentType) ? query.documentType : "all",
      signatureStatus: this.isSignatureStatusFilter(query.signatureStatus)
        ? query.signatureStatus
        : "all",
      consentStatus: this.isConsentStatusFilter(query.consentStatus) ? query.consentStatus : "all",
      criticality: this.isCriticalityFilter(query.criticality) ? query.criticality : "all",
      onlyCritical: query.onlyCritical === "true",
      thisWeekOnly: query.thisWeekOnly === "true",
      onlyRevoked: query.onlyRevoked === "true"
    };

    const filtered = records
      .filter((record) => this.matchesFilters(record, filters))
      .sort((left, right) => this.priorityWeight(right) - this.priorityWeight(left));

    const page = Math.max(Number(query.page ?? "1") || 1, 1);
    const pageSize = [25, 50, 100].includes(Number(query.pageSize)) ? Number(query.pageSize) : 25;
    const start = (page - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize).map((record) => this.toListItem(record));

    return {
      summary: {
        criticalCount: records.filter((record) => record.criticality === "critical").length,
        pendingSignatureCount: records.filter((record) => record.signatureStatus === "pending").length,
        revokedCount: records.filter((record) => record.signatureStatus === "revoked" || record.consentStatus === "revoked").length,
        affectedPatientsLabel: `${new Set(records.filter((record) => record.criticality !== "normal").map((record) => record.patientId)).size} pacientes com impacto`
      },
      items: pageItems,
      total: filtered.length,
      page,
      pageSize,
      filters,
      availablePageSizes: [25, 50, 100],
      patientOptions: this.getPatientOptions(records),
      templateOptions: templateCatalog
    };
  }

  getDocumentDetail(session: AuthSession, documentId: string): DocumentDetail {
    const record = this.getRecord(session, documentId);

    return this.toDetail(record);
  }

  createDocument(session: AuthSession, input: DocumentCreateRequest): DocumentCreateResponse {
    const payload = documentCreateRequestSchema.parse(input);
    const records = this.getRecordsForSession(session);
    const timestamp = Date.now();
    const template = templateCatalog.find((item) => item.documentType === payload.documentType);
    const patient = this.findPatientContext(payload.patientId);
    const title = template?.label ?? "Documento";
    const documentId = `doc_${timestamp}`;
    const generatedLabel = "Gerado agora";
    const eventLabel = payload.deliveryChannel === "email" ? "Enviado por e-mail" : "Documento gerado";
    const criticality = payload.documentType === "telehealth" ? "critical" : payload.documentType === "transcript_ai" ? "attention" : "normal";
    const consentStatus = payload.documentType === "operational" ? "not_applicable" : "pending";
    const blockedFlowLabels =
      payload.documentType === "telehealth"
        ? ["Teleatendimento ate aceite"]
        : payload.documentType === "transcript_ai"
          ? ["Transcript e IA documental"]
          : [];

    const record: DocumentRecord = {
      id: documentId,
      code: `DOC-${new Date().getFullYear()}-${String(records.length + 1).padStart(3, "0")}`,
      patientId: patient.patientId,
      patientName: patient.patientName,
      patientContactLabel: patient.patientContactLabel,
      documentType: payload.documentType,
      documentTitle: title,
      templateVersion: payload.templateVersion,
      generatedAtIso: new Date(timestamp).toISOString(),
      generatedAtLabel: generatedLabel,
      lastSentAtLabel: "Enviado agora",
      lastEventAtIso: new Date(timestamp).toISOString(),
      lastEventAtLabel: "Agora",
      lastEventLabel: eventLabel,
      sessionContextLabel: patient.sessionContextLabel,
      deliveryChannelLabel: "E-mail",
      fileReferenceLabel: "Arquivo PDF versionado no storage gerenciado",
      signatureStatus: "pending",
      signatureStatusLabel: "Pendente",
      consentStatus,
      consentStatusLabel: consentStatus === "not_applicable" ? "Nao aplicavel" : "Pendente",
      criticality,
      criticalityLabel:
        criticality === "critical"
          ? "Pode bloquear operacao"
          : criticality === "attention"
            ? "Afeta capability"
            : "Sem bloqueio",
      criticalReason:
        criticality === "critical"
          ? "Documento novo de teleatendimento aguarda aceite antes de liberar a sessao."
          : criticality === "attention"
            ? "A capability opcional depende do aceite do paciente."
            : "Documento operacional registrado sem bloqueio clinico direto.",
      signedByLabel: "Aguardando assinatura do paciente",
      legalRepresentativeLabel: patient.legalRepresentativeLabel,
      blockedFlowLabels,
      canResend: true,
      canRevoke: true,
      canGenerateNewVersion: true,
      previewSections: [
        {
          title: "Documento gerado",
          body:
            "Versao criada a partir do catalogo padrao da plataforma, pronta para evoluir para provider real de assinatura."
        },
        {
          title: "Canal de envio",
          body: "Neste MVP visual o envio segue por e-mail com trilha operacional rastreavel."
        }
      ],
      operationalImpacts: [
        {
          id: `impact_${documentId}_1`,
          title: "Fluxo em acompanhamento",
          description: "O documento aparece na lista operacional imediatamente apos a geracao.",
          tone: criticality === "normal" ? "info" : "warning"
        }
      ],
      timeline: [
        {
          id: `timeline_${documentId}_1`,
          title: "Documento gerado",
          description: "Novo documento criado manualmente na area documental.",
          occurredAtLabel: "Agora",
          actorLabel: "Terapeuta"
        },
        {
          id: `timeline_${documentId}_2`,
          title: "Documento enviado",
          description: "Link de assinatura disparado para o paciente pelo canal selecionado.",
          occurredAtLabel: "Agora",
          actorLabel: "Sistema"
        }
      ]
    };

    records.unshift(record);

    return {
      documentId,
      redirectTo: `/app/documents/${documentId}`
    };
  }

  resendDocument(session: AuthSession, documentId: string): DocumentDetail {
    const record = this.getRecord(session, documentId);

    record.lastEventAtIso = new Date().toISOString();
    record.lastEventAtLabel = "Agora";
    record.lastSentAtLabel = "Reenviado agora";
    record.lastEventLabel = "Documento reenviado";
    record.canResend = record.signatureStatus === "pending" || record.signatureStatus === "expired";
    record.timeline.unshift({
      id: `timeline_${documentId}_${record.timeline.length + 1}`,
      title: "Documento reenviado",
      description: "Novo link enviado para reduzir atraso na conclusao documental.",
      occurredAtLabel: "Agora",
      actorLabel: "Terapeuta"
    });

    return this.toDetail(record);
  }

  revokeDocument(session: AuthSession, documentId: string): DocumentDetail {
    const record = this.getRecord(session, documentId);

    record.signatureStatus = "revoked";
    record.signatureStatusLabel = "Revogado";
    if (record.consentStatus !== "not_applicable") {
      record.consentStatus = "revoked";
      record.consentStatusLabel = "Revogado";
    }
    record.criticality = "attention";
    record.criticalityLabel = "Historico preservado";
    record.criticalReason =
      "A revogacao foi registrada e o historico permanece auditavel. Gere nova versao para retomar o fluxo.";
    record.lastEventAtIso = new Date().toISOString();
    record.lastEventAtLabel = "Agora";
    record.lastEventLabel = "Consentimento revogado";
    record.canResend = false;
    record.canRevoke = false;
    record.timeline.unshift({
      id: `timeline_${documentId}_${record.timeline.length + 1}`,
      title: "Consentimento revogado",
      description: "Revogacao registrada pelo terapeuta para refletir o estado operacional atual.",
      occurredAtLabel: "Agora",
      actorLabel: "Terapeuta"
    });

    return this.toDetail(record);
  }

  signDocument(session: AuthSession, documentId: string): DocumentDetail {
    const record = this.getRecord(session, documentId);

    record.signatureStatus = "signed";
    record.signatureStatusLabel = "Assinado";
    if (record.consentStatus !== "not_applicable") {
      record.consentStatus = "valid";
      record.consentStatusLabel = "Valido";
    }
    record.criticality = "normal";
    record.criticalityLabel = "Sem bloqueio";
    record.criticalReason = "Documento vigente e consentimento validado para o contexto atual.";
    record.lastEventAtIso = new Date().toISOString();
    record.lastEventAtLabel = "Agora";
    record.lastEventLabel = "Documento assinado";
    record.signedByLabel =
      record.legalRepresentativeLabel === "Nao se aplica"
        ? record.patientName
        : record.legalRepresentativeLabel;
    record.blockedFlowLabels = [];
    record.canResend = false;
    record.timeline.unshift({
      id: `timeline_${documentId}_${record.timeline.length + 1}`,
      title: "Documento assinado",
      description: "Aceite simulado para apoiar a avaliacao visual do fluxo.",
      occurredAtLabel: "Agora",
      actorLabel: "Paciente"
    });

    return this.toDetail(record);
  }

  private getRecordsForSession(session: AuthSession) {
    const key = session.therapist.email;

    if (!this.documentsByEmail.has(key)) {
      this.documentsByEmail.set(
        key,
        seedDocuments.map((record) => ({
          ...record,
          blockedFlowLabels: [...record.blockedFlowLabels],
          previewSections: [...record.previewSections],
          operationalImpacts: [...record.operationalImpacts],
          timeline: [...record.timeline]
        }))
      );
    }

    return this.documentsByEmail.get(key) ?? [];
  }

  private getRecord(session: AuthSession, documentId: string) {
    const record = this.getRecordsForSession(session).find((item) => item.id === documentId);

    if (!record) {
      throw new NotFoundException("Documento nao encontrado.");
    }

    return record;
  }

  private matchesFilters(record: DocumentRecord, filters: DocumentsListFilters) {
    const query = filters.search.toLowerCase();
    const matchesQuery =
      query.length === 0 ||
      `${record.patientName} ${record.code} ${record.documentTitle}`.toLowerCase().includes(query);
    const matchesPatient = filters.patientId.length === 0 || record.patientId === filters.patientId;
    const matchesType = filters.documentType === "all" || record.documentType === filters.documentType;
    const matchesSignature =
      filters.signatureStatus === "all" || record.signatureStatus === filters.signatureStatus;
    const matchesConsent =
      filters.consentStatus === "all" || record.consentStatus === filters.consentStatus;
    const matchesCriticality =
      filters.criticality === "all" || record.criticality === filters.criticality;
    const matchesOnlyCritical = !filters.onlyCritical || record.criticality === "critical";
    const matchesThisWeek =
      !filters.thisWeekOnly || Date.parse(record.lastEventAtIso) >= Date.parse("2026-03-24T00:00:00-03:00");
    const matchesRevoked =
      !filters.onlyRevoked ||
      record.signatureStatus === "revoked" ||
      record.consentStatus === "revoked";

    return (
      matchesQuery &&
      matchesPatient &&
      matchesType &&
      matchesSignature &&
      matchesConsent &&
      matchesCriticality &&
      matchesOnlyCritical &&
      matchesThisWeek &&
      matchesRevoked
    );
  }

  private toListItem(record: DocumentRecord): DocumentListItem {
    return {
      id: record.id,
      code: record.code,
      patientId: record.patientId,
      patientName: record.patientName,
      patientHref: `/app/patients/${record.patientId}`,
      documentType: record.documentType,
      documentTitle: record.documentTitle,
      templateVersion: record.templateVersion,
      generatedAtLabel: record.generatedAtLabel,
      signatureStatus: record.signatureStatus,
      signatureStatusLabel: record.signatureStatusLabel,
      consentStatus: record.consentStatus,
      consentStatusLabel: record.consentStatusLabel,
      lastEventAtLabel: record.lastEventAtLabel,
      lastEventLabel: record.lastEventLabel,
      criticality: record.criticality,
      criticalityLabel: record.criticalityLabel,
      criticalReason: record.criticalReason,
      signedByLabel: record.signedByLabel,
      blockedFlowLabels: record.blockedFlowLabels,
      canResend: record.canResend,
      canGenerateNewVersion: record.canGenerateNewVersion,
      openHref: `/app/documents/${record.id}`
    };
  }

  private toDetail(record: DocumentRecord): DocumentDetail {
    return {
      id: record.id,
      code: record.code,
      patientId: record.patientId,
      patientName: record.patientName,
      patientHref: `/app/patients/${record.patientId}`,
      patientContactLabel: record.patientContactLabel,
      documentType: record.documentType,
      documentTitle: record.documentTitle,
      templateVersion: record.templateVersion,
      generatedAtLabel: record.generatedAtLabel,
      lastSentAtLabel: record.lastSentAtLabel,
      lastEventAtLabel: record.lastEventAtLabel,
      lastEventLabel: record.lastEventLabel,
      sessionContextLabel: record.sessionContextLabel,
      deliveryChannelLabel: record.deliveryChannelLabel,
      fileReferenceLabel: record.fileReferenceLabel,
      signatureStatus: record.signatureStatus,
      signatureStatusLabel: record.signatureStatusLabel,
      consentStatus: record.consentStatus,
      consentStatusLabel: record.consentStatusLabel,
      criticality: record.criticality,
      criticalityLabel: record.criticalityLabel,
      criticalReason: record.criticalReason,
      signedByLabel: record.signedByLabel,
      legalRepresentativeLabel: record.legalRepresentativeLabel,
      blockedFlowLabels: record.blockedFlowLabels,
      previewSections: record.previewSections,
      operationalImpacts: record.operationalImpacts,
      timeline: record.timeline,
      primaryActions: {
        canResend: record.canResend,
        canRevoke: record.canRevoke,
        canGenerateNewVersion: record.canGenerateNewVersion
      },
      nextGenerationDefaults: {
        patientId: record.patientId,
        documentType: record.documentType,
        templateVersion: record.templateVersion,
        deliveryChannel: "email"
      }
    };
  }

  private getPatientOptions(records: DocumentRecord[]) {
    return [...new Map(records.map((record) => [record.patientId, record.patientName])).entries()].map(
      ([value, label]) => ({
        value,
        label
      })
    );
  }

  private findPatientContext(patientId: string) {
    const fallback = seedDocuments.find((record) => record.patientId === patientId);

    if (!fallback) {
      return {
        patientId,
        patientName: "Paciente novo",
        patientContactLabel: "contato pendente",
        sessionContextLabel: "Contexto operacional a definir",
        legalRepresentativeLabel: "Nao se aplica"
      };
    }

    return {
      patientId: fallback.patientId,
      patientName: fallback.patientName,
      patientContactLabel: fallback.patientContactLabel,
      sessionContextLabel: fallback.sessionContextLabel,
      legalRepresentativeLabel: fallback.legalRepresentativeLabel
    };
  }

  private priorityWeight(record: DocumentRecord) {
    const criticalityWeight = {
      normal: 1,
      attention: 2,
      critical: 4
    } satisfies Record<DocumentCriticality, number>;
    const signatureWeight = {
      not_sent: 0,
      pending: 2,
      signed: 0,
      expired: 3,
      revoked: 3
    } satisfies Record<DocumentSignatureStatus, number>;

    return criticalityWeight[record.criticality] + signatureWeight[record.signatureStatus];
  }

  private isDocumentTypeFilter(value: string | undefined): value is DocumentsListFilters["documentType"] {
    return ["all", "lgpd", "telehealth", "transcript_ai", "therapy_contract", "operational"].includes(
      value ?? ""
    );
  }

  private isSignatureStatusFilter(
    value: string | undefined
  ): value is DocumentsListFilters["signatureStatus"] {
    return ["all", "not_sent", "pending", "signed", "expired", "revoked"].includes(value ?? "");
  }

  private isConsentStatusFilter(
    value: string | undefined
  ): value is DocumentsListFilters["consentStatus"] {
    return ["all", "valid", "pending", "revoked", "not_applicable"].includes(value ?? "");
  }

  private isCriticalityFilter(value: string | undefined): value is DocumentsListFilters["criticality"] {
    return ["all", "normal", "attention", "critical"].includes(value ?? "");
  }
}
