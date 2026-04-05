import { Injectable, UnauthorizedException } from "@nestjs/common";
import type {
  AppShellBootstrap,
  AuthSession,
  OnboardingCompleteStepRequest,
  OnboardingStepKey,
  SettingsBootstrap,
  SettingsNotificationsSection,
  SettingsNotificationsUpdateRequest,
  SettingsPoliciesSection,
  SettingsPoliciesUpdateRequest,
  SettingsPracticeSection,
  SettingsPracticeUpdateRequest,
  SettingsProfileSection,
  SettingsProfileUpdateRequest,
  SettingsRemediationItem,
  SettingsSecuritySection,
  SettingsSecurityUpdateRequest,
  SettingsSensitiveChange,
  SettingsUpdateResponse,
  TherapistAccountStatus,
  TherapistOnboardingBootstrap,
  TherapistOnboardingDraft,
  TherapistProfile
} from "@terapia/contracts";

type MockAccountRecord = {
  capabilities: AuthSession["capabilities"];
  completedSteps: Set<OnboardingStepKey>;
  status: TherapistAccountStatus;
  therapist: TherapistProfile;
  draft: TherapistOnboardingDraft;
  settings: {
    profile: SettingsProfileSection;
    practice: SettingsPracticeSection;
    security: SettingsSecuritySection;
    policies: SettingsPoliciesSection;
    notifications: SettingsNotificationsSection;
    lastSensitiveChanges: SettingsSensitiveChange[];
  };
};

const onboardingStepOrder: OnboardingStepKey[] = [
  "welcome",
  "profile",
  "operations",
  "tax",
  "contracts",
  "schedule",
  "consents"
];

function createBaseDraft(email: string, fullName: string, practiceName: string): TherapistOnboardingDraft {
  return {
    welcomeAcknowledged: false,
    profile: {
      fullName,
      socialName: "",
      crp: "CRP 06/123456",
      crpState: "SP",
      cpf: "123.456.789-09",
      birthDate: "1990-08-15",
      phone: "(11) 99999-0000",
      professionalEmail: email,
      specialty: "Psicoterapia individual",
      miniBio: ""
    },
    operations: {
      practiceName,
      practicePhone: "(11) 4000-2000",
      timezone: "America/Sao_Paulo",
      pixKey: "",
      beneficiaryName: fullName,
      paymentInstructions: ""
    },
    tax: {
      regime: "",
      billingDocument: "",
      city: "Sao Paulo",
      emissionType: "",
      municipalRegistration: "",
      accountantName: ""
    },
    contracts: {
      termsAccepted: false,
      dpaAccepted: false,
      privacyAccepted: false,
      contractVersion: "2026.03"
    },
    schedule: {
      weekdays: [],
      startHour: "09:00",
      endHour: "18:00",
      sessionDurationMinutes: 50,
      gapMinutes: 10,
      defaultModality: "teleatendimento"
    },
    consents: {
      lgpdTemplateId: "consent-lgpd-default",
      telehealthTemplateId: "consent-telehealth-default",
      aiTemplateId: "consent-ai-default",
      defaultCollectionPolicy: ""
    }
  };
}

