// apps/api/src/modules/auth/mfa.service.ts
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { Injectable } from "@nestjs/common";

import { MfaRepository } from "./mfa.repository";

const ISSUER = "Luma Manager";
const RECOVERY_CODE_COUNT = 8;
const TOTP_PERIOD = 30; // seconds
const TOTP_DIGITS = 6;
const TOTP_WINDOW = 1; // allow 1 step drift (±30 s)
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

// ---------------------------------------------------------------------------
// Minimal Base32 encode/decode (RFC 4648, no padding)
// ---------------------------------------------------------------------------

function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      output += BASE32_ALPHABET[(value >>> bits) & 0x1f];
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 0x1f];
  }
  return output;
}

function base32Decode(input: string): Buffer {
  const str = input.toUpperCase().replace(/=+$/, "");
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const char of str) {
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >>> bits) & 0xff);
    }
  }
  return Buffer.from(bytes);
}

// ---------------------------------------------------------------------------
// TOTP (RFC 6238) — synchronous, no external dependency
// ---------------------------------------------------------------------------

function generateTotpCode(secret: string, counter: bigint): string {
  const key = base32Decode(secret);
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(counter);
  const hmac = createHmac("sha1", key).update(msg).digest();
  const h = hmac as unknown as number[];
  const offset = (h[hmac.length - 1] ?? 0) & 0x0f;
  const code =
    (((h[offset] ?? 0) & 0x7f) << 24) |
    (((h[offset + 1] ?? 0) & 0xff) << 16) |
    (((h[offset + 2] ?? 0) & 0xff) << 8) |
    ((h[offset + 3] ?? 0) & 0xff);
  return String(code % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, "0");
}

function totpVerify(token: string, secret: string): boolean {
  const counter = BigInt(Math.floor(Date.now() / 1000 / TOTP_PERIOD));
  for (let i = -TOTP_WINDOW; i <= TOTP_WINDOW; i++) {
    const expected = generateTotpCode(secret, counter + BigInt(i));
    const a = Buffer.from(expected);
    const b = Buffer.from(token.slice(0, TOTP_DIGITS).padStart(TOTP_DIGITS, "0"));
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  }
  return false;
}

function generateTotpSecret(bytes = 20): string {
  return base32Encode(randomBytes(bytes));
}

function generateOtpAuthUrl(email: string, secret: string): string {
  const label = encodeURIComponent(`${ISSUER}:${email}`);
  const issuer = encodeURIComponent(ISSUER);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_PERIOD}`;
}

// ---------------------------------------------------------------------------
// MfaService
// ---------------------------------------------------------------------------

@Injectable()
export class MfaService {
  constructor(private readonly mfaRepository: MfaRepository) {}

  generateSecret(): string {
    return generateTotpSecret(20);
  }

  getOtpAuthUrl(email: string, secret: string): string {
    return generateOtpAuthUrl(email, secret);
  }

  verify(code: string, secret: string): boolean {
    return totpVerify(code, secret);
  }

  generateRecoveryCodes(): string[] {
    return Array.from({ length: RECOVERY_CODE_COUNT }, () =>
      randomBytes(5).toString("hex").toUpperCase()
    );
  }

  async setupForTherapist(therapistId: string): Promise<{ secret: string; recoveryCodes: string[] }> {
    const existing = await this.mfaRepository.findByTherapistId(therapistId);
    if (existing) {
      throw new Error("MFA already configured for this therapist");
    }
    const secret = this.generateSecret();
    const recoveryCodes = this.generateRecoveryCodes();
    await this.mfaRepository.create(therapistId, secret, recoveryCodes);
    return { secret, recoveryCodes };
  }

  async verifyForTherapist(therapistId: string, code: string): Promise<boolean> {
    const row = await this.mfaRepository.findByTherapistId(therapistId);
    if (!row) return false;

    // Try TOTP first (row.secret is the decrypted plaintext)
    if (this.verify(code, row.secret)) {
      if (!row.verified) {
        await this.mfaRepository.markVerified(therapistId);
      }
      return true;
    }

    // Try recovery code
    return this.mfaRepository.consumeRecoveryCode(therapistId, code.toUpperCase());
  }

  async isConfigured(therapistId: string): Promise<boolean> {
    const row = await this.mfaRepository.findByTherapistId(therapistId);
    return row?.verified ?? false;
  }
}
