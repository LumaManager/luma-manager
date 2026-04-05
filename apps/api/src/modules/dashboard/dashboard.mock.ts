import type {
  AppShellBootstrap,
  AuthSession,
  TherapistDashboard
} from "@terapia/contracts";

export function buildShellBootstrap(session: AuthSession): AppShellBootstrap {
  return {
    tenant: {
      id: "tenant_vivace",
      name: "Instituto Vivace Psicologia",
      shortName: "Vivace",
      status: session.accountStatus
    },
    therapistProfile: session.therapist,
    timezone: session.therapist.timezone,
    globalAlerts: [
      {
        id: "policy-review-q2",
        tone: "warning",
        title: "Revise a política de cobrança antes das sessões desta semana.",
        description:
          "Há 2 pacientes com reenvio pendente de aceite da política atualizada.",
        ctaLabel: "Abrir documentos",
        href: "/app/documents"
      }
    ],
    navigationBadges: {
      clinicalReview: 4,
      documents: 3,
      finance: 2
    },
    featureFlags: {
      voiceModeAvailable: session.capabilities.audioTranscription,
      mfaEnforced: true,
      patientPortalEnabled: true,
      analyticsEnabled: false
    },
    capabilities: session.capabilities,
    accountStateLabel:
      session.accountStatus === "ready_for_operations"
        ? "Conta pronta para operacao"
        : session.accountStatus === "restricted"
          ? "Conta com restricao critica"
          : "Conta em ativacao"
  };
}

