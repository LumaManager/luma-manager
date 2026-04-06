import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import type {
  AuthSession,
  InternalAuditResponse,
  InternalBillingResponse,
  InternalBootstrap,
  InternalIncidentsResponse,
  InternalRole,
  InternalSupportQueueResponse,
  InternalTenantDetail,
  InternalTenantListResponse,
  InternalWaitlistResponse,
  TherapistProfile
} from "@terapia/contracts";

import { WaitlistService } from "@/modules/marketing/waitlist.service";

type InternalOperatorRecord = {
  id: string;
  fullName: string;
  email: string;
  roles: InternalRole[];
  primaryRole: InternalRole;
};

const operators: InternalOperatorRecord[] = [
  {
    id: "internal_camila_rocha",
    fullName: "Camila Rocha",
    email: "ops@terapia.internal",
    roles: ["platform_admin", "support_ops", "billing_ops", "compliance_ops", "security_admin"],
    primaryRole: "platform_admin"
  },
  {
    id: "internal_dev_luma",
    fullName: "Dev Luma",
    email: "dev@lumamanager.com.br",
    roles: ["platform_admin", "support_ops", "billing_ops", "compliance_ops", "security_admin"],
    primaryRole: "platform_admin"
  }
];

const tenantItems: InternalTenantListResponse["items"] = [
  {
    tenantId: "tenant_vivace",
    name: "Instituto Vivace Psicologia",
    planLabel: "Solo Pro",
    operationalStatus: "active",
    onboardingStatus: "complete",
    billingStatus: "ok",
    createdAtLabel: "05 Mar 2026",
    lastEventLabel: "Politica de cobranca atualizada",
    lastEventAtLabel: "Hoje · 09:20",
    detailHref: "/internal/tenants/tenant_vivace"
  },
  {
    tenantId: "tenant_serena",
    name: "Clinica Serena",
    planLabel: "Solo Start",
    operationalStatus: "attention",
    onboardingStatus: "pending",
    billingStatus: "attention",
    createdAtLabel: "21 Mar 2026",
    lastEventLabel: "MFA ainda nao concluido",
    lastEventAtLabel: "Hoje · 08:05",
    detailHref: "/internal/tenants/tenant_serena"
  },
  {
    tenantId: "tenant_orbita",
    name: "Espaco Orbita",
    planLabel: "Solo Pro",
    operationalStatus: "restricted",
    onboardingStatus: "blocked",
    billingStatus: "delinquent",
    createdAtLabel: "12 Fev 2026",
    lastEventLabel: "Assinatura SaaS vencida",
    lastEventAtLabel: "Ontem · 17:40",
    detailHref: "/internal/tenants/tenant_orbita"
  }
];

