import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import type { DrizzleClient } from "@/db/client";
import { DATABASE_CLIENT } from "@/common/tokens";
import { consentDocuments } from "@/db/schema";

export type ConsentDocumentRow = typeof consentDocuments.$inferSelect;

export type CreateConsentDocumentInput = {
  patientId: string;
  therapistId: string;
  documentVersion: string;
  token: string;
  tokenExpiresAt: Date;
};

@Injectable()
export class ConsentRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  async create(input: CreateConsentDocumentInput): Promise<ConsentDocumentRow> {
    const id = randomUUID();
    const now = new Date();

    const rows = await this.db
      .insert(consentDocuments)
      .values({
        id,
        patientId: input.patientId,
        therapistId: input.therapistId,
        documentType: "recording_consent",
        documentVersion: input.documentVersion,
        token: input.token,
        tokenExpiresAt: input.tokenExpiresAt,
        status: "pending",
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return rows[0];
  }

  async findByToken(token: string): Promise<ConsentDocumentRow | null> {
    const rows = await this.db
      .select()
      .from(consentDocuments)
      .where(eq(consentDocuments.token, token))
      .limit(1);

    return rows[0] ?? null;
  }

  async findByPatientAndTherapist(
    patientId: string,
    therapistId: string
  ): Promise<ConsentDocumentRow | null> {
    const rows = await this.db
      .select()
      .from(consentDocuments)
      .where(eq(consentDocuments.patientId, patientId))
      .limit(1);

    return rows.find(r => r.therapistId === therapistId) ?? null;
  }

  async markSigned(
    token: string,
    signerName: string,
    signerIp: string
  ): Promise<ConsentDocumentRow | null> {
    const now = new Date();
    const rows = await this.db
      .update(consentDocuments)
      .set({
        status: "signed",
        signedAt: now,
        signerName,
        signerIp,
        updatedAt: now
      })
      .where(eq(consentDocuments.token, token))
      .returning();

    return rows[0] ?? null;
  }

  async markExpired(token: string): Promise<void> {
    await this.db
      .update(consentDocuments)
      .set({ status: "expired", updatedAt: new Date() })
      .where(eq(consentDocuments.token, token));
  }
}
