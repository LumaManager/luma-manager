// apps/api/src/modules/patients/patients.service.ts
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type {
  AuthSession,
  PatientCreateRequest,
  PatientDetail,
  PatientFinancialState,
  PatientListFilters,
  PatientListResponse,
  PatientOperationalStatus
} from "@terapia/contracts";
import { patientCreateRequestSchema } from "@terapia/contracts";

import { buildMockPatientDetail, buildMockPatientList, isMockEmail } from "@/modules/mock";
import type { PatientWithMeta } from "./patients.repository";
import { PatientsRepository } from "./patients.repository";
import { AuditService } from "@/modules/audit/audit.service";

@Injectable()
export class PatientsService {
  constructor(
    @Inject(PatientsRepository) private readonly repo: PatientsRepository,
    @Inject(AuditService)       private readonly auditService: AuditService
  ) {}

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  async listPatients(
    session: AuthSession,
    query: Record<string, string>
  ): Promise<PatientListResponse> {
    if (isMockEmail(session.therapist.email)) return buildMockPatientList(query);

    const page = Math.max(Number(query.page ?? "1") || 1, 1);
    const pageSize = [25, 50, 100].includes(Number(query.pageSize))
      ? Number(query.pageSize)
      : 25;

    const filters: PatientListFilters = {
      query: query.query?.trim() ?? "",
      status: this.coerceStatus(query.status),
      documents: this.coerceDocuments(query.documents),
      financial: this.coerceFinancial(query.financial),
      upcomingOnly: query.upcomingOnly === "true",
      legalGuardianOnly: query.legalGuardianOnly === "true"
    };

    const { items, total } = await this.repo.list(session.therapist.id, {
      ...filters,
      page,
      pageSize
    });

    return {
      items: items.map((p) => this.toListItem(p)),
      total,
      page,
      pageSize,
      filters,
      availablePageSizes: [25, 50, 100]
    };
  }

  // ---------------------------------------------------------------------------
  // Detail
  // ---------------------------------------------------------------------------

  async getPatientDetail(session: AuthSession, patientId: string): Promise<PatientDetail> {
    if (isMockEmail(session.therapist.email)) {
      const mock = buildMockPatientDetail(patientId);
      if (mock) return mock;
      throw new NotFoundException("Paciente não encontrado.");
    }

    const p = await this.repo.findById(session.therapist.id, patientId);

    if (!p) throw new NotFoundException("Paciente não encontrado.");

    const docsState = this.docsState(p);
    const financialState = this.financialState(p);

    return {
      id: p.id,
      fullName: p.fullName,
      status: p.status as PatientOperationalStatus,
      ageLabel: this.ageLabel(p.birthDate),
      primaryContact: [p.email, p.phone].filter(Boolean).join(" · ") || "Sem contato",
      legalGuardianLabel: "Não se aplica",
      nextSessionLabel: this.nextSessionLabel(p),
      sessionStartLabel: this.formatDateLong(p.createdAt.toISOString()),
      totalSessionsLabel: `${p.completedSessionsCount ?? 0} sessões realizadas`,
      documentsState: docsState,
      financialState,
      clinicalReviewLabel: "Sem pendência",
      createdAtLabel: `Vínculo criado em ${this.formatDate(p.createdAt.toISOString())}`,
      paymentOriginLabel: p.paymentOrigin === "private" ? "Particular" : "Convênio",
      primaryAction: this.primaryAction(p),
      topActions: {
        scheduleHref: `/app/agenda?patientId=${p.id}`,
        clinicalRecordHref: `/app/patients/${p.id}/clinical-record`
      },
      overviewBlocks: [
        {
          title: "Resumo do vínculo",
          value: this.statusLabel(p.status),
          description: p.paymentOrigin === "private" ? "Atendimento particular." : "Convênio registrado no cadastro."
        },
        {
          title: "Próxima sessão",
          value: this.nextSessionLabel(p),
          description: p.nextSessionDate ? "Consulte a agenda para detalhes." : "Nenhuma sessão futura agendada."
        },
        {
          title: "Financeiro",
          value: financialState === "ok" ? "Sem pendências" : financialState === "open" ? `${p.openChargesCount} cobrança(s) em aberto` : `${p.overdueChargesCount} cobrança(s) vencida(s)`,
          description: financialState === "ok" ? "Nenhuma cobrança pendente." : `Total em aberto: ${this.formatCents(p.openChargesCents)}`
        }
      ],
      sessions: [],   // populated via appointments repo — added in next sprint
      documents: [],  // populated via documents repo — added in next sprint
      charges: [],    // populated via finance repo — added in next sprint
      activity: []
    };
  }

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  async createPatient(
    session: AuthSession,
    input: PatientCreateRequest
  ): Promise<{ patientId: string; redirectTo: string }> {
    const payload = patientCreateRequestSchema.parse(input);

    const created = await this.repo.create({
      tenantId: session.tenant.id,
      therapistId: session.therapist.id,
      fullName: payload.fullName,
      email: payload.email ?? "",
      phone: payload.phone ?? "",
      birthDate: payload.birthDate,
      paymentOrigin: payload.paymentOrigin
    });

    this.auditService.log({
      therapistId: session.therapist.id,
      tenantId:    session.tenant.id,
      action:      "create",
      resource:    "patient",
      resourceId:  created.id,
      patientId:   created.id
    });

    // TODO: if sendInviteNow, dispara email via Resend (próximo sprint)

    return {
      patientId: created.id,
      redirectTo: `/app/patients/${created.id}`
    };
  }

