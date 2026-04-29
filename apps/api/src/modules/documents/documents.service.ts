// apps/api/src/modules/documents/documents.service.ts
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type {
  AuthSession,
  DocumentConsentStatus,
  DocumentCreateRequest,
  DocumentCreateResponse,
  DocumentCriticality,
  DocumentDetail,
  DocumentListItem,
  DocumentSignatureStatus,
  DocumentsListFilters,
  DocumentsListResponse,
  DocumentType
} from "@terapia/contracts";
import { documentCreateRequestSchema } from "@terapia/contracts";

import { buildMockDocumentDetail, buildMockDocumentsList, isMockEmail } from "@/modules/mock";
import type { DocumentEventRow, DocumentWithPatient } from "./documents.repository";
import { DocumentsRepository } from "./documents.repository";

// ---------------------------------------------------------------------------
// Internal enriched type
// ---------------------------------------------------------------------------

type DocRecord = DocumentWithPatient & {
  events: DocumentEventRow[];
};

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const PT_MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

function formatTimestamp(ts: Date): string {
  const m = ts.getMonth();
  return `${ts.getDate()} ${PT_MONTHS[m] ?? ""} ${ts.getFullYear()} · ${String(ts.getHours()).padStart(2, "0")}:${String(ts.getMinutes()).padStart(2, "0")}`;
}

function generatedAtLabel(ts: Date): string {
  return `Gerado em ${ts.getDate()} ${PT_MONTHS[ts.getMonth()] ?? ""} ${ts.getFullYear()}`;
}

const documentTypeTitles: Record<string, string> = {
  lgpd: "Termo LGPD do paciente",
  telehealth: "Termo de teleatendimento",
  transcript_ai: "Termo de transcript e IA documental",
  therapy_contract: "Contrato terapêutico",
  operational: "Documento operacional"
};

const eventTitles: Record<string, string> = {
  generated: "Documento gerado",
  sent: "Documento enviado",
  signed: "Documento assinado",
  revoked: "Consentimento revogado",
  expired: "Documento expirou",
  resent: "Documento reenviado"
};

function docTitle(documentType: string): string {
  return documentTypeTitles[documentType] ?? "Documento";
}

function criticalityLabel(criticality: string): string {
  return (
    { normal: "Sem bloqueio", attention: "Acompanha operação", critical: "Bloqueia sessão online" }[
      criticality
    ] ?? criticality
  );
}

function sigStatusLabel(s: string): string {
  return (
    {
      not_sent: "Não enviado",
      pending: "Pendente",
      signed: "Assinado",
      expired: "Expirado",
      revoked: "Revogado"
    }[s] ?? s
  );
}

function conStatusLabel(s: string): string {
  return (
    { valid: "Válido", pending: "Pendente", revoked: "Revogado", not_applicable: "Não aplicável" }[s] ?? s
  );
}

function blockedFlowLabels(documentType: string, signatureStatus: string): string[] {
  if (signatureStatus === "signed") return [];
  if (documentType === "telehealth") return ["Teleatendimento"];
  if (documentType === "transcript_ai") return ["Transcript e IA documental"];
  if (documentType === "therapy_contract") return ["Ativação completa do paciente"];
  return [];
}

function buildPreviewSections(documentType: string): DocumentDetail["previewSections"] {
  const sections: Record<string, { title: string; body: string }[]> = {
    lgpd: [
      {
        title: "Base legal do tratamento",
        body: "Registra as bases legais para tratamento de dados pessoais no contexto clínico, incluindo dados sensíveis de saúde."
      },
      {
        title: "Direitos do titular",
        body: "Informa os direitos de acesso, correção, exclusão e portabilidade, bem como o contato do DPO responsável."
      }
    ],
    telehealth: [
      {
        title: "Escopo do consentimento",
        body: "Autoriza a realização de sessões por videochamada na plataforma, incluindo regras de confidencialidade e reconexão."
      },
      {
        title: "Condições de uso",
        body: "Explica responsabilidade de ambiente privado, orientações de segurança e como a sessão pode ser interrompida."
      }
    ],
    transcript_ai: [
      {
        title: "Escopo do uso de IA",
        body: "Define que transcript e rascunho documental são capacidades opcionais e condicionadas ao aceite do paciente."
      },
      {
        title: "Descarte e processamento",
        body: "Indica processamento com direção Brasil-first e descarte técnico de transcript bruto após a janela operacional."
      }
    ],
    therapy_contract: [
      {
        title: "Partes do contrato",
        body: "Identifica paciente e responsável legal, incluindo regras de agendamento, faltas, pagamentos e contato."
      },
      {
        title: "Representação legal",
        body: "Explica que o aceite do responsável legal é o marco válido para liberar operação com menor de idade."
      }
    ],
    operational: [
      {
        title: "Escopo da política",
        body: "Registra janelas de remarcação, faltas, atrasos e organização operacional sem carregar conteúdo clínico narrativo."
      }
    ]
  };
  return sections[documentType] ?? [{ title: "Documento gerado", body: "Versão criada a partir do catálogo padrão da plataforma." }];
}

