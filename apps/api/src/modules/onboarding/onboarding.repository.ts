// apps/api/src/modules/onboarding/onboarding.repository.ts
import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { and, eq, isNull } from "drizzle-orm";

import { DATABASE_CLIENT } from "@/common/tokens";
import { onboardingState } from "@/db/schema";
import type { DrizzleClient } from "@/db/client";

export type OnboardingRow = {
  id: string;
  therapistId: string;
  completedSteps: string[]; // already parsed
  practiceName: string | null;
  practiceCity: string | null;
  practiceState: string | null;
  firstPatientCreated: boolean;
  completedAt: Date | null;
  updatedAt: Date;
};

@Injectable()
export class OnboardingRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  async findByTherapistId(therapistId: string): Promise<OnboardingRow | null> {
    const rows = await this.db
      .select()
      .from(onboardingState)
      .where(eq(onboardingState.therapistId, therapistId))
      .limit(1);

    if (!rows[0]) return null;
    const row = rows[0];
    return {
      ...row,
      completedSteps: JSON.parse(row.completedSteps) as string[]
    };
  }

  async create(therapistId: string): Promise<OnboardingRow> {
    const rows = await this.db
      .insert(onboardingState)
      .values({
        id: randomUUID(),
        therapistId,
        completedSteps: JSON.stringify(["mfa_setup"])
      })
      .returning();

    const row = rows[0];
    if (!row) throw new Error("Failed to create onboarding state");
    return { ...row, completedSteps: JSON.parse(row.completedSteps) as string[] };
  }

  async savePracticeInfo(
    therapistId: string,
    data: { practiceName: string; city: string; state: string }
  ): Promise<void> {
    // Atomic: read current steps + update practice info + mark step done in a single transaction
    await this.db.transaction(async (tx) => {
      const rows = await tx
        .select({ completedSteps: onboardingState.completedSteps })
        .from(onboardingState)
        .where(eq(onboardingState.therapistId, therapistId))
        .limit(1);

      if (!rows[0]) return;

      const steps: string[] = JSON.parse(rows[0].completedSteps);
      if (!steps.includes("practice_info")) steps.push("practice_info");

      await tx
        .update(onboardingState)
        .set({
          practiceName: data.practiceName,
          practiceCity: data.city,
          practiceState: data.state,
          completedSteps: JSON.stringify(steps),
          updatedAt: new Date()
        })
        .where(eq(onboardingState.therapistId, therapistId));
    });
  }

  async markFirstPatientCreated(therapistId: string): Promise<void> {
    // Atomic: read current steps + mark done + set completedAt (only if not already set)
    await this.db.transaction(async (tx) => {
      const rows = await tx
        .select({ completedSteps: onboardingState.completedSteps, completedAt: onboardingState.completedAt })
        .from(onboardingState)
        .where(eq(onboardingState.therapistId, therapistId))
        .limit(1);

      if (!rows[0]) return;

      const steps: string[] = JSON.parse(rows[0].completedSteps);
      if (!steps.includes("first_patient")) steps.push("first_patient");

      const now = new Date();
      await tx
        .update(onboardingState)
        .set({
          firstPatientCreated: true,
          // Only set completedAt the first time (guard against overwrite)
          ...(rows[0].completedAt === null ? { completedAt: now } : {}),
          completedSteps: JSON.stringify(steps),
          updatedAt: now
        })
        .where(eq(onboardingState.therapistId, therapistId));
    });
  }
}
