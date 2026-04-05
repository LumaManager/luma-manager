import { createSecretKey } from "node:crypto";

import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { SignJWT, jwtVerify } from "jose";
import type { AuthSession } from "@terapia/contracts";

import { EnvService } from "@/common/config/env.service";

type SessionPayload = {
  accountStatus: AuthSession["accountStatus"];
  capabilities: AuthSession["capabilities"];
  expiresAt: string;
  mfaVerified: boolean;
  therapist: AuthSession["therapist"];
};

@Injectable()
export class AppSessionService {
  constructor(@Inject(EnvService) private readonly envService: EnvService) {}

  private getSecret() {
    return createSecretKey(Buffer.from(this.envService.values.APP_SESSION_SECRET, "utf8"));
  }

  async sign(session: Omit<AuthSession, "accessToken">) {
    const expiresAt = new Date(session.expiresAt);

    return new SignJWT({
      therapist: session.therapist,
      accountStatus: session.accountStatus,
      capabilities: session.capabilities,
      mfaVerified: session.mfaVerified,
      expiresAt: session.expiresAt
    } satisfies SessionPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .sign(this.getSecret());
  }

  async verify(token: string): Promise<AuthSession> {
    try {
      const { payload } = await jwtVerify(token, this.getSecret());
      const sessionPayload = payload as SessionPayload;

      return {
        accessToken: token,
        accountStatus: sessionPayload.accountStatus,
        capabilities: sessionPayload.capabilities,
        expiresAt: sessionPayload.expiresAt,
        mfaVerified: sessionPayload.mfaVerified,
        therapist: sessionPayload.therapist
      };
    } catch {
      throw new UnauthorizedException("Sessao invalida ou expirada.");
    }
  }
}
