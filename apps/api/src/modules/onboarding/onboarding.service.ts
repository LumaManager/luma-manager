// apps/api/src/modules/onboarding/onboarding.service.ts
import { Injectable } from "@nestjs/common";

import { OnboardingRepository } from "./onboarding.repository";

export type OnboardingStatus = {
  completedSteps: string[];
  currentStep: string | null;
  isComplete: boolean;
  practiceName: string | null;
  practiceCity: string | null;
  practiceState: string | null;
  firstPatientCreated: boolean;
};

const ORDERED_STEPS = ["mfa_setup", "practice_info", "first_patient"] as const;

@Injectable()
export class OnboardingService {
  constructor(private readonly repo: OnboardingRepository) {}

  async getStatus(therapistId: string): Promise<OnboardingStatus> {
    let state = await this.repo.findByTherapistId(therapistId);

    // Self-healing: if row is missing (e.g. registration failed mid-way), create it now
    if (!state) {
      state = await this.repo.create(therapistId);
    }

    const completed = state.completedSteps; // already parsed by repository
    const nextStep = ORDERED_STEPS.find((s) => !completed.includes(s)) ?? null;

    return {
      completedSteps: completed,
      currentStep: nextStep,
      isComplete: nextStep === null,
      practiceName: state.practiceName ?? null,
      practiceCity: state.practiceCity ?? null,
      practiceState: state.practiceState ?? null,
      firstPatientCreated: state.firstPatientCreated
    };
  }

  async savePracticeInfo(
    therapistId: string,
    data: { practiceName: string; city: string; state: string }
  ): Promise<OnboardingStatus> {
    await this.repo.savePracticeInfo(therapistId, data);
    return this.getStatus(therapistId);
  }

  async markFirstPatientCreated(therapistId: string): Promise<void> {
    await this.repo.markFirstPatientCreated(therapistId);
  }

  async initForTherapist(therapistId: string): Promise<void> {
    const existing = await this.repo.findByTherapistId(therapistId);
    if (!existing) {
      await this.repo.create(therapistId);
    }
  }
}
