// apps/api/src/modules/onboarding/onboarding.repository.ts
import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { and, eq, inArray } from "drizzle-orm";

import { DATABASE_CLIENT } from "@/common/tokens";
import {
  availabilityRules,
  availabilityWindows,
  onboardingState,
  therapistLegalAcceptances,
  therapistPolicies,
  therapistPractices,
  therapistProfiles,
  therapists
} from "@/db/schema";
import type { DrizzleClient } from "@/db/client";

export type BootstrapRawData = {
  completedSteps: string[];
  completedAt: Date | null;
  therapistFullName: string;
  therapistStatus: string;
  profile: {
    socialName: string;
    phone: string;
    crp: string;
    crpState: string;
    specialty: string;
    timezone: string;
    miniBio: string;
  } | null;
  practice: {
    practiceName: string;
    phone: string;
    pixKey: string;
    beneficiaryName: string;
    receiptInstructions: string;
    billingDocument: string;
  } | null;
  policies: {
    sessionDurationMinutes: number;
    gapMinutes: number;
    defaultModality: string;
    collectionPolicy: string;
  } | null;
  availabilityWeekdays: number[];
  availabilityWindows: { weekday: number; startTime: string; endTime: string }[];
  legalAcceptances: { documentType: string; documentVersion: string }[];
};

export type ProfileData = {
  socialName: string;
  crp: string;
  crpState: string;
  phone: string;
  specialty: string;
  miniBio: string;
  timezone: string;
};

export type OperationsData = {
  practiceName: string;
  practicePhone: string;
  timezone: string;
  pixKey: string;
  beneficiaryName: string;
  paymentInstructions: string;
};

export type PoliciesData = {
  sessionDurationMinutes: number;
  gapMinutes: number;
  defaultModality: string;
  collectionPolicy: string;
};

export type WindowInput = {
  weekday: number;
  startTime: string;
  endTime: string;
};

export type AcceptanceInput = {
  documentType: string;
  documentVersion: string;
};

@Injectable()
export class OnboardingRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  async init(therapistId: string): Promise<void> {
    const existing = await this.db
      .select({ id: onboardingState.id })
      .from(onboardingState)
      .where(eq(onboardingState.therapistId, therapistId))
      .limit(1);