function createBaseSettings(
  email: string,
  fullName: string,
  practiceName: string,
  capabilities: AuthSession["capabilities"]
): MockAccountRecord["settings"] {
  return {
    profile: {
      fullName,
      socialName: "",
      professionalEmail: email,
      phone: "(11) 99999-0000",
      crp: "CRP 06/123456",
      crpState: "SP",
      specialty: "Psicoterapia individual",
      timezone: "America/Sao_Paulo",
      miniBio: "Atendimento clínico com foco em continuidade de cuidado e operação clara.",
      publicFieldsSummary: "Nome, especialidade, contato profissional e timezone ficam visíveis ao paciente.",
      stepUpRequiredFields: ["CRP", "nome legal"]
    },
    practice: {
      practiceName,
      displayName: practiceName,
      billingDocument: "123.456.789-09",
      addressLine: "Rua Harmonia, 145",
      city: "Sao Paulo",
      state: "SP",
      phone: "(11) 4000-2000",
      pixKey: "",
      beneficiaryName: fullName,
      receiptInstructions: "",
      stepUpRequiredFields: ["CPF/CNPJ", "chave Pix"]
    },
    security: {
      loginEmail: email,
      mfaStatusLabel: "MFA obrigatorio ativo",
      recoveryCodesLabel: "8 códigos gerados em 28 Mar 2026",
      lastCriticalEventLabel: "Novo login validado por MFA em 30 Mar 2026",
      activeSessions: [
        {
          id: "session_current",
          label: "MacBook Air · Chrome",
          lastSeenLabel: "Agora",
          locationLabel: "Sao Paulo, BR",
          current: true,
          statusLabel: "Sessão atual"
        },
        {
          id: "session_mobile",
          label: "iPhone · Safari",
          lastSeenLabel: "Ontem",
          locationLabel: "Sao Paulo, BR",
          current: false,
          statusLabel: "Sessão recente"
        }
      ],
      passwordRotationRequested: false,
      revokeOtherSessions: false,
      rotateRecoveryCodes: false,
      stepUpRequiredFields: ["e-mail de login", "reset de MFA"]
    },
    policies: {
      sessionDurationMinutes: 50,
      gapMinutes: 10,
      defaultModality: "telehealth",
      cancelWindowHours: 24,
      allowSelfScheduling: false,
      telehealthEnabled: true,
      transcriptDefaultEnabled: capabilities.audioTranscription,
      autoChargeAfterSession: true,
      collectionPolicy: "Cobrar até 2h antes da sessão ou gerar cobrança automaticamente após o atendimento."
    },
    notifications: {
      inAppEnabled: true,
      emailEnabled: true,
      preferences: [
        {
          key: "session_reminder",
          label: "Lembretes de sessão",
          description: "Avisos antes do início das sessões do dia.",
          inApp: true,
          email: true,
          locked: false
        },
        {
          key: "document_signed",
          label: "Novo documento assinado",
          description: "Confirma aceite documental relevante para operação.",
          inApp: true,
          email: true,
          locked: false
        },
        {
          key: "consent_revoked",
          label: "Consentimento revogado",
          description: "Alerta quando um consentimento muda o estado operacional.",
          inApp: true,
          email: true,
          locked: false
        },
        {
          key: "charge_received",
          label: "Cobranca recebida",
          description: "Baixas financeiras confirmadas no consultorio.",
          inApp: true,
          email: false,
          locked: false
        },
        {
          key: "charge_overdue",
          label: "Cobranca vencida",
          description: "Fila financeira critica para ataque objetivo.",
          inApp: true,
          email: true,
          locked: false
        },
        {
          key: "clinical_review_pending",
          label: "Item pendente na revisão clínica",
          description: "Fila pós-sessão aguardando fechamento clínico.",
          inApp: true,
          email: false,
          locked: false
        },
        {
          key: "security_alert",
          label: "Alerta de seguranca",
          description: "Eventos criticos de acesso ou protecao da conta.",
          inApp: true,
          email: true,
          locked: true
        }
      ]
    },
    lastSensitiveChanges: [
      {
        id: "change_contracts",
        title: "Política documental revisada",
        description: "Última alteração sensível registrada com impacto futuro em novos fluxos.",
        occurredAtLabel: "29 Mar 2026 · 18:10",
        actorLabel: "Ana Almeida",
        tone: "warning"
      }
    ]
  };
}