const tenantDetails: Record<string, InternalTenantDetail> = {
  tenant_vivace: {
    tenantId: "tenant_vivace",
    name: "Instituto Vivace Psicologia",
    planLabel: "Solo Pro",
    operationalStatusLabel: "Operacao estavel",
    onboardingStatusLabel: "Onboarding concluido",
    billingStatusLabel: "SaaS em dia",
    createdAtLabel: "05 Mar 2026",
    ownerLabel: "Ana Almeida · ana.ready@institutovivace.com.br",
    userCountLabel: "1 usuario do tenant",
    patientCountLabel: "5 pacientes ativos",
    integrationHealthLabel: "Sem falhas de integracao nas ultimas 24h",
    criticalDocumentsLabel: "3 documentos criticos pendentes",
    recentNonClinicalEvents: [
      {
        id: "t_vivace_evt_1",
        title: "Plano renovado",
        description: "Assinatura SaaS confirmada sem atraso.",
        occurredAtLabel: "Hoje · 08:10"
      },
      {
        id: "t_vivace_evt_2",
        title: "Politica operacional alterada",
        description: "Mudanca prospectiva auditada no modulo de configuracoes.",
        occurredAtLabel: "Ontem · 19:25"
      }
    ],
    linkedAreas: {
      supportHref: "/internal/support",
      billingHref: "/internal/billing",
      auditHref: "/internal/audit"
    }
  },
  tenant_serena: {
    tenantId: "tenant_serena",
    name: "Clinica Serena",
    planLabel: "Solo Start",
    operationalStatusLabel: "Atencao operacional",
    onboardingStatusLabel: "Ativacao incompleta",
    billingStatusLabel: "Trial assistido",
    createdAtLabel: "21 Mar 2026",
    ownerLabel: "Marina Costa · marina@serena.com.br",
    userCountLabel: "1 usuario do tenant",
    patientCountLabel: "0 pacientes ativos",
    integrationHealthLabel: "Sem integracoes bloqueadas",
    criticalDocumentsLabel: "Nenhum documento emitido ainda",
    recentNonClinicalEvents: [
      {
        id: "t_serena_evt_1",
        title: "MFA pendente",
        description: "Conta criada sem concluir o segundo fator.",
        occurredAtLabel: "Hoje · 08:05"
      }
    ],
    linkedAreas: {
      supportHref: "/internal/support",
      billingHref: "/internal/billing",
      auditHref: "/internal/audit"
    }
  },
  tenant_orbita: {
    tenantId: "tenant_orbita",
    name: "Espaco Orbita",
    planLabel: "Solo Pro",
    operationalStatusLabel: "Conta restrita",
    onboardingStatusLabel: "Bloqueado por billing",
    billingStatusLabel: "Inadimplente",
    createdAtLabel: "12 Fev 2026",
    ownerLabel: "Caio Nunes · caio@orbita.com.br",
    userCountLabel: "1 usuario do tenant",
    patientCountLabel: "12 pacientes ativos",
    integrationHealthLabel: "Restricao preventiva aplicada",
    criticalDocumentsLabel: "2 pendencias documentais abertas",
    recentNonClinicalEvents: [
      {
        id: "t_orbita_evt_1",
        title: "Restricao de conta aplicada",
        description: "Billing SaaS venceu e abriu bloqueio controlado.",
        occurredAtLabel: "Ontem · 17:40"
      }
    ],
    linkedAreas: {
      supportHref: "/internal/support",
      billingHref: "/internal/billing",
      auditHref: "/internal/audit"
    }
  }
};

const supportQueue: InternalSupportQueueResponse = {
  total: 2,
  items: [
    {
      ticketId: "SUP-1042",
      tenantId: "tenant_serena",
      tenantName: "Clinica Serena",
      categoryLabel: "Ativacao",
      priorityLabel: "Alta",
      statusLabel: "Aguardando suporte",
      flowLabel: "MFA onboarding",
      lastEventLabel: "Sem acesso amplo a dados, apenas metadata de bloqueio",
      lastEventAtLabel: "Hoje · 08:18"
    },
    {
      ticketId: "SUP-1038",
      tenantId: "tenant_vivace",
      tenantName: "Instituto Vivace Psicologia",
      categoryLabel: "Documentos",
      priorityLabel: "Media",
      statusLabel: "Em andamento",
      flowLabel: "Reenvio de aceite",
      lastEventLabel: "Fila documental com atraso de assinatura",
      lastEventAtLabel: "Hoje · 09:12"
    }
  ]
};

const billingQueue: InternalBillingResponse = {
  total: 2,
  items: [
    {
      id: "BILL-221",
      tenantId: "tenant_orbita",
      tenantName: "Espaco Orbita",
      planLabel: "Solo Pro",
      subscriptionStatusLabel: "Inadimplente",
      invoiceLabel: "Fatura Mar/2026",
      amountLabel: "R$ 189,00",
      lastEventLabel: "Segundo aviso enviado",
      lastEventAtLabel: "Hoje · 07:50"
    },
    {
      id: "BILL-222",
      tenantId: "tenant_serena",
      tenantName: "Clinica Serena",
      planLabel: "Solo Start",
      subscriptionStatusLabel: "Trial assistido",
      invoiceLabel: "Conversao em acompanhamento",
      amountLabel: "R$ 0,00",
      lastEventLabel: "Aguardando onboarding completo",
      lastEventAtLabel: "Hoje · 08:05"
    }
  ]
};