function buildOperationalImpacts(doc: DocumentWithPatient): DocumentDetail["operationalImpacts"] {
  if (doc.signatureStatus === "signed") {
    return [
      {
        id: `impact_${doc.id}_signed`,
        title: `${docTitle(doc.documentType)} ativo`,
        description: "Documento vigente e consentimento validado.",
        tone: "success"
      }
    ];
  }

  if (doc.criticality === "critical") {
    return [
      {
        id: `impact_${doc.id}_1`,
        title: "Entrada na sala bloqueada",
        description: "O paciente não deve entrar na call até novo aceite.",
        tone: "critical"
      },
      {
        id: `impact_${doc.id}_2`,
        title: "Reenvio disponível",
        description: "Use o botão de reenvio para disparar novo link ao paciente.",
        tone: "warning"
      }
    ];
  }

  if (doc.criticality === "attention") {
    return [
      {
        id: `impact_${doc.id}_1`,
        title: "Funcionalidade em espera",
        description: "O fluxo associado fica desativado até o aceite do paciente.",
        tone: "warning"
      }
    ];
  }

  return [
    {
      id: `impact_${doc.id}_1`,
      title: "Documento operacional registrado",
      description: "Nenhum bloqueio clínico direto.",
      tone: "info"
    }
  ];
}

// ---------------------------------------------------------------------------
// Template catalog (static — not stored in DB)
// ---------------------------------------------------------------------------

