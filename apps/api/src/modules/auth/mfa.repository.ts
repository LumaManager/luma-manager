// apps/api/src/modules/auth/mfa.repository.ts
import { createCipheriv, createDecipheriv, randomBytes, randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DATABASE_CLIENT } from "@/common/tokens";
import { mfaSecrets } from "@/db/schema";
import type { DrizzleClient } from "@/db/client";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV for GCM

@Injectable()
export class MfaRepository {
  constructor(
    @Inject(DATABASE_CLIENT) private readonly db: DrizzleClient,
    private readonly encryptionKey: Buffer
  ) {}

  private encrypt(plaintext: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, this.encryptionKey, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    // Format: iv:tag:ciphertext (all hex)
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
  }

  private decrypt(stored: string): string {
    const parts = stored.split(":");
    const ivHex = parts[0];
    const tagHex = parts[1];
    const ciphertextHex = parts[2];
    if (!ivHex || !tagHex || !ciphertextHex) {
      throw new Error("Invalid encrypted secret format");
    }
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const ciphertext = Buffer.from(ciphertextHex, "hex");
    const decipher = createDecipheriv(ALGORITHM, this.encryptionKey, iv);
    decipher.setAuthTag(tag);
    return decipher.update(ciphertext).toString("utf8") + decipher.final("utf8");
  }

  async findByTherapistId(therapistId: string) {
    const rows = await this.db
      .select()
      .from(mfaSecrets)
      .where(eq(mfaSecrets.therapistId, therapistId))
      .limit(1);

    if (!rows[0]) return null;

    const row = rows[0];
    return {
      ...row,
      secret: this.decrypt(row.encryptedSecret) // expose as `secret` to service layer
    };
  }

  async create(therapistId: string, secret: string, recoveryCodes: string[]) {
    const [row] = await this.db
      .insert(mfaSecrets)
      .values({
        id: randomUUID(),
        therapistId,
        encryptedSecret: this.encrypt(secret),
        verified: false,
        recoveryCodes: JSON.stringify(recoveryCodes)
      })
      .returning();

    return row;
  }

  async markVerified(therapistId: string) {
    await this.db
      .update(mfaSecrets)
      .set({ verified: true })
      .where(eq(mfaSecrets.therapistId, therapistId));
  }

  async consumeRecoveryCode(therapistId: string, code: string): Promise<boolean> {
    const row = await this.findByTherapistId(therapistId);
    if (!row) return false;

    const codes: string[] = JSON.parse(row.recoveryCodes);
    const index = codes.indexOf(code);
    if (index === -1) return false;

    codes.splice(index, 1);
    await this.db
      .update(mfaSecrets)
      .set({ recoveryCodes: JSON.stringify(codes) })
      .where(eq(mfaSecrets.therapistId, therapistId));

    return true;
  }
}