    if (!existing[0]) {
      await this.db.insert(onboardingState).values({
        id: randomUUID(),
        therapistId,
        completedSteps: "[]"
      });
    }
  }

  async findBootstrapData(therapistId: string): Promise<BootstrapRawData> {
    const [stateRows, therapistRows, profileRows, practiceRows, policyRows, ruleRows, acceptanceRows] =
      await Promise.all([
        this.db
          .select({
            completedSteps: onboardingState.completedSteps,
            completedAt: onboardingState.completedAt
          })
          .from(onboardingState)
          .where(eq(onboardingState.therapistId, therapistId))
          .limit(1),
        this.db
          .select({ fullName: therapists.fullName, status: therapists.status })
          .from(therapists)
          .where(eq(therapists.id, therapistId))
          .limit(1),
        this.db
          .select()
          .from(therapistProfiles)
          .where(eq(therapistProfiles.therapistId, therapistId))
          .limit(1),
        this.db
          .select()
          .from(therapistPractices)
          .where(eq(therapistPractices.therapistId, therapistId))
          .limit(1),
        this.db
          .select()
          .from(therapistPolicies)
          .where(eq(therapistPolicies.therapistId, therapistId))
          .limit(1),
        this.db
          .select({ id: availabilityRules.id, weekday: availabilityRules.weekday })
          .from(availabilityRules)
          .where(and(eq(availabilityRules.therapistId, therapistId), eq(availabilityRules.enabled, true))),
        this.db
          .select({ documentType: therapistLegalAcceptances.documentType, documentVersion: therapistLegalAcceptances.documentVersion })
          .from(therapistLegalAcceptances)
          .where(eq(therapistLegalAcceptances.therapistId, therapistId))
      ]);

    const state = stateRows[0];
    const therapist = therapistRows[0];
    const profile = profileRows[0] ?? null;
    const practice = practiceRows[0] ?? null;
    const policies = policyRows[0] ?? null;

    const weekdays = ruleRows.map((r) => r.weekday);
    const ruleIds = ruleRows.map((r) => r.id);
    let windowRows: { weekday: number; startTime: string; endTime: string }[] = [];

    if (ruleIds.length > 0) {
      const windows = await this.db
        .select({
          ruleId: availabilityWindows.ruleId,
          startTime: availabilityWindows.startTime,
          endTime: availabilityWindows.endTime
        })
        .from(availabilityWindows)
        .where(inArray(availabilityWindows.ruleId, ruleIds));

      const ruleWeekdayMap = new Map(ruleRows.map((r) => [r.id, r.weekday]));
      windowRows = windows.map((w) => ({
        weekday: ruleWeekdayMap.get(w.ruleId) ?? 1,
        startTime: w.startTime,
        endTime: w.endTime
      }));
    }

    return {
      completedSteps: state ? (JSON.parse(state.completedSteps) as string[]) : [],
      completedAt: state?.completedAt ?? null,
      therapistFullName: therapist?.fullName ?? "",
      therapistStatus: therapist?.status ?? "pending_onboarding",
      profile: profile
        ? {
            socialName: profile.socialName,
            phone: profile.phone,
            crp: profile.crp,
            crpState: profile.crpState,
            specialty: profile.specialty,
            timezone: profile.timezone,
            miniBio: profile.miniBio
          }
        : null,
      practice: practice
        ? {
            practiceName: practice.practiceName,
            phone: practice.phone,
            pixKey: practice.pixKey,
            beneficiaryName: practice.beneficiaryName,
            receiptInstructions: practice.receiptInstructions,
            billingDocument: practice.billingDocument
          }
        : null,
      policies: policies
        ? {
            sessionDurationMinutes: policies.sessionDurationMinutes,
            gapMinutes: policies.gapMinutes,
            defaultModality: policies.defaultModality,
            collectionPolicy: policies.collectionPolicy
          }
        : null,
      availabilityWeekdays: weekdays,
      availabilityWindows: windowRows,
      legalAcceptances: acceptanceRows
    };
  }

  async markStepDone(therapistId: string, step: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      const rows = await tx
        .select({ completedSteps: onboardingState.completedSteps })
        .from(onboardingState)
        .where(eq(onboardingState.therapistId, therapistId))
        .limit(1);

      if (!rows[0]) return;

      const steps: string[] = JSON.parse(rows[0].completedSteps);
      if (!steps.includes(step)) steps.push(step);

      await tx
        .update(onboardingState)
        .set({ completedSteps: JSON.stringify(steps), updatedAt: new Date() })
        .where(eq(onboardingState.therapistId, therapistId));
    });
  }

  async upsertProfile(therapistId: string, data: ProfileData): Promise<void> {
    await this.db
      .insert(therapistProfiles)
      .values({
        id: randomUUID(),
        therapistId,
        socialName: data.socialName,
        phone: data.phone,
        crp: data.crp,
        crpState: data.crpState,
        specialty: data.specialty,
        timezone: data.timezone,
        miniBio: data.miniBio
      })
      .onConflictDoUpdate({
        target: therapistProfiles.therapistId,
        set: {
          socialName: data.socialName,
          phone: data.phone,
          crp: data.crp,
          crpState: data.crpState,
          specialty: data.specialty,
          timezone: data.timezone,
          miniBio: data.miniBio,
          updatedAt: new Date()
        }
      });
  }

  async updateTherapistName(therapistId: string, fullName: string): Promise<void> {
    await this.db
      .update(therapists)
      .set({ fullName, updatedAt: new Date() })
      .where(eq(therapists.id, therapistId));
  }

  async upsertPracticeAndTimezone(therapistId: string, data: OperationsData): Promise<void> {
    await this.db
      .insert(therapistPractices)
      .values({
        id: randomUUID(),
        therapistId,
        practiceName: data.practiceName,
        displayName: data.practiceName,
        phone: data.practicePhone,
        pixKey: data.pixKey,
        beneficiaryName: data.beneficiaryName,
        receiptInstructions: data.paymentInstructions
      })
      .onConflictDoUpdate({
        target: therapistPractices.therapistId,
        set: {
          practiceName: data.practiceName,
          displayName: data.practiceName,
          phone: data.practicePhone,
          pixKey: data.pixKey,
          beneficiaryName: data.beneficiaryName,
          receiptInstructions: data.paymentInstructions,
          updatedAt: new Date()
        }
      });

    await this.db
      .insert(therapistProfiles)
      .values({ id: randomUUID(), therapistId, timezone: data.timezone })
      .onConflictDoUpdate({
        target: therapistProfiles.therapistId,
        set: { timezone: data.timezone, updatedAt: new Date() }
      });
  }

  async upsertBillingDocument(therapistId: string, billingDocument: string): Promise<void> {
    await this.db
      .insert(therapistPractices)
      .values({ id: randomUUID(), therapistId, billingDocument })
      .onConflictDoUpdate({
        target: therapistPractices.therapistId,
        set: { billingDocument, updatedAt: new Date() }
      });
  }

  async upsertPolicies(therapistId: string, data: PoliciesData): Promise<void> {
    await this.db
      .insert(therapistPolicies)
      .values({
        id: randomUUID(),
        therapistId,
        sessionDurationMinutes: data.sessionDurationMinutes,
        gapMinutes: data.gapMinutes,
        defaultModality: data.defaultModality,
        collectionPolicy: data.collectionPolicy
      })
      .onConflictDoUpdate({
        target: therapistPolicies.therapistId,
        set: {
          sessionDurationMinutes: data.sessionDurationMinutes,
          gapMinutes: data.gapMinutes,
          defaultModality: data.defaultModality,
          collectionPolicy: data.collectionPolicy,
          updatedAt: new Date()
        }
      });
  }

  async rebuildSchedule(therapistId: string, windows: WindowInput[]): Promise<void> {
    await this.db.transaction(async (tx) => {
      const existingRules = await tx
        .select({ id: availabilityRules.id })
        .from(availabilityRules)
        .where(eq(availabilityRules.therapistId, therapistId));

      if (existingRules.length > 0) {
        const ruleIds = existingRules.map((r) => r.id);
        await tx.delete(availabilityWindows).where(inArray(availabilityWindows.ruleId, ruleIds));
        await tx.delete(availabilityRules).where(eq(availabilityRules.therapistId, therapistId));
      }

      if (windows.length === 0) return;

      const weekdaysInWindows = [...new Set(windows.map((w) => w.weekday))];
      const ruleMap = new Map<number, string>();

      for (const weekday of weekdaysInWindows) {
        const ruleId = randomUUID();
        ruleMap.set(weekday, ruleId);
        await tx.insert(availabilityRules).values({
          id: ruleId,
          therapistId,
          weekday,
          enabled: true
        });
      }

      for (const window of windows) {
        const ruleId = ruleMap.get(window.weekday);
        if (!ruleId) continue;
        await tx.insert(availabilityWindows).values({
          id: randomUUID(),
          ruleId,
          startTime: window.startTime,
          endTime: window.endTime
        });
      }
    });
  }

  async insertLegalAcceptances(
    therapistId: string,
    docs: AcceptanceInput[],
    ip: string
  ): Promise<void> {
    if (docs.length === 0) return;
    const now = new Date();
    await this.db.insert(therapistLegalAcceptances).values(
      docs.map((doc) => ({
        id: randomUUID(),
        therapistId,
        documentType: doc.documentType,
        documentVersion: doc.documentVersion,
        acceptedAt: now,
        ipAddress: ip
      }))
    );
  }

  async completeOnboarding(therapistId: string): Promise<void> {
    const now = new Date();
    await this.db.transaction(async (tx) => {
      await tx
        .update(onboardingState)
        .set({ completedAt: now, updatedAt: now })
        .where(eq(onboardingState.therapistId, therapistId));

      await tx
        .update(therapists)
        .set({ status: "active", updatedAt: now })
        .where(eq(therapists.id, therapistId));
    });
  }
}
