// apps/api/src/modules/onboarding/onboarding.repository.ts
import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DATABASE_CLIENT } from "@/common/tokens";
import { onboardingState } from "@/db/schema";
import type { DrizzleClient } from "@/db/client";

@Injectable()
export class OnboardingRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  async findByTherapistId(therapistId: string) {
    const rows = await this.db
      .select()
      .from(onboardingState)
      .where(eq(onboardingState.therapistId, therapistId))
      .limit(1);

    return rows[0] ?? null;
  }

  async create(therapistId: string) {
    const [row] = await this.db
      .insert(onboardingState)
      .values({
        id: randomUUID(),
        therapistId,
        completedSteps: JSON.stringify(["mfa_setup"])
      })
      .returning();

    return row;
  }

  async completeStep(therapistId: string, step: string) {
    const current = await this.findByTherapistId(therapistId);
    if (!current) return;

    const steps: string[] = JSON.parse(current.completedSteps);
    if (!steps.includes(step)) steps.push(step);

    await this.db
      .update(onboardingState)
      .set({ completedSteps: JSON.stringify(steps), updatedAt: new Date() })
      .where(eq(onboardingState.therapistId, therapistId));
  }

  async savePracticeInfo(therapistId: string, data: { practiceName: string; city: string; state: string }) {
    await this.db
      .update(onboardingState)
      .set({
        practiceName: data.practiceName,
        practiceCity: data.city,
        practiceState: data.state,
        updatedAt: new Date()
      })
      .where(eq(onboardingState.therapistId, therapistId));

    await this.completeStep(therapistId, "practice_info");
  }

  async markFirstPatientCreated(therapistId: string) {
    await this.db
      .update(onboardingState)
      .set({
        firstPatientCreated: true,
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(onboardingState.therapistId, therapistId));

    await this.completeStep(therapistId, "first_patient");
  }
}