@Injectable()
export class WorkspaceStateService {
  private readonly accounts = new Map<string, MockAccountRecord>([
    [
      "ana@institutovivace.com.br",
      {
        status: "pending_setup",
        completedSteps: new Set<OnboardingStepKey>(["welcome"]),
        capabilities: {
          audioTranscription: false,
          brazilOnlyProcessing: true,
          patientPortalPayments: true,
          stepUpAuthentication: true
        },
        therapist: {
          id: "therapist_ana_almeida",
          fullName: "Ana Almeida",
          firstName: "Ana",
          email: "ana@institutovivace.com.br",
          crp: "CRP 06/123456",
          practiceName: "Instituto Vivace Psicologia",
          roleLabel: "Terapeuta responsável",
          timezone: "America/Sao_Paulo"
        },
        draft: {
          ...createBaseDraft(
            "ana@institutovivace.com.br",
            "Ana Almeida",
            "Instituto Vivace Psicologia"
          ),
          welcomeAcknowledged: true,
          profile: {
            ...createBaseDraft(
              "ana@institutovivace.com.br",
              "Ana Almeida",
              "Instituto Vivace Psicologia"
            ).profile,
            miniBio: "Atendimento clínico para adultos com foco em ansiedade e reorganização de rotina."
          }
        },
        settings: createBaseSettings(
          "ana@institutovivace.com.br",
          "Ana Almeida",
          "Instituto Vivace Psicologia",
          {
            audioTranscription: false,
            brazilOnlyProcessing: true,
            patientPortalPayments: true,
            stepUpAuthentication: true
          }
        )
      }
    ],
    [
      "ana.ready@institutovivace.com.br",
      {
        status: "ready_for_operations",
        completedSteps: new Set<OnboardingStepKey>(onboardingStepOrder),
        capabilities: {
          audioTranscription: false,
          brazilOnlyProcessing: true,
          patientPortalPayments: true,
          stepUpAuthentication: true
        },
        therapist: {
          id: "therapist_ana_almeida_ready",
          fullName: "Ana Almeida",
          firstName: "Ana",
          email: "ana.ready@institutovivace.com.br",
          crp: "CRP 06/123456",
          practiceName: "Instituto Vivace Psicologia",
          roleLabel: "Terapeuta responsável",
          timezone: "America/Sao_Paulo"
        },
        draft: {
          ...createBaseDraft(
            "ana.ready@institutovivace.com.br",
            "Ana Almeida",
            "Instituto Vivace Psicologia"
          ),
          welcomeAcknowledged: true,
          operations: {
            practiceName: "Instituto Vivace Psicologia",
            practicePhone: "(11) 4000-2000",
            timezone: "America/Sao_Paulo",
            pixKey: "financeiro@vivace.com.br",
            beneficiaryName: "Ana Almeida",
            paymentInstructions: "Pix até 2h antes da sessão."
          },
          tax: {
            regime: "Pessoa fisica",
            billingDocument: "123.456.789-09",
            city: "Sao Paulo",
            emissionType: "Recibo simples",
            municipalRegistration: "",
            accountantName: ""
          },
          contracts: {
            termsAccepted: true,
            dpaAccepted: true,
            privacyAccepted: true,
            contractVersion: "2026.03"
          },
          schedule: {
            weekdays: ["Seg", "Ter", "Qui"],
            startHour: "09:00",
            endHour: "18:00",
            sessionDurationMinutes: 50,
            gapMinutes: 10,
            defaultModality: "teleatendimento"
          },
          consents: {
            lgpdTemplateId: "consent-lgpd-default",
            telehealthTemplateId: "consent-telehealth-default",
            aiTemplateId: "consent-ai-default",
            defaultCollectionPolicy: "Coletar aceite antes da primeira sessao e reaplicar em revisoes de versao."
          }
        },
        settings: {
          ...createBaseSettings(
            "ana.ready@institutovivace.com.br",
            "Ana Almeida",
            "Instituto Vivace Psicologia",
            {
              audioTranscription: false,
              brazilOnlyProcessing: true,
              patientPortalPayments: true,
              stepUpAuthentication: true
            }
          ),
          profile: {
            ...createBaseSettings(
              "ana.ready@institutovivace.com.br",
              "Ana Almeida",
              "Instituto Vivace Psicologia",
              {
                audioTranscription: false,
                brazilOnlyProcessing: true,
                patientPortalPayments: true,
                stepUpAuthentication: true
              }
            ).profile,
            miniBio:
              "Psicologa clinica com foco em ansiedade, rotina profissional e continuidade do caso.",
            specialty: "Psicoterapia individual para adultos"
          },
          practice: {
            ...createBaseSettings(
              "ana.ready@institutovivace.com.br",
              "Ana Almeida",
              "Instituto Vivace Psicologia",
              {
                audioTranscription: false,
                brazilOnlyProcessing: true,
                patientPortalPayments: true,
                stepUpAuthentication: true
              }
            ).practice,
            pixKey: "financeiro@vivace.com.br",
            receiptInstructions: "Recibo simples liberado mediante confirmacao do pagamento.",
            beneficiaryName: "Ana Almeida"
          },
          policies: {
            ...createBaseSettings(
              "ana.ready@institutovivace.com.br",
              "Ana Almeida",
              "Instituto Vivace Psicologia",
              {
                audioTranscription: false,
                brazilOnlyProcessing: true,
                patientPortalPayments: true,
                stepUpAuthentication: true
              }
            ).policies,
            allowSelfScheduling: true,
            collectionPolicy:
              "Cobrar ate 2h antes da sessao e gerar cobranca automaticamente quando o atendimento fechar sem baixa."
          },
          lastSensitiveChanges: [
            {
              id: "change_security_mfa",
              title: "MFA reconfirmado",
              description: "Reforco de seguranca concluido com rotacao de codigos de recuperacao.",
              occurredAtLabel: "30 Mar 2026 · 08:30",
              actorLabel: "Ana Almeida",
              tone: "success"
            },
            {
              id: "change_policy_billing",
              title: "Politica de cobranca atualizada",
              description: "Nova regra vale apenas para cobrancas e sessoes futuras.",
              occurredAtLabel: "29 Mar 2026 · 18:10",
              actorLabel: "Ana Almeida",
              tone: "warning"
            }
          ]
        }
      }
    ]
  ]);