const auditQueue: InternalAuditResponse = {
  total: 2,
  items: [
    {
      id: "AUD-901",
      actorLabel: "Ana Almeida",
      tenantLabel: "Instituto Vivace Psicologia",
      moduleLabel: "Configuracoes",
      eventLabel: "Alteracao sensivel",
      targetLabel: "Politica de cobranca",
      occurredAtLabel: "Hoje · 09:20",
      sensitivityLabel: "Prospectivo"
    },
    {
      id: "AUD-902",
      actorLabel: "Camila Rocha",
      tenantLabel: "Espaco Orbita",
      moduleLabel: "Billing interno",
      eventLabel: "Revisao de restricao",
      targetLabel: "Assinatura SaaS",
      occurredAtLabel: "Hoje · 07:55",
      sensitivityLabel: "Interno"
    }
  ]
};

const incidentsQueue: InternalIncidentsResponse = {
  total: 2,
  items: [
    {
      incidentId: "INC-77",
      title: "Atraso em notificacoes documentais",
      severityLabel: "Media",
      statusLabel: "Investigando",
      ownerLabel: "Camila Rocha",
      impactedTenantsLabel: "2 tenants impactados",
      updatedAtLabel: "Hoje · 09:05",
      timeline: [
        {
          id: "inc77_1",
          title: "Incidente aberto",
          description: "Atraso em e-mails transacionais detectado pelo suporte.",
          occurredAtLabel: "Hoje · 08:42"
        },
        {
          id: "inc77_2",
          title: "Mitigacao aplicada",
          description: "Fila reprocessada sem expor payload sensivel.",
          occurredAtLabel: "Hoje · 08:58"
        }
      ]
    },
    {
      incidentId: "INC-75",
      title: "Restricao preventiva por billing",
      severityLabel: "Alta",
      statusLabel: "Contido",
      ownerLabel: "Camila Rocha",
      impactedTenantsLabel: "1 tenant impactado",
      updatedAtLabel: "Ontem · 17:40",
      timeline: [
        {
          id: "inc75_1",
          title: "Conta restrita",
          description: "Restricao aplicada por inadimplencia do plano SaaS.",
          occurredAtLabel: "Ontem · 17:40"
        }
      ]
    }
  ]
};

@Injectable()
export class InternalOpsService {
  constructor(
    @Inject(WaitlistService) private readonly waitlistService: WaitlistService
  ) {}

  isInternalEmail(email: string) {
    return operators.some((operator) => operator.email === email);
  }

  getInternalOperatorByEmail(email: string) {
    const operator = operators.find((item) => item.email === email);

    if (!operator) {
      throw new UnauthorizedException("Usuario interno nao autorizado.");
    }

    return operator;
  }

  getInternalTherapistProfile(email: string): TherapistProfile {
    const operator = this.getInternalOperatorByEmail(email);

    return {
      id: operator.id,
      fullName: operator.fullName,
      firstName: operator.fullName.split(" ")[0] ?? operator.fullName,
      email: operator.email,
      crp: "INTERNAL",
      practiceName: "Terapia Platform Ops",
      roleLabel: roleLabelMap[operator.primaryRole],
      timezone: "America/Sao_Paulo"
    };
  }

  assertInternalSession(session: AuthSession) {
    return this.getInternalOperatorByEmail(session.therapist.email);
  }