  // ---------------------------------------------------------------------------
  // Helpers — formatação de labels
  // ---------------------------------------------------------------------------

  private toListItem(p: PatientWithMeta) {
    return {
      id: p.id,
      fullName: p.fullName,
      externalCode: p.externalCode,
      primaryContact: [p.email, p.phone].filter(Boolean).join(" · ") || "Sem contato",
      status: p.status as PatientOperationalStatus,
      nextSessionLabel: this.nextSessionLabel(p),
      documentsState: this.docsState(p),
      documentsCountLabel: this.docsCountLabel(p),
      financialState: this.financialState(p),
      financialLabel: this.financialLabel(p),
      hasLegalGuardian: false,
      patientHref: `/app/patients/${p.id}`
    };
  }

  private nextSessionLabel(p: PatientWithMeta): string {
    if (!p.nextSessionDate) return "Sem sessão futura";
    const today = new Date().toISOString().slice(0, 10);
    const isToday = p.nextSessionDate === today;
    const dateLabel = isToday ? "Hoje" : this.formatDate(p.nextSessionDate);
    return p.nextSessionTime ? `${dateLabel}, ${p.nextSessionTime}` : dateLabel;
  }

  private docsState(p: PatientWithMeta): "ok" | "pending" | "critical" {
    if (p.criticalDocumentsCount > 0) return "critical";
    if (p.pendingDocumentsCount > 0) return "pending";
    return "ok";
  }

  private docsCountLabel(p: PatientWithMeta): string {
    if (p.criticalDocumentsCount > 0) return "Bloqueia sessão online";
    if (p.pendingDocumentsCount > 0) return `${p.pendingDocumentsCount} pendente(s)`;
    return "OK";
  }

  private financialState(p: PatientWithMeta): PatientFinancialState {
    if (p.overdueChargesCount > 0) return "overdue";
    if (p.openChargesCount > 0) return "open";
    return "ok";
  }

  private financialLabel(p: PatientWithMeta): string {
    if (p.overdueChargesCount > 0) return `${p.overdueChargesCount} cobrança(s) vencida(s)`;
    if (p.openChargesCount > 0) return `${p.openChargesCount} cobrança(s) em aberto`;
    return "Sem pendências";
  }

  private primaryAction(p: PatientWithMeta) {
    if (p.status === "invited") {
      return { label: "Reenviar convite", href: `/app/patients/${p.id}` };
    }
    if (p.nextSessionDate) {
      return { label: "Abrir sessão", href: `/app/agenda` };
    }
    return { label: "Agendar sessão", href: `/app/agenda?patientId=${p.id}` };
  }

  private statusLabel(status: string): string {
    const map: Record<string, string> = {
      invited: "Convidado(a) — aguardando ativação",
      active: "Ativo(a) em acompanhamento",
      inactive: "Inativo(a) — sem sessão futura",
      archived: "Arquivado(a)"
    };
    return map[status] ?? status;
  }

  private ageLabel(birthDate: string): string {
    if (!birthDate) return "Idade não informada";
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
    return `${age} anos`;
  }

  private formatDate(isoDate: string): string {
    const d = new Date(isoDate);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }

  private formatDateLong(isoDate: string): string {
    const d = new Date(isoDate);
    return d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  }

  private formatCents(cents: number): string {
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  private coerceStatus(v?: string): PatientListFilters["status"] {
    const valid = ["all", "invited", "active", "inactive", "archived"];
    return (valid.includes(v ?? "") ? v : "all") as PatientListFilters["status"];
  }

  private coerceDocuments(v?: string): PatientListFilters["documents"] {
    const valid = ["all", "ok", "pending", "critical"];
    return (valid.includes(v ?? "") ? v : "all") as PatientListFilters["documents"];
  }

  private coerceFinancial(v?: string): PatientListFilters["financial"] {
    const valid = ["all", "ok", "open", "overdue"];
    return (valid.includes(v ?? "") ? v : "all") as PatientListFilters["financial"];
  }
}