  getAccountByEmail(email: string) {
    const record = this.accounts.get(email);

    if (!record) {
      throw new UnauthorizedException("Conta mock nao configurada para este e-mail.");
    }

    return record;
  }

  hydrateSession(session: AuthSession): AuthSession {
    const record = this.getAccountByEmail(session.therapist.email);

    return {
      ...session,
      accountStatus: record.status,
      capabilities: record.capabilities,
      therapist: record.therapist
    };
  }

  getShellBootstrap(session: AuthSession): AppShellBootstrap {
    const hydrated = this.hydrateSession(session);
    const activationMode = hydrated.accountStatus !== "ready_for_operations";

    return {
      tenant: {
        id: `tenant_${hydrated.therapist.id}`,
        name: hydrated.therapist.practiceName,
        shortName: hydrated.therapist.practiceName.replace("Instituto ", ""),
        status: hydrated.accountStatus
      },
      therapistProfile: hydrated.therapist,
      timezone: hydrated.therapist.timezone,
      globalAlerts: activationMode
        ? [
            {
              id: "activation-required",
              tone: "warning",
              title: "Conclua a ativacao da conta antes de operar pacientes e sessoes.",
              description:
                "O shell esta em modo de ativacao. Pacientes, agenda, cobranca e atendimento continuam bloqueados ate o checklist ficar completo.",
              ctaLabel: "Concluir ativacao",
              href: "/app/onboarding"
            }
          ]
        : [
            {
              id: "policy-review-q2",
              tone: "warning",
              title: "Revise a politica de cobranca antes das sessoes desta semana.",
              description:
                "Ha 2 pacientes com reenvio pendente de aceite da politica atualizada.",
              ctaLabel: "Abrir documentos",
              href: "/app/documents"
            }
          ],
      navigationBadges: activationMode
        ? {
            settings: 1
          }
        : {
            clinicalReview: 4,
            documents: 3,
            finance: 2
          },
      featureFlags: {
        voiceModeAvailable: hydrated.capabilities.audioTranscription,
        mfaEnforced: true,
        patientPortalEnabled: true,
        analyticsEnabled: false
      },
      capabilities: hydrated.capabilities,
      accountStateLabel:
        hydrated.accountStatus === "ready_for_operations"
          ? "Conta pronta para operacao"
          : hydrated.accountStatus === "restricted"
            ? "Conta com restricao critica"
            : "Conta em ativacao"
    };
  }

