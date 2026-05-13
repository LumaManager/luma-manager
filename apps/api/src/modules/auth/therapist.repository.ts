// apps/api/src/modules/auth/therapist.repository.ts
import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DATABASE_CLIENT } from "@/common/tokens";
import { tenants, therapists } from "@/db/schema";
import type { DrizzleClient } from "@/db/client";

export type CreateTherapistInput = {
  email: string;
  passwordHash: string;
  fullName: string;
  practiceName: string;
};

@Injectable()
export class TherapistRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  async findByEmail(email: string) {
    const rows = await this.db
      .select()
      .from(therapists)
      .where(eq(therapists.email, email.toLowerCase()))
      .limit(1);

    return rows[0] ?? null;
  }

  async findById(id: string) {
    const rows = await this.db
      .select()
      .from(therapists)
      .where(eq(therapists.id, id))
      .limit(1);

    return rows[0] ?? null;
  }

  async findByIdWithTenant(id: string) {
    const rows = await this.db
      .select({
        id:              therapists.id,
        email:           therapists.email,
        fullName:        therapists.fullName,
        role:            therapists.role,
        status:          therapists.status,
        tenantId:        therapists.tenantId,
        practiceName:    tenants.name,
        emailVerifiedAt: therapists.emailVerifiedAt
      })
      .from(therapists)
      .innerJoin(tenants, eq(tenants.id, therapists.tenantId))
      .where(eq(therapists.id, id))
      .limit(1);

    return rows[0] ?? null;
  }

  async setEmailVerified(therapistId: string) {
    await this.db
      .update(therapists)
      .set({ emailVerifiedAt: new Date() })
      .where(eq(therapists.id, therapistId));
  }

  async markPendingDeletion(therapistId: string): Promise<void> {
    await this.db
      .update(therapists)
      .set({ status: "pending_deletion" })
      .where(eq(therapists.id, therapistId));
  }

  async create(input: CreateTherapistInput) {
    const tenantId = randomUUID();
    const therapistId = randomUUID();

    return this.db.transaction(async (tx) => {
      await tx.insert(tenants).values({
        id: tenantId,
        name: input.practiceName,
        shortName: input.practiceName.slice(0, 30),
        status: "active"
      });

      const [therapist] = await tx
        .insert(therapists)
        .values({
          id: therapistId,
          tenantId,
          email: input.email.toLowerCase(),
          passwordHash: input.passwordHash,
          fullName: input.fullName,
          role: "owner",
          status: "pending_onboarding"
        })
        .returning();

      return therapist;
    });
  }
}
