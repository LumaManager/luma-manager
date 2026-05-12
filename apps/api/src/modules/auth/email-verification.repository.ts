import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { and, eq, isNull } from "drizzle-orm";

import type { DrizzleClient } from "@/db/client";
import { DATABASE_CLIENT } from "@/common/tokens";
import { emailVerificationTokens } from "@/db/schema";

@Injectable()
export class EmailVerificationRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  async create(therapistId: string, expiresAt: Date) {
    const token = randomUUID();
    const id    = randomUUID();

    await this.db.insert(emailVerificationTokens).values({
      id,
      therapistId,
      token,
      expiresAt
    });

    return token;
  }

  async findByToken(token: string) {
    const rows = await this.db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token))
      .limit(1);

    return rows[0] ?? null;
  }

  async markUsed(id: string) {
    await this.db
      .update(emailVerificationTokens)
      .set({ usedAt: new Date() })
      .where(eq(emailVerificationTokens.id, id));
  }

  async invalidatePreviousTokens(therapistId: string) {
    await this.db
      .update(emailVerificationTokens)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(emailVerificationTokens.therapistId, therapistId),
          isNull(emailVerificationTokens.usedAt)
        )
      );
  }
}