  getOnboardingBootstrap(session: AuthSession): TherapistOnboardingBootstrap {
    const hydrated = this.hydrateSession(session);
    const record = this.getAccountByEmail(hydrated.therapist.email);
    const currentStep = this.getCurrentStep(record);

    return {
      accountStatus: record.status,
      currentStep,
      estimatedMinutesLabel: "7 etapas · cerca de 12 minutos com tudo em maos",
      modeLabel:
        record.status === "ready_for_operations"
          ? "Conta pronta"
          : "Modo de ativacao da pratica profissional",
      steps: onboardingStepOrder.map((stepKey) => ({
        key: stepKey,
        title: this.getStepTitle(stepKey),
        description: this.getStepDescription(stepKey),
        status: record.completedSteps.has(stepKey)
          ? "completed"
          : stepKey === currentStep
            ? "current"
            : "pending"
      })),
      blockingItems: [
        {
          id: "mfa",
          label: "MFA ativo",
          description: "A conta precisa operar com segundo fator ativo em todos os logins.",
          completed: hydrated.mfaVerified,
          blocking: true
        },
        ...(
          onboardingStepOrder.slice(1) as Exclude<OnboardingStepKey, "welcome">[]
        ).map((stepKey) => ({
          id: stepKey,
          label: this.getChecklistLabel(stepKey),
          description: this.getStepDescription(stepKey),
          completed: record.completedSteps.has(stepKey),
          blocking: true
        }))
      ],
      consentTemplates: [
        {
          id: "consent-lgpd-default",
          title: "Modelo padrao LGPD",
          summary: "Base de tratamento, armazenamento e direitos do paciente.",
          required: true
        },
        {
          id: "consent-telehealth-default",
          title: "Modelo padrao de teleatendimento",
          summary: "Termo padrao para sessoes online e orientacoes de acesso.",
          required: true
        },
        {
          id: "consent-ai-default",
          title: "Modelo padrao para IA documental",
          summary: "Explica uso assistivo de IA sem diagnostico automatizado.",
          required: true
        }
      ],
      draft: record.draft
    };
  }

  startOnboarding(session: AuthSession) {
    const hydrated = this.hydrateSession(session);
    const record = this.getAccountByEmail(hydrated.therapist.email);

    if (record.status === "draft") {
      record.status = "pending_setup";
    }

    record.completedSteps.add("welcome");
    record.draft.welcomeAcknowledged = true;

    return this.getOnboardingBootstrap(hydrated);
  }

  completeOnboardingStep(session: AuthSession, request: OnboardingCompleteStepRequest) {
    const hydrated = this.hydrateSession(session);
    const record = this.getAccountByEmail(hydrated.therapist.email);

    switch (request.step) {
      case "welcome":
        record.draft.welcomeAcknowledged = request.payload.welcomeAcknowledged;
        break;
      case "profile":
        record.draft.profile = request.payload;
        record.therapist = {
          ...record.therapist,
          fullName: request.payload.fullName,
          firstName: request.payload.fullName.split(" ")[0] ?? request.payload.fullName,
          email: request.payload.professionalEmail,
          crp: request.payload.crp
        };
        break;
      case "operations":
        record.draft.operations = request.payload;
        record.therapist = {
          ...record.therapist,
          practiceName: request.payload.practiceName,
          timezone: request.payload.timezone
        };
        break;
      case "tax":
        record.draft.tax = request.payload;
        break;
      case "contracts":
        record.draft.contracts = request.payload;
        break;
      case "schedule":
        record.draft.schedule = request.payload;
        break;
      case "consents":
        record.draft.consents = request.payload;
        break;
    }

    record.completedSteps.add(request.step);
    record.status = this.isActivationComplete(record) ? "ready_for_operations" : "pending_setup";

    return {
      onboarding: this.getOnboardingBootstrap(hydrated),
      accountStatus: record.status
    };
  }

  getAccountSummary(session: AuthSession) {
    const hydrated = this.hydrateSession(session);
    return {
      accountStatus: hydrated.accountStatus,
      therapist: hydrated.therapist
    };
  }

  getCapabilities(session: AuthSession) {
    return this.hydrateSession(session).capabilities;
  }