const templateCatalog: DocumentsListResponse["templateOptions"] = [
  {
    documentType: "lgpd",
    label: "Termo LGPD do paciente",
    description: "Base mínima de tratamento de dados pessoais e operação do consultório.",
    defaultVersion: "v1.2",
    versionOptions: ["v1.2", "v1.1"]
  },
  {
    documentType: "telehealth",
    label: "Termo de teleatendimento",
    description: "Regras de atendimento online, ambiente privado e estabilidade da sessão.",
    defaultVersion: "v2.3",
    versionOptions: ["v2.3", "v2.2"]
  },
  {
    documentType: "transcript_ai",
    label: "Termo de transcript e IA documental",
    description: "Habilita fluxo assistido opcional de transcript e rascunho pós-sessão.",
    defaultVersion: "v1.4",
    versionOptions: ["v1.4", "v1.3"]
  },
  {
    documentType: "therapy_contract",
    label: "Contrato terapêutico",
    description: "Acordos operacionais do acompanhamento e regras de relação terapêutica.",
    defaultVersion: "v1.1",
    versionOptions: ["v1.1"]
  },
  {
    documentType: "operational",
    label: "Documento operacional",
    description: "Comprovantes e políticas operacionais vinculadas ao consultório.",
    defaultVersion: "v1.0",
    versionOptions: ["v1.0"]
  }
];

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(DocumentsRepository) private readonly repo: DocumentsRepository
  ) {}

  async listDocuments(
    session: AuthSession,
    query: Partial<Record<string, string>>
  ): Promise<DocumentsListResponse> {
    if (isMockEmail(session.therapist.email)) return buildMockDocumentsList(query);

    const docs = await this.repo.listWithPatient(session.tenant.id);
    const allEvents = await this.repo.listEventsForDocuments(docs.map((d) => d.id));

    const eventsByDoc = new Map<string, DocumentEventRow[]>();
    for (const ev of allEvents) {
      const list = eventsByDoc.get(ev.documentId) ?? [];
      list.push(ev);
      eventsByDoc.set(ev.documentId, list);
    }

    const records: DocRecord[] = docs.map((d) => ({ ...d, events: eventsByDoc.get(d.id) ?? [] }));

    const filters: DocumentsListFilters = {
      search: query.search?.trim() ?? "",
      patientId: query.patientId?.trim() ?? "",
      documentType: this.isDocTypeFilter(query.documentType) ? query.documentType : "all",
      signatureStatus: this.isSigStatusFilter(query.signatureStatus) ? query.signatureStatus : "all",
      consentStatus: this.isConStatusFilter(query.consentStatus) ? query.consentStatus : "all",
      criticality: this.isCriticalityFilter(query.criticality) ? query.criticality : "all",
      onlyCritical: query.onlyCritical === "true",
      thisWeekOnly: query.thisWeekOnly === "true",
      onlyRevoked: query.onlyRevoked === "true"
    };

    const filtered = records
      .filter((r) => this.matchesFilters(r, filters))
      .sort((a, b) => this.priorityWeight(b) - this.priorityWeight(a));

    const page = Math.max(Number(query.page ?? "1") || 1, 1);
    const pageSize = [25, 50, 100].includes(Number(query.pageSize)) ? Number(query.pageSize) : 25;
    const start = (page - 1) * pageSize;

    const patientOptions = [
      ...new Map(records.map((r) => [r.patientId, r.patientName])).entries()
    ].map(([value, label]) => ({ value, label }));

    return {
      summary: {
        criticalCount: records.filter((r) => r.criticality === "critical").length,
        pendingSignatureCount: records.filter((r) => r.signatureStatus === "pending").length,
        revokedCount: records.filter(
          (r) => r.signatureStatus === "revoked" || r.consentStatus === "revoked"
        ).length,
        affectedPatientsLabel: `${new Set(records.filter((r) => r.criticality !== "normal").map((r) => r.patientId)).size} pacientes com impacto`
      },
      items: filtered.slice(start, start + pageSize).map((r) => this.toListItem(r)),
      total: filtered.length,
      page,
      pageSize,
      filters,
      availablePageSizes: [25, 50, 100],
      patientOptions,
      templateOptions: templateCatalog
    };
  }

  async getDocumentDetail(session: AuthSession, documentId: string): Promise<DocumentDetail> {
    if (isMockEmail(session.therapist.email)) {
      const mock = buildMockDocumentDetail(documentId);
      if (mock) return mock;
      throw new NotFoundException("Documento não encontrado.");
    }

    const doc = await this.repo.findByIdWithPatient(session.tenant.id, documentId);
    if (!doc) throw new NotFoundException("Documento não encontrado.");

    const events = await this.repo.listEvents(documentId);
    return this.toDetail({ ...doc, events });
  }

  async createDocument(session: AuthSession, input: DocumentCreateRequest): Promise<DocumentCreateResponse> {
    const payload = documentCreateRequestSchema.parse(input);
    const count = await this.repo.countForTenant(session.tenant.id);
    const code = `DOC-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    const criticality =
      payload.documentType === "telehealth"
        ? "critical"
        : payload.documentType === "transcript_ai"
          ? "attention"
          : "normal";

    const consentStatus =
      payload.documentType === "operational" ? "not_applicable" : "pending";

    const criticalReason =
      criticality === "critical"
        ? "Documento novo de teleatendimento aguarda aceite antes de liberar a sessão."
        : criticality === "attention"
          ? "A funcionalidade opcional depende do aceite do paciente."
          : "Documento operacional registrado sem bloqueio clínico direto.";

    const doc = await this.repo.create({
      tenantId: session.tenant.id,
      patientId: payload.patientId,
      appointmentId: "",
      code,
      documentType: payload.documentType,
      templateVersion: payload.templateVersion,
      deliveryChannel: payload.deliveryChannel ?? "email",
      signatureStatus: "pending",
      consentStatus,
      criticality,
      criticalReason
    });

    await this.repo.addEvent({
      documentId: doc.id,
      eventType: "generated",
      actorType: "therapist",
      actorId: session.therapist.id,
      description: "Novo documento criado manualmente na área documental."
    });

    if (payload.deliveryChannel === "email") {
      await this.repo.addEvent({
        documentId: doc.id,
        eventType: "sent",
        actorType: "system",
        actorId: "system",
        description: "Link de assinatura disparado para o paciente por e-mail."
      });
    }

    return { documentId: doc.id, redirectTo: `/app/documents/${doc.id}` };
  }

  async resendDocument(session: AuthSession, documentId: string): Promise<DocumentDetail> {
    const doc = await this.repo.findByIdWithPatient(session.tenant.id, documentId);
    if (!doc) throw new NotFoundException("Documento não encontrado.");

    await this.repo.update(documentId, { lastSentAt: new Date(), lastEventAt: new Date() });

    await this.repo.addEvent({
      documentId,
      eventType: "resent",
      actorType: "therapist",
      actorId: session.therapist.id,
      description: "Novo link enviado para reduzir atraso na conclusão documental."
    });

    const updated = await this.repo.findByIdWithPatient(session.tenant.id, documentId);
    const events = await this.repo.listEvents(documentId);
    return this.toDetail({ ...updated!, events });
  }

  async revokeDocument(session: AuthSession, documentId: string): Promise<DocumentDetail> {
    const doc = await this.repo.findByIdWithPatient(session.tenant.id, documentId);
    if (!doc) throw new NotFoundException("Documento não encontrado.");

    await this.repo.update(documentId, {
      signatureStatus: "revoked",
      consentStatus: doc.consentStatus !== "not_applicable" ? "revoked" : doc.consentStatus,
      criticality: "attention",
      criticalReason: "A revogação foi registrada e o histórico permanece auditável. Gere nova versão para retomar o fluxo.",
      revokedAt: new Date(),
      lastEventAt: new Date()
    });

    await this.repo.addEvent({
      documentId,
      eventType: "revoked",
      actorType: "therapist",
      actorId: session.therapist.id,
      description: "Revogação registrada pelo terapeuta para refletir o estado operacional atual."
    });

    const updated = await this.repo.findByIdWithPatient(session.tenant.id, documentId);
    const events = await this.repo.listEvents(documentId);
    return this.toDetail({ ...updated!, events });
  }

  async signDocument(session: AuthSession, documentId: string): Promise<DocumentDetail> {
    const doc = await this.repo.findByIdWithPatient(session.tenant.id, documentId);
    if (!doc) throw new NotFoundException("Documento não encontrado.");

    await this.repo.update(documentId, {
      signatureStatus: "signed",
      consentStatus: doc.consentStatus !== "not_applicable" ? "valid" : doc.consentStatus,
      criticality: "normal",
      criticalReason: "Documento vigente e consentimento validado para o contexto atual.",
      signedByLabel: doc.patientName,
      lastEventAt: new Date()
    });

    await this.repo.addEvent({
      documentId,
      eventType: "signed",
      actorType: "patient",
      actorId: doc.patientId,
      description: "Aceite confirmado pela paciente no fluxo de assinatura."
    });

    const updated = await this.repo.findByIdWithPatient(session.tenant.id, documentId);
    const events = await this.repo.listEvents(documentId);
    return this.toDetail({ ...updated!, events });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private matchesFilters(record: DocRecord, filters: DocumentsListFilters): boolean {
    const query = filters.search.toLowerCase();
    const matchesQuery =
      query.length === 0 ||
      `${record.patientName} ${record.code} ${docTitle(record.documentType)}`.toLowerCase().includes(query);
    const matchesPatient = filters.patientId.length === 0 || record.patientId === filters.patientId;
    const matchesType = filters.documentType === "all" || record.documentType === filters.documentType;
    const matchesSig = filters.signatureStatus === "all" || record.signatureStatus === filters.signatureStatus;
    const matchesConsent = filters.consentStatus === "all" || record.consentStatus === filters.consentStatus;
    const matchesCriticality = filters.criticality === "all" || record.criticality === filters.criticality;
    const matchesOnlyCritical = !filters.onlyCritical || record.criticality === "critical";

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const matchesThisWeek =
      !filters.thisWeekOnly || (record.lastEventAt ? record.lastEventAt >= weekAgo : false);
    const matchesRevoked =
      !filters.onlyRevoked ||
      record.signatureStatus === "revoked" ||
      record.consentStatus === "revoked";

    return (
      matchesQuery &&
      matchesPatient &&
      matchesType &&
      matchesSig &&
      matchesConsent &&
      matchesCriticality &&
      matchesOnlyCritical &&
      matchesThisWeek &&
      matchesRevoked
    );
  }

  private toListItem(record: DocRecord): DocumentListItem {
    const latestEvent = record.events[0];

    return {
      id: record.id,
      code: record.code,
      patientId: record.patientId,
      patientName: record.patientName,
      patientHref: `/app/patients/${record.patientId}`,
      documentType: record.documentType as DocumentType,
      documentTitle: docTitle(record.documentType),
      templateVersion: record.templateVersion,
      generatedAtLabel: generatedAtLabel(record.generatedAt),
      signatureStatus: record.signatureStatus as DocumentSignatureStatus,
      signatureStatusLabel: sigStatusLabel(record.signatureStatus),
      consentStatus: record.consentStatus as DocumentConsentStatus,
      consentStatusLabel: conStatusLabel(record.consentStatus),
      lastEventAtLabel: latestEvent ? formatTimestamp(latestEvent.occurredAt) : "",
      lastEventLabel: latestEvent ? (eventTitles[latestEvent.eventType] ?? latestEvent.eventType) : "",
      criticality: record.criticality as DocumentCriticality,
      criticalityLabel: criticalityLabel(record.criticality),
      criticalReason: record.criticalReason,
      signedByLabel: record.signedByLabel,
      blockedFlowLabels: blockedFlowLabels(record.documentType, record.signatureStatus),
      canResend: record.signatureStatus === "pending" || record.signatureStatus === "expired",
      canGenerateNewVersion: true,
      openHref: `/app/documents/${record.id}`
    };
  }

  private toDetail(record: DocRecord): DocumentDetail {
    const latestEvent = record.events[0];
    const canResend = record.signatureStatus === "pending" || record.signatureStatus === "expired";
    const canRevoke = record.signatureStatus !== "revoked" && record.signatureStatus !== "signed";

    return {
      id: record.id,
      code: record.code,
      patientId: record.patientId,
      patientName: record.patientName,
      patientHref: `/app/patients/${record.patientId}`,
      patientContactLabel: `${record.patientEmail} · ${record.patientPhone}`,
      documentType: record.documentType as DocumentType,
      documentTitle: docTitle(record.documentType),
      templateVersion: record.templateVersion,
      generatedAtLabel: generatedAtLabel(record.generatedAt),
      lastSentAtLabel: record.lastSentAt
        ? `Enviado em ${formatTimestamp(record.lastSentAt)}`
        : "Não enviado",
      lastEventAtLabel: latestEvent ? formatTimestamp(latestEvent.occurredAt) : "",
      lastEventLabel: latestEvent ? (eventTitles[latestEvent.eventType] ?? latestEvent.eventType) : "",
      sessionContextLabel: "Atendimento registrado no sistema",
      deliveryChannelLabel: "E-mail",
      fileReferenceLabel: "Arquivo PDF versionado no storage gerenciado",
      signatureStatus: record.signatureStatus as DocumentSignatureStatus,
      signatureStatusLabel: sigStatusLabel(record.signatureStatus),
      consentStatus: record.consentStatus as DocumentConsentStatus,
      consentStatusLabel: conStatusLabel(record.consentStatus),
      criticality: record.criticality as DocumentCriticality,
      criticalityLabel: criticalityLabel(record.criticality),
      criticalReason: record.criticalReason,
      signedByLabel: record.signedByLabel || "Aguardando assinatura do paciente",
      legalRepresentativeLabel: "Não se aplica",
      blockedFlowLabels: blockedFlowLabels(record.documentType, record.signatureStatus),
      previewSections: buildPreviewSections(record.documentType),
      operationalImpacts: buildOperationalImpacts(record),
      timeline: record.events.map((ev) => ({
        id: ev.id,
        title: eventTitles[ev.eventType] ?? ev.eventType,
        description: ev.description,
        occurredAtLabel: formatTimestamp(ev.occurredAt),
        actorLabel: ev.actorType === "patient" ? "Paciente" : ev.actorType === "system" ? "Sistema" : "Terapeuta"
      })),
      primaryActions: {
        canResend,
        canRevoke,
        canGenerateNewVersion: true
      },
      nextGenerationDefaults: {
        patientId: record.patientId,
        documentType: record.documentType as DocumentType,
        templateVersion: record.templateVersion,
        deliveryChannel: "email" as const
      }
    };
  }

  private priorityWeight(record: DocRecord): number {
    const cw: Record<string, number> = { normal: 1, attention: 2, critical: 4 };
    const sw: Record<string, number> = { not_sent: 0, pending: 2, signed: 0, expired: 3, revoked: 3 };
    return (cw[record.criticality] ?? 0) + (sw[record.signatureStatus] ?? 0);
  }

  private isDocTypeFilter(v: string | undefined): v is DocumentsListFilters["documentType"] {
    return ["all", "lgpd", "telehealth", "transcript_ai", "therapy_contract", "operational"].includes(v ?? "");
  }

  private isSigStatusFilter(v: string | undefined): v is DocumentsListFilters["signatureStatus"] {
    return ["all", "not_sent", "pending", "signed", "expired", "revoked"].includes(v ?? "");
  }

  private isConStatusFilter(v: string | undefined): v is DocumentsListFilters["consentStatus"] {
    return ["all", "valid", "pending", "revoked", "not_applicable"].includes(v ?? "");
  }

  private isCriticalityFilter(v: string | undefined): v is DocumentsListFilters["criticality"] {
    return ["all", "normal", "attention", "critical"].includes(v ?? "");
  }
}
