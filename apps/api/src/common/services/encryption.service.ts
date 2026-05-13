import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";

import { EnvService } from "@/common/config/env.service";

const ALGORITHM  = "aes-256-gcm";
const IV_LENGTH  = 12;  // GCM standard: 12 bytes
const TAG_LENGTH = 16;

@Injectable()
export class EncryptionService {
  constructor(@Inject(EnvService) private readonly env: EnvService) {}

  encrypt(plaintext: string): string {
    if (!plaintext) return "";

    const keyHex = this.env.values.DATA_ENCRYPTION_KEY;
    if (!keyHex) return plaintext; // dev without key: store as plaintext

    const key    = Buffer.from(keyHex, "hex");
    const iv     = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const authTag   = cipher.getAuthTag();

    // Format: enc:ivHex:authTagHex:ciphertextHex
    return `enc:${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
  }

  decrypt(ciphertext: string): string {
    if (!ciphertext || !ciphertext.startsWith("enc:")) {
      // Plaintext (legacy or dev without key)
      return ciphertext;
    }

    const keyHex = this.env.values.DATA_ENCRYPTION_KEY;
    if (!keyHex) return ciphertext;

    const parts = ciphertext.split(":");
    if (parts.length !== 4) return ciphertext;

    const [, ivHex, authTagHex, encHex] = parts as [string, string, string, string];
    const key       = Buffer.from(keyHex, "hex");
    const iv        = Buffer.from(ivHex, "hex");
    const authTag   = Buffer.from(authTagHex, "hex");
    const encrypted = Buffer.from(encHex, "hex");

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    return decipher.update(encrypted).toString("utf8") + decipher.final("utf8");
  }
}