  getSettingsBootstrap(session: AuthSession): SettingsBootstrap {
    const hydrated = this.hydrateSession(session);
    const record = this.getAccountByEmail(hydrated.therapist.email);
    const remediationItems = this.getRemediationItems(record);

    return {
      accountStatus: record.status,
      accountStatusLabel:
        record.status === "ready_for_operations"
          ? "Conta pronta para operacao"
          : record.status === "restricted"
            ? "Conta com restricao critica"
            : "Conta em ativacao",
      mfaStatusLabel: record.settings.security.mfaStatusLabel,
      lastSensitiveChangeLabel:
        record.settings.lastSensitiveChanges[0]?.occurredAtLabel ?? "Sem alteracao sensivel recente",
      sections: [
        {
          key: "profile",
          title: "Perfil profissional",
          description: "Dados publicos e operacionais do terapeuta.",
          href: "/app/settings/profile"
        },
        {
          key: "practice",
          title: "Conta e consultorio",
          description: "Dados institucionais, de recebimento e snapshot futuro.",
          href: "/app/settings/practice"
        },
        {
          key: "security",
          title: "Seguranca",
          description: "MFA, sessoes e eventos criticos da conta.",
          href: "/app/settings/security"
        },
        {
          key: "policies",
          title: "Politicas operacionais",
          description: "Defaults que afetam agenda, teleatendimento e cobranca futura.",
          href: "/app/settings/policies"
        },
        {
          key: "notifications",
          title: "Notificacoes",
          description: "Preferencias do terapeuta por canal e tipo de alerta.",
          href: "/app/settings/notifications"
        }
      ],
      remediationItems,
      lastSensitiveChanges: record.settings.lastSensitiveChanges,
      profile: record.settings.profile,
      practice: record.settings.practice,
      security: record.settings.security,
      policies: record.settings.policies,
      notifications: record.settings.notifications
    };
  }

  updateSettingsProfile(
    session: AuthSession,
    input: SettingsProfileUpdateRequest
  ): SettingsUpdateResponse {
    const hydrated = this.hydrateSession(session);
    const record = this.getAccountByEmail(hydrated.therapist.email);
    const previous = record.settings.profile;
    const sensitive =
      previous.crp !== input.crp ||
      previous.fullName !== input.fullName ||
      previous.professionalEmail !== input.professionalEmail;

    record.settings.profile = {
      ...input,
      publicFieldsSummary:
        "Nome, especialidade, contato profissional e timezone ficam visiveis ao paciente.",
      stepUpRequiredFields: ["CRP", "nome legal"]
    };
    record.therapist = {
      ...record.therapist,
      fullName: input.fullName,
      firstName: input.fullName.split(" ")[0] ?? input.fullName,
      crp: input.crp,
      timezone: input.timezone
    };
    record.draft.profile = {
      ...record.draft.profile,
      fullName: input.fullName,
      socialName: input.socialName,
      crp: input.crp,
      crpState: input.crpState,
      professionalEmail: input.professionalEmail,
      phone: input.phone,
      specialty: input.specialty,
      miniBio: input.miniBio
    };

    this.prependSensitiveChange(record, {
      id: "settings_profile_update",
      title: sensitive ? "Perfil profissional alterado com impacto sensivel" : "Perfil profissional atualizado",
      description: sensitive
        ? "Nome legal, CRP ou e-mail profissional foram alterados e exigem trilha reforcada."
        : "Ajustes de perfil profissional foram salvos para fluxos futuros.",
      occurredAtLabel: "Agora",
      actorLabel: record.therapist.fullName,
      tone: sensitive ? "warning" : "info"
    });

    return this.buildSettingsUpdateResponse(record, "profile", sensitive);
  }

  updateSettingsPractice(
    session: AuthSession,
    input: SettingsPracticeUpdateRequest
  ): SettingsUpdateResponse {
    const hydrated = this.hydrateSession(session);
    const record = this.getAccountByEmail(hydrated.therapist.email);
    const previous = record.settings.practice;
    const sensitive =
      previous.billingDocument !== input.billingDocument ||
      previous.pixKey !== input.pixKey ||
      previous.beneficiaryName !== input.beneficiaryName;

    record.settings.practice = {
      ...input,
      stepUpRequiredFields: ["CPF/CNPJ", "chave Pix"]
    };
    record.therapist = {
      ...record.therapist,
      practiceName: input.practiceName
    };
    record.draft.operations = {
      ...record.draft.operations,
      practiceName: input.practiceName,
      practicePhone: input.phone,
      pixKey: input.pixKey,
      beneficiaryName: input.beneficiaryName,
      paymentInstructions: input.receiptInstructions
    };
    record.draft.tax = {
      ...record.draft.tax,
      billingDocument: input.billingDocument,
      city: input.city
    };

    this.prependSensitiveChange(record, {
      id: "settings_practice_update",
      title: sensitive ? "Dados fiscais e de recebimento atualizados" : "Dados do consultorio atualizados",
      description: sensitive
        ? "Mudancas sensiveis valem para fluxos futuros e preservam snapshots historicos anteriores."
        : "Ajustes do consultorio salvos para novas cobrancas, recibos e documentos.",
      occurredAtLabel: "Agora",
      actorLabel: record.therapist.fullName,
      tone: sensitive ? "warning" : "info"
    });

    return this.buildSettingsUpdateResponse(record, "practice", sensitive);
  }