  getBootstrap(session: AuthSession): InternalBootstrap {
    const operator = this.assertInternalSession(session);

    return {
      internalUserProfile: {
        id: operator.id,
        fullName: operator.fullName,
        email: operator.email,
        primaryRole: operator.primaryRole,
        roleLabel: roleLabelMap[operator.primaryRole],
        environmentLabel: "Local sandbox",
        sessionSecurityLabel: "MFA obrigatorio · sessao curta"
      },
      internalRoleSet: operator.roles,
      internalSecurityStatus: "Metadata-first · sem leitura clinica livre",
      navigation: [
        { key: "overview", label: "Visao geral", href: "/internal" },
        { key: "waitlist", label: "Waitlist", href: "/internal/waitlist" },
        { key: "tenants", label: "Tenants", href: "/internal/tenants" },
        { key: "support", label: "Suporte", href: "/internal/support" },
        { key: "billing", label: "Billing", href: "/internal/billing" },
        { key: "audit", label: "Auditoria", href: "/internal/audit" },
        { key: "incidents", label: "Incidentes", href: "/internal/incidents" }
      ],
      banner: {
        id: "metadata-first",
        tone: "warning",
        title: "Admin interno opera por metadata-first",
        description:
          "Sem prontuario, sem transcript e sem leitura livre de conteudo clinico no MVP.",
        ctaLabel: "Abrir auditoria",
        href: "/internal/audit"
      },
      platformOpsSummary: {
        activeTenants: 18,
        onboardingPending: 3,
        integrationFailures: 2,
        billingIssues: 2,
        openIncidents: incidentsQueue.total,
        complianceAlerts: 1
      }
    };
  }

  getSummary(session: AuthSession) {
    return this.getBootstrap(session).platformOpsSummary;
  }

  listTenants(session: AuthSession, query: Partial<Record<string, string>>): InternalTenantListResponse {
    this.assertInternalSession(session);
    const search = query.search?.trim().toLowerCase() ?? "";
    const operationalStatus = query.operationalStatus ?? "all";
    const onboardingStatus = query.onboardingStatus ?? "all";
    const billingStatus = query.billingStatus ?? "all";

    const items = tenantItems.filter((item) => {
      const matchesSearch = search.length === 0 || `${item.name} ${item.planLabel}`.toLowerCase().includes(search);
      const matchesOps = operationalStatus === "all" || item.operationalStatus === operationalStatus;
      const matchesOnboarding = onboardingStatus === "all" || item.onboardingStatus === onboardingStatus;
      const matchesBilling = billingStatus === "all" || item.billingStatus === billingStatus;
      return matchesSearch && matchesOps && matchesOnboarding && matchesBilling;
    });

    return {
      items,
      total: items.length,
      filters: {
        search: query.search ?? "",
        operationalStatus:
          operationalStatus === "active" ||
          operationalStatus === "attention" ||
          operationalStatus === "restricted" ||
          operationalStatus === "inactive"
            ? operationalStatus
            : "all",
        onboardingStatus:
          onboardingStatus === "complete" || onboardingStatus === "pending" || onboardingStatus === "blocked"
            ? onboardingStatus
            : "all",
        billingStatus:
          billingStatus === "ok" || billingStatus === "attention" || billingStatus === "delinquent"
            ? billingStatus
            : "all"
      }
    };
  }

  getTenantDetail(session: AuthSession, tenantId: string): InternalTenantDetail {
    this.assertInternalSession(session);
    const detail = tenantDetails[tenantId];

    if (!detail) {
      throw new NotFoundException("Tenant interno nao encontrado.");
    }

    return detail;
  }

  getSupport(session: AuthSession): InternalSupportQueueResponse {
    this.assertInternalSession(session);
    return supportQueue;
  }

  async getWaitlist(session: AuthSession): Promise<InternalWaitlistResponse> {
    this.assertInternalSession(session);
    return this.waitlistService.getInternalView();
  }

  getBilling(session: AuthSession): InternalBillingResponse {
    this.assertInternalSession(session);
    return billingQueue;
  }

  getAudit(session: AuthSession): InternalAuditResponse {
    this.assertInternalSession(session);
    return auditQueue;
  }

  getIncidents(session: AuthSession): InternalIncidentsResponse {
    this.assertInternalSession(session);
    return incidentsQueue;
  }
}

const roleLabelMap: Record<InternalRole, string> = {
  support_ops: "Support Ops",
  billing_ops: "Billing Ops",
  compliance_ops: "Compliance Ops",
  security_admin: "Security Admin",
  platform_admin: "Platform Admin"
};
