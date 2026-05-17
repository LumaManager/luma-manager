// apps/api/src/modules/onboarding/onboarding.service.ts
import { Injectable } from "@nestjs/common";

import type {
  OnboardingCompleteStepRequest,
  OnboardingStepKey,
  TherapistAccountStatus,
  TherapistOnboardingBootstrap
} from "@terapia/contracts";

import { OnboardingRepository } from "./onboarding.repository";
import type { BootstrapRawData } from "./onboarding.repository";

const ORDERED_STEPS: OnboardingStepKey[] = [
  "welcome",
  "profile",
  "operations",
  "tax",
  "contracts",
  "schedule",
  "consents"
];

const STEP_META: Record<OnboardingStepKey, { title: string; description: string }> = {
  welcome:    { title: "Boas-vindas",        description: "Inicie a ativação da sua conta" },
  profile:    { title: "Perfil profissional", description: "CRP, especialidade e bio" },
  operations: { title: "Consultório",         description: "Nome, contato e fuso horário" },
  tax:        { title: "Faturamento",         description: "CPF ou CNPJ de faturamento" },
  contracts:  { title: "Contratos",           description: "Termos, DPA e privacidade" },
  schedule:   { title: "Agenda",              description: "Dias, horários e sessão padrão" },
  consents:   { title: "Consentimentos",      description: "Política LGPD e termos para pacientes" }
};

const WEEKDAY_LABEL_TO_INT: Record<string, number> = {
  Domingo: 0,
  Segunda: 1,
  "Terça": 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  "Sábado": 6
};

const WEEKDAY_INT_TO_LABEL: Record<number, string> = Object.fromEntries(
  Object.entries(WEEKDAY_LABEL_TO_INT).map(([label, int]) => [int, label])
);

@Injectable()
export class OnboardingService {
  constructor(private readonly repo: OnboardingRepository) {}

  async initForTherapist(therapistId: string): Promise<void> {
    await this.repo.init(therapistId);
  }

  async getBootstrap(therapistId: string): Promise<TherapistOnboardingBootstrap> {
    let raw = await this.repo.findBootstrapData(therapistId);

    if (raw.completedSteps.length === 0 && raw.completedAt === null) {
      await this.repo.init(therapistId);
      raw = await this.repo.findBootstrapData(therapistId);
    }

    return this.buildBootstrap(raw);
  }

  async completeStep(
    therapistId: string,
    request: OnboardingCompleteStepRequest,
    ip = ""
  ): Promise<{ onboarding: TherapistOnboardingBootstrap; accountStatus: TherapistAccountStatus }> {
    const { step, payload } = request;

    switch (step) {
      case "welcome":
        await this.repo.markStepDone(therapistId, "welcome");
        break;

      case "profile": {
        await this.repo.upsertProfile(therapistId, {
          socialName: payload.socialName,
          crp: payload.crp,
          crpState: payload.crpState,
          phone: payload.phone,
          specialty: payload.specialty,
          miniBio: payload.miniBio,
          timezone: "America/Sao_Paulo"
        });
        if (payload.fullName) {
          await this.repo.updateTherapistName(therapistId, payload.fullName);
        }
        await this.repo.markStepDone(therapistId, "profile");
        break;
      }

      case "operations": {
        await this.repo.upsertPracticeAndTimezone(therapistId, {
          practiceName: payload.practiceName,
          practicePhone: payload.practicePhone,
          timezone: payload.timezone,
          pixKey: payload.pixKey,
          beneficiaryName: payload.beneficiaryName,
          paymentInstructions: payload.paymentInstructions
        });
        await this.repo.markStepDone(therapistId, "operations");
        break;
      }

      case "tax": {
        await this.repo.upsertBillingDocument(therapistId, payload.billingDocument);
        await this.repo.markStepDone(therapistId, "tax");
        break;
      }

      case "contracts": {
        const docs = [];
        if (payload.termsAccepted) {
          docs.push({ documentType: "terms_of_service", documentVersion: payload.contractVersion || "1.0" });
        }
        if (payload.dpaAccepted) {
          docs.push({ documentType: "dpa", documentVersion: payload.contractVersion || "1.0" });
        }
        if (payload.privacyAccepted) {
          docs.push({ documentType: "privacy_policy", documentVersion: payload.contractVersion || "1.0" });
        }
        await this.repo.insertLegalAcceptances(therapistId, docs, ip);
        await this.repo.markStepDone(therapistId, "contracts");
        break;
      }

      case "schedule": {
        await this.repo.upsertPolicies(therapistId, {
          sessionDurationMinutes: payload.sessionDurationMinutes,
          gapMinutes: payload.gapMinutes,
          defaultModality: payload.defaultModality,
          collectionPolicy: ""
        });

        const weekdayInts = payload.weekdays
          .map((label) => WEEKDAY_LABEL_TO_INT[label])
          .filter((n): n is number => n !== undefined);

        const windows = weekdayInts.map((weekday) => ({
          weekday,
          startTime: payload.startHour || "09:00",
          endTime: payload.endHour || "18:00"
        }));

        await this.repo.rebuildSchedule(therapistId, windows);
        await this.repo.markStepDone(therapistId, "schedule");
        break;
      }

      case "consents": {
        const docs = [];
        docs.push({ documentType: "lgpd_consent", documentVersion: "1.0" });
        docs.push({ documentType: "telehealth_consent", documentVersion: "1.0" });
        if (payload.aiTemplateId) {
          docs.push({ documentType: "ai_consent", documentVersion: "1.0" });
        }
        await this.repo.insertLegalAcceptances(therapistId, docs, ip);
        await this.repo.completeOnboarding(therapistId);
        break;
      }
    }

    const raw = await this.repo.findBootstrapData(therapistId);
    const onboarding = this.buildBootstrap(raw);
    const accountStatus = this.mapStatus(raw.therapistStatus);

    return { onboarding, accountStatus };
  }