  updateSettingsSecurity(
    session: AuthSession,
    input: SettingsSecurityUpdateRequest
  ): SettingsUpdateResponse {
    const hydrated = this.hydrateSession(session);
    const record = this.getAccountByEmail(hydrated.therapist.email);
    const sensitive = record.settings.security.loginEmail !== input.loginEmail;

    record.settings.security = {
      ...record.settings.security,
      loginEmail: input.loginEmail,
      passwordRotationRequested: input.passwordRotationRequested,
      revokeOtherSessions: input.revokeOtherSessions,
      rotateRecoveryCodes: input.rotateRecoveryCodes
    };

    if (input.revokeOtherSessions) {
      record.settings.security.activeSessions = record.settings.security.activeSessions.map((item) =>
        item.current ? item : { ...item, statusLabel: "Revogada" }
      );
    }

    if (input.rotateRecoveryCodes) {
      record.settings.security.recoveryCodesLabel = "8 codigos regenerados agora";
    }

    record.settings.security.lastCriticalEventLabel = sensitive
      ? "Mudanca de e-mail de login solicitada e aguardando verificacao adicional"
      : "Preferencias de seguranca revisadas agora";

    this.prependSensitiveChange(record, {
      id: "settings_security_update",
      title: sensitive ? "Seguranca alterada com step-up" : "Preferencias de seguranca atualizadas",
      description: sensitive
        ? "Mudanca de e-mail de login exige verificacao adicional e pode encerrar sessoes ativas."
        : "Revisao de sessoes, senha ou codigos de recuperacao registrada com auditoria.",
      occurredAtLabel: "Agora",
      actorLabel: record.therapist.fullName,
      tone: sensitive ? "warning" : "info"
    });

    return this.buildSettingsUpdateResponse(record, "security", true);
  }

  updateSettingsPolicies(
    session: AuthSession,
    input: SettingsPoliciesUpdateRequest
  ): SettingsUpdateResponse {
    const hydrated = this.hydrateSession(session);
    const record = this.getAccountByEmail(hydrated.therapist.email);
    const transcriptAdjusted =
      !hydrated.capabilities.audioTranscription && input.transcriptDefaultEnabled;

    record.settings.policies = {
      ...input,
      transcriptDefaultEnabled: transcriptAdjusted ? false : input.transcriptDefaultEnabled
    };
    record.draft.schedule = {
      ...record.draft.schedule,
      sessionDurationMinutes: input.sessionDurationMinutes,
      gapMinutes: input.gapMinutes,
      defaultModality: input.defaultModality === "telehealth" ? "teleatendimento" : "presencial"
    };
    record.draft.consents = {
      ...record.draft.consents,
      defaultCollectionPolicy: input.collectionPolicy
    };

    this.prependSensitiveChange(record, {
      id: "settings_policies_update",
      title: "Politicas operacionais atualizadas",
      description:
        "As mudancas passam a valer apenas para operacoes futuras e nao sobrescrevem consentimentos existentes.",
      occurredAtLabel: "Agora",
      actorLabel: record.therapist.fullName,
      tone: "warning"
    });

    return this.buildSettingsUpdateResponse(record, "policies", false);
  }

  updateSettingsNotifications(
    session: AuthSession,
    input: SettingsNotificationsUpdateRequest
  ): SettingsUpdateResponse {
    const hydrated = this.hydrateSession(session);
    const record = this.getAccountByEmail(hydrated.therapist.email);

    record.settings.notifications = {
      ...input,
      preferences: input.preferences.map((preference) =>
        preference.key === "security_alert"
          ? { ...preference, inApp: true, email: true, locked: true }
          : preference
      )
    };

    this.prependSensitiveChange(record, {
      id: "settings_notifications_update",
      title: "Preferencias de notificacao atualizadas",
      description: "As novas preferencias afetam apenas notificacoes futuras.",
      occurredAtLabel: "Agora",
      actorLabel: record.therapist.fullName,
      tone: "info"
    });

    return this.buildSettingsUpdateResponse(record, "notifications", false);
  }