export function buildDashboard(session: AuthSession): TherapistDashboard {
  if (session.accountStatus !== "ready_for_operations") {
    return {
      accountStatus: session.accountStatus,
      globalBlockingIssues: [
        {
          id: "activation-required",
          tone: "warning",
          title: "Sua conta ainda não está pronta para operar pacientes.",
          description:
            "Conclua o onboarding para liberar agenda, cadastro de pacientes, cobrança e atendimento.",
          ctaLabel: "Concluir ativação",
          href: "/app/onboarding"
        }
      ],
      quickActions: [
        {
          id: "complete-onboarding",
          label: "Concluir ativação",
          description: "Retome o wizard exatamente na próxima etapa pendente.",
          href: "/app/onboarding",
          icon: "clipboard-list",
          emphasis: "primary"
        },
        {
          id: "review-security",
          label: "Revisar segurança",
          description: "Veja o estado de MFA e políticas sensíveis antes de operar a conta.",
          href: "/app/settings/profile",
          icon: "wallet",
          emphasis: "secondary"
        }
      ],
      upcomingAppointments: [],
      clinicalReviewSummary: {
        totalPending: 0,
        overdueCount: 0,
        oldestPendingLabel: "Sem backlog clínico enquanto a conta não estiver apta.",
        nextItemHref: "/app/onboarding",
        queueHref: "/app/onboarding"
      },
      documentSummary: {
        totalPending: 3,
        criticalCount: 3,
        affectedPatientsLabel: "Os modelos obrigatórios ainda precisam ser configurados no onboarding.",
        documentsHref: "/app/onboarding"
      },
      financialSummary: {
        openAmountLabel: "R$ 0,00",
        openCharges: 0,
        overdueCharges: 0,
        financeHref: "/app/onboarding",
        overdueHref: "/app/onboarding"
      },
      recentPatients: [],
      todayAgenda: [],
      actionItems: [
        {
          id: "finish-activation",
          title: "Ative a conta para começar a atender",
          description:
            "Perfil, dados operacionais, tributário, contratos, agenda e consentimentos precisam ficar completos.",
          impactLabel: "Bloqueia operação",
          href: "/app/onboarding",
          ctaLabel: "Abrir onboarding",
          tone: "critical"
        },
        {
          id: "mfa-validated",
          title: "MFA já está protegido",
          description: "A etapa de acesso está pronta. Agora falta configurar a prática profissional.",
          impactLabel: "Segurança concluída",
          href: "/app/settings/profile",
          ctaLabel: "Abrir configurações",
          tone: "success"
        }
      ],
      recentActivity: [
        {
          id: "activity-mfa",
          title: "MFA confirmado no acesso do terapeuta",
          description: "A conta entrou no shell seguro e agora aguarda ativação operacional.",
          occurredAtLabel: "Agora",
          href: "/app/onboarding"
        }
      ],
      cards: {
        upcomingAppointments: {
          title: "Próximos atendimentos",
          eyebrow: "Bloqueado até ativação",
          metric: "Nenhuma sessão liberada",
          description: "A agenda só abre para operação completa quando a conta estiver pronta.",
          tone: "warning",
          href: "/app/onboarding",
          ctaLabel: "Concluir ativação"
        },
        clinicalReview: {
          title: "Revisão clínica",
          eyebrow: "Pós-sessão ainda indisponível",
          metric: "0 itens operacionais",
          description: "O valor do produto continua reservado, mas depende da conta apta.",
          tone: "info",
          href: "/app/onboarding",
          ctaLabel: "Ver checklist"
        },
        documents: {
          title: "Pendências documentais",
          eyebrow: "Obrigatório para operar",
          metric: "3 modelos a configurar",
          description: "LGPD, teleatendimento e IA documental precisam ficar prontos no onboarding.",
          tone: "critical",
          href: "/app/onboarding",
          ctaLabel: "Resolver agora"
        },
        finance: {
          title: "Recebimento inicial",
          eyebrow: "Ops financeiras",
          metric: "Pix e dados de faturamento pendentes",
          description: "Sem isso a conta não pode gerar cobrança nem operar o financeiro core.",
          tone: "warning",
          href: "/app/onboarding",
          ctaLabel: "Preencher dados"
        },
        recentPatients: {
          title: "Pacientes recentes",
          eyebrow: "Ainda não liberado",
          metric: "Cadastros bloqueados",
          description: "O cadastro de pacientes será liberado quando a prática estiver ativada.",
          tone: "info",
          href: "/app/onboarding",
          ctaLabel: "Ver bloqueios"
        },
        accountState: {
          title: "Estado da conta",
          eyebrow: "Modo de ativação",
          metric: "Conta em pending_setup",
          description:
            "MFA está ativo, mas a prática ainda não atingiu o checklist mínimo para operar com segurança.",
          tone: "warning",
          href: "/app/onboarding",
          ctaLabel: "Continuar ativação"
        }
      }
    };
  }

  return {
    accountStatus: session.accountStatus,
    globalBlockingIssues: [],
    quickActions: [
      {
        id: "new-patient",
        label: "Novo paciente",
        description: "Inicie o cadastro administrativo sem perder o ritmo do dia.",
        href: "/app/patients",
        icon: "user-plus",
        emphasis: "primary"
      },
      {
        id: "new-session",
        label: "Nova sessão",
        description: "Abra a agenda já no contexto do horário livre mais próximo.",
        href: "/app/agenda",
        icon: "calendar-plus",
        emphasis: "primary"
      },
      {
        id: "today-agenda",
        label: "Agenda de hoje",
        description: "Veja conflitos, janela livre e próximas entradas em um clique.",
        href: "/app/agenda",
        icon: "calendar",
        emphasis: "secondary"
      },
      {
        id: "clinical-review",
        label: "Revisão clínica",
        description: "Retome o backlog de pós-sessão com prioridade operacional.",
        href: "/app/clinical-review",
        icon: "clipboard-list",
        emphasis: "secondary"
      },
      {
        id: "finance",
        label: "Contas em aberto",
        description: "Ataque cobrancas vencidas sem transformar a tela em BI.",
        href: "/app/finance",
        icon: "wallet",
        emphasis: "secondary"
      }
    ],
    upcomingAppointments: [
        {
          id: "appt_1032",
          patientId: "patient_maria_souza",
          patientName: "Maria Souza",
        startsAt: "2026-03-30T13:30:00-03:00",
        endsAt: "2026-03-30T14:20:00-03:00",
        status: "waiting_room",
        locationLabel: "Sala online pronta",
        paymentLabel: "Pagamento confirmado",
        ctaLabel: "Entrar na sessao",
        ctaHref: "/app/appointments/appt_1032"
      },
      {
        id: "appt_1038",
        patientId: "patient_lucas_santos",
        patientName: "Lucas Santos",
        startsAt: "2026-03-30T15:00:00-03:00",
        endsAt: "2026-03-30T15:50:00-03:00",
        status: "confirmed",
        locationLabel: "Presencial",
        paymentLabel: "Cobranca vence hoje",
        ctaLabel: "Abrir sessao",
        ctaHref: "/app/appointments/appt_1038"
      },
      {
        id: "appt_1045",
        patientId: "patient_renata_costa",
        patientName: "Renata Costa",
        startsAt: "2026-03-30T17:10:00-03:00",
        endsAt: "2026-03-30T18:00:00-03:00",
        status: "confirmed",
        locationLabel: "Sala online pronta",
        paymentLabel: "Paciente com termo pendente",
        ctaLabel: "Abrir sessao",
        ctaHref: "/app/appointments/appt_1045"
      }
    ],
    clinicalReviewSummary: {
      totalPending: 4,
      overdueCount: 1,
      oldestPendingLabel: "Sessao de Julia Prado aguardando ha 18h",
      nextItemHref: "/app/clinical-review",
      queueHref: "/app/clinical-review"
    },
    documentSummary: {
      totalPending: 3,
      criticalCount: 1,
      affectedPatientsLabel: "2 termos de teleatendimento e 1 aditivo LGPD",
      documentsHref: "/app/documents"
    },
    financialSummary: {
      openAmountLabel: "R$ 1.840,00",
      openCharges: 6,
      overdueCharges: 2,
      financeHref: "/app/finance",
      overdueHref: "/app/finance"
    },
    recentPatients: [
      {
        id: "patient_maria_souza",
        name: "Maria Souza",
        nextSessionLabel: "Hoje, 13:30",
        statusLabel: "Prontuario em dia",
        tag: "Ansiedade",
        patientHref: "/app/patients/patient_maria_souza",
        clinicalRecordHref: "/app/patients/patient_maria_souza/clinical-record"
      },
      {
        id: "patient_lucas_santos",
        name: "Lucas Santos",
        nextSessionLabel: "Hoje, 15:00",
        statusLabel: "Pagamento pendente",
        tag: "Primeira avaliacao",
        patientHref: "/app/patients/patient_lucas_santos",
        clinicalRecordHref: "/app/patients/patient_lucas_santos/clinical-record"
      },
      {
        id: "patient_renata_costa",
        name: "Renata Costa",
        nextSessionLabel: "Hoje, 17:10",
        statusLabel: "Termo pendente",
        tag: "Teleatendimento",
        patientHref: "/app/patients/patient_renata_costa",
        clinicalRecordHref: "/app/patients/patient_renata_costa/clinical-record"
      },
      {
        id: "patient_julia_prado",
        name: "Julia Prado",
        nextSessionLabel: "Amanha, 09:00",
        statusLabel: "Resumo clinico atrasado",
        tag: "Revisao prioritaria",
        patientHref: "/app/patients/patient_julia_prado",
        clinicalRecordHref: "/app/patients/patient_julia_prado/clinical-record"
      },
      {
        id: "patient_caio_oliveira",
        name: "Caio Oliveira",
        nextSessionLabel: "Qui, 11:00",
        statusLabel: "Documentos completos",
        tag: "Seguimento",
        patientHref: "/app/patients/patient_caio_oliveira",
        clinicalRecordHref: "/app/patients/patient_caio_oliveira/clinical-record"
      }
    ],
    todayAgenda: [
      {
        id: "appt_1032",
        patientId: "patient_maria_souza",
        patientName: "Maria Souza",
        startsAt: "2026-03-30T13:30:00-03:00",
        endsAt: "2026-03-30T14:20:00-03:00",
        status: "waiting_room",
        locationLabel: "Sala online pronta",
        paymentLabel: "Pagamento confirmado",
        ctaLabel: "Entrar na sessao",
        ctaHref: "/app/appointments/appt_1032"
      },
      {
        id: "appt_1038",
        patientId: "patient_lucas_santos",
        patientName: "Lucas Santos",
        startsAt: "2026-03-30T15:00:00-03:00",
        endsAt: "2026-03-30T15:50:00-03:00",
        status: "confirmed",
        locationLabel: "Presencial",
        paymentLabel: "Cobranca vence hoje",
        ctaLabel: "Abrir sessao",
        ctaHref: "/app/appointments/appt_1038"
      },
      {
        id: "appt_1045",
        patientId: "patient_renata_costa",
        patientName: "Renata Costa",
        startsAt: "2026-03-30T17:10:00-03:00",
        endsAt: "2026-03-30T18:00:00-03:00",
        status: "confirmed",
        locationLabel: "Sala online pronta",
        paymentLabel: "Termo de IA pendente",
        ctaLabel: "Abrir sessao",
        ctaHref: "/app/appointments/appt_1045"
      }
    ],
    actionItems: [
      {
        id: "clinical-overdue",
        title: "Fechar resumo da sessao de Julia Prado",
        description: "Ha rascunho pendente ha 18 horas e isso atrasa a continuidade do caso.",
        impactLabel: "Prioridade clinica alta",
        href: "/app/clinical-review",
        ctaLabel: "Abrir revisao",
        tone: "critical"
      },
      {
        id: "document-renata",
        title: "Reenviar termo de teleatendimento para Renata Costa",
        description: "Sem o aceite atualizado a sessao online de hoje fica em risco operacional.",
        impactLabel: "Bloqueia atendimento",
        href: "/app/documents",
        ctaLabel: "Resolver documento",
        tone: "warning"
      },
      {
        id: "charge-lucas",
        title: "Cobrar sessao de Lucas Santos",
        description: "Pagamento da consulta de hoje ainda nao foi confirmado.",
        impactLabel: "Impacto financeiro",
        href: "/app/finance",
        ctaLabel: "Abrir financeiro",
        tone: "info"
      },
      {
        id: "security-review",
        title: "Validar codigos de recuperacao do MFA",
        description: "A politica de seguranca pede revisao trimestral dos codigos de contingencia.",
        impactLabel: "Seguranca da conta",
        href: "/app/settings/profile",
        ctaLabel: "Abrir seguranca",
        tone: "success"
      }
    ],
    recentActivity: [
      {
        id: "activity-payment",
        title: "Pagamento confirmado de Beatriz Nunes",
        description: "Cobranca do dia 28/03 conciliada automaticamente.",
        occurredAtLabel: "Ha 14 min",
        href: "/app/finance"
      },
      {
        id: "activity-document",
        title: "Documento assinado por Caio Oliveira",
        description: "Aditivo de politica de cancelamento concluido sem pendencias.",
        occurredAtLabel: "Ha 27 min",
        href: "/app/documents"
      },
      {
        id: "activity-patient",
        title: "Paciente Julia Prado atualizada",
        description: "Contato de emergencia e preferencia de atendimento revisados.",
        occurredAtLabel: "Ha 52 min",
        href: "/app/patients/patient_julia_prado"
      },
      {
        id: "activity-draft",
        title: "Rascunho clinico gerado para sessao de Maria Souza",
        description: "Resumo em topicos aguardando sua aprovacao.",
        occurredAtLabel: "Ha 1h",
        href: "/app/clinical-review"
      }
    ],
    cards: {
      upcomingAppointments: {
        title: "Proximos atendimentos",
        eyebrow: "Hoje",
        metric: "3 sessoes nas proximas 4h",
        description: "Maria Souza ja esta na waiting room. O bloco do meio ainda tem janela para preparo.",
        tone: "info",
        href: "/app/agenda",
        ctaLabel: "Abrir agenda"
      },
      clinicalReview: {
        title: "Revisao clinica pendente",
        eyebrow: "Valor central do produto",
        metric: "4 rascunhos para revisar",
        description:
          "Uma sessao esta atrasada e precisa de fechamento hoje para manter continuidade clinica.",
        tone: "critical",
        href: "/app/clinical-review",
        ctaLabel: "Revisar agora"
      },
      documents: {
        title: "Pendencias documentais",
        eyebrow: "Compliance",
        metric: "3 itens em aberto",
        description: "Um termo pode bloquear a sessao online da tarde se nao for reenviado agora.",
        tone: "warning",
        href: "/app/documents",
        ctaLabel: "Abrir documentos"
      },
      finance: {
        title: "Cobrancas em aberto",
        eyebrow: "Financeiro",
        metric: "R$ 1.840,00 pendentes",
        description: "Duas cobrancas ja venceram e merecem ataque objetivo antes do fechamento do dia.",
        tone: "info",
        href: "/app/finance",
        ctaLabel: "Ver cobrancas"
      },
      recentPatients: {
        title: "Pacientes recentes",
        eyebrow: "Continuidade",
        metric: "5 casos a um clique",
        description: "A lista preserva contexto de quem voce tocou hoje e do que ainda falta concluir.",
        tone: "success",
        href: "/app/patients",
        ctaLabel: "Abrir pacientes"
      },
      accountState: {
        title: "Estado da conta",
        eyebrow: "Governanca",
        metric: "Operacao pronta e MFA protegido",
        description:
          "Conta ativa, processamento Brasil-only habilitado e audio mantido como capability opcional.",
        tone: "success",
        href: "/app/settings/profile",
        ctaLabel: "Abrir configuracoes"
      }
    }
  };
}