  private buildBootstrap(raw: BootstrapRawData): TherapistOnboardingBootstrap {
    const completedSet = new Set(raw.completedSteps);
    const currentStep =
      ORDERED_STEPS.find((s) => !completedSet.has(s)) ?? ORDERED_STEPS[ORDERED_STEPS.length - 1]!;

    const steps = ORDERED_STEPS.map((key) => ({
      key,
      title: STEP_META[key].title,
      description: STEP_META[key].description,
      status: (completedSet.has(key)
        ? "completed"
        : key === currentStep
          ? "current"
          : "pending") as "completed" | "current" | "pending"
    }));

    const representativeWindow = raw.availabilityWindows[0];
    const weekdayLabels = raw.availabilityWeekdays
      .map((n) => WEEKDAY_INT_TO_LABEL[n] ?? "")
      .filter(Boolean);

    const accountStatus = this.mapStatus(raw.therapistStatus);

    return {
      accountStatus,
      currentStep,
      steps,
      blockingItems: [],
      consentTemplates: [],
      estimatedMinutesLabel: "~10 min",
      modeLabel: "Solo",
      draft: {
        welcomeAcknowledged: completedSet.has("welcome"),
        profile: {
          fullName: raw.therapistFullName,
          socialName: raw.profile?.socialName ?? "",
          crp: raw.profile?.crp ?? "",
          crpState: raw.profile?.crpState ?? "",
          cpf: "",
          birthDate: "",
          phone: raw.profile?.phone ?? "",
          professionalEmail: "",
          specialty: raw.profile?.specialty ?? "",
          miniBio: raw.profile?.miniBio ?? ""
        },
        operations: {
          practiceName: raw.practice?.practiceName ?? "",
          practicePhone: raw.practice?.phone ?? "",
          timezone: raw.profile?.timezone ?? "America/Sao_Paulo",
          pixKey: raw.practice?.pixKey ?? "",
          beneficiaryName: raw.practice?.beneficiaryName ?? "",
          paymentInstructions: raw.practice?.receiptInstructions ?? ""
        },
        tax: {
          regime: "",
          billingDocument: raw.practice?.billingDocument ?? "",
          city: "",
          emissionType: "",
          municipalRegistration: "",
          accountantName: ""
        },
        contracts: {
          termsAccepted: raw.legalAcceptances.some((a) => a.documentType === "terms_of_service"),
          dpaAccepted: raw.legalAcceptances.some((a) => a.documentType === "dpa"),
          privacyAccepted: raw.legalAcceptances.some((a) => a.documentType === "privacy_policy"),
          contractVersion: "1.0"
        },
        schedule: {
          weekdays: weekdayLabels,
          startHour: representativeWindow?.startTime ?? "09:00",
          endHour: representativeWindow?.endTime ?? "18:00",
          sessionDurationMinutes: raw.policies?.sessionDurationMinutes ?? 50,
          gapMinutes: raw.policies?.gapMinutes ?? 10,
          defaultModality: raw.policies?.defaultModality ?? "telehealth"
        },
        consents: {
          lgpdTemplateId: raw.legalAcceptances.some((a) => a.documentType === "lgpd_consent") ? "lgpd-v1" : "",
          telehealthTemplateId: raw.legalAcceptances.some((a) => a.documentType === "telehealth_consent") ? "telehealth-v1" : "",
          aiTemplateId: raw.legalAcceptances.some((a) => a.documentType === "ai_consent") ? "ai-v1" : "",
          defaultCollectionPolicy: raw.policies?.collectionPolicy ?? ""
        }
      }
    };
  }

  private mapStatus(dbStatus: string): TherapistAccountStatus {
    return dbStatus === "active" ? "ready_for_operations" : "pending_setup";
  }
}