  private getCurrentStep(record: MockAccountRecord): OnboardingStepKey {
    return onboardingStepOrder.find((stepKey) => !record.completedSteps.has(stepKey)) ?? "consents";
  }

  private isActivationComplete(record: MockAccountRecord) {
    return onboardingStepOrder.every((stepKey) => record.completedSteps.has(stepKey));
  }

  private getStepTitle(stepKey: OnboardingStepKey) {
    const titles: Record<OnboardingStepKey, string> = {
      welcome: "Boas-vindas",
      profile: "Perfil profissional",
      operations: "Dados operacionais",
      tax: "Dados tributarios",
      contracts: "Contrato e DPA",
      schedule: "Agenda inicial",
      consents: "Consentimentos padrao"
    };

    return titles[stepKey];
  }

  private getStepDescription(stepKey: OnboardingStepKey) {
    const descriptions: Record<OnboardingStepKey, string> = {
      welcome: "Resumo do que sera configurado antes de operar a conta clinica.",
      profile: "CRP, identificacao profissional e contato minimo para a pratica.",
      operations: "Dados da conta, recebimento e timezone da operacao.",
      tax: "Base minima para relatorios e futura automacao fiscal.",
      contracts: "Aceite contratual, DPA e politica de privacidade versionados.",
      schedule: "Disponibilidade minima para convidar pacientes e agendar sessoes.",
      consents: "Modelos padrao obrigatorios para operar com pacientes."
    };

    return descriptions[stepKey];
  }

  private getChecklistLabel(stepKey: Exclude<OnboardingStepKey, "welcome">) {
    const labels: Record<Exclude<OnboardingStepKey, "welcome">, string> = {
      profile: "Perfil profissional completo",
      operations: "Dados operacionais preenchidos",
      tax: "Dados tributarios minimos preenchidos",
      contracts: "Contrato e DPA aceitos",
      schedule: "Disponibilidade inicial configurada",
      consents: "Consentimentos padrao configurados"
    };

    return labels[stepKey];
  }

  private buildSettingsUpdateResponse(
    record: MockAccountRecord,
    section: SettingsUpdateResponse["section"],
    stepUpRequired: boolean
  ): SettingsUpdateResponse {
    return {
      section,
      savedAtLabel: "Agora",
      stepUpRequired,
      settings: this.getSettingsBootstrap({
        accessToken: "",
        accountStatus: record.status,
        capabilities: record.capabilities,
        expiresAt: "",
        mfaVerified: true,
        therapist: record.therapist
      })
    };
  }

  private prependSensitiveChange(record: MockAccountRecord, change: SettingsSensitiveChange) {
    record.settings.lastSensitiveChanges = [change, ...record.settings.lastSensitiveChanges].slice(0, 5);
  }

  private getRemediationItems(record: MockAccountRecord): SettingsRemediationItem[] {
    const items: SettingsRemediationItem[] = [];

    if (record.status === "restricted") {
      items.push({
        id: "restricted-account",
        title: "Conta com restricao critica",
        description: "Revise seguranca e documentos obrigatorios antes de retomar a operacao.",
        blocking: true,
        ctaLabel: "Abrir seguranca",
        href: "/app/settings/security"
      });
    }

    if (record.settings.practice.pixKey.trim().length === 0) {
      items.push({
        id: "missing-pix",
        title: "Defina a chave Pix do consultorio",
        description: "Sem isso o financeiro fica sem referencia objetiva de recebimento.",
        blocking: false,
        ctaLabel: "Abrir conta e consultorio",
        href: "/app/settings/practice"
      });
    }

    if (!record.capabilities.audioTranscription && record.settings.policies.transcriptDefaultEnabled) {
      items.push({
        id: "transcript-capability",
        title: "Transcript padrao esta ligado sem capability ativa",
        description: "Ajuste a politica para nao prometer um fluxo que a conta ainda nao suporta.",
        blocking: false,
        ctaLabel: "Abrir politicas",
        href: "/app/settings/policies"
      });
    }

    return items;
  }
}
