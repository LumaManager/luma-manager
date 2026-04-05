import { randomUUID } from "node:crypto";

import {
  Inject,
  Injectable,
  NotImplementedException,
  UnauthorizedException
} from "@nestjs/common";
import {
  authLoginRequestSchema,
  authMfaVerifyRequestSchema,
  type AuthLoginRequest,
  type AuthLoginResponse,
  type AuthSession
} from "@terapia/contracts";

import { EnvService } from "@/common/config/env.service";
import { InternalOpsService } from "@/modules/internal/internal-ops.service";
import { SupabaseService } from "@/modules/platform/supabase/supabase.service";
import { WorkspaceStateService } from "@/modules/account/workspace-state.service";

import { AppSessionService } from "./app-session.service";

type PendingChallenge = {
  email: string;
  expiresAt: number;
};

@Injectable()
export class AuthService {
  private readonly pendingChallenges = new Map<string, PendingChallenge>();

  constructor(
    @Inject(EnvService) private readonly envService: EnvService,
    @Inject(AppSessionService) private readonly appSessionService: AppSessionService,
    @Inject(SupabaseService) private readonly supabaseService: SupabaseService,
    @Inject(WorkspaceStateService) private readonly workspaceStateService: WorkspaceStateService,
    @Inject(InternalOpsService) private readonly internalOpsService: InternalOpsService
  ) {}

  async login(input: AuthLoginRequest): Promise<AuthLoginResponse> {
    const payload = authLoginRequestSchema.parse(input);

    if (this.envService.values.AUTH_PROVIDER === "supabase") {
      await this.assertSupabaseLogin(payload);
    } else {
      this.assertMockLogin(payload);
    }

    const challengeId = randomUUID();

    this.pendingChallenges.set(challengeId, {
      email: payload.email,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    return {
      challengeId,
      requiresMfa: true,
      mfaMethod: "totp",
      expiresInSeconds: 300,
      hint: "Use o aplicativo autenticador configurado para a conta do terapeuta."
    };
  }

  async verifyMfa(input: unknown): Promise<AuthSession> {
    const payload = authMfaVerifyRequestSchema.parse(input);
    const challenge = this.pendingChallenges.get(payload.challengeId);

    if (!challenge || challenge.expiresAt < Date.now()) {
      throw new UnauthorizedException("Desafio de MFA expirado. Inicie o login novamente.");
    }

    if (payload.code !== this.envService.values.MOCK_MFA_CODE) {
      throw new UnauthorizedException("Codigo de MFA invalido.");
    }

    const baseSession = this.internalOpsService.isInternalEmail(challenge.email)
      ? {
          accountStatus: "ready_for_operations" as const,
          capabilities: {
            audioTranscription: false,
            brazilOnlyProcessing: true,
            patientPortalPayments: false,
            stepUpAuthentication: true
          },
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
          mfaVerified: true,
          therapist: this.internalOpsService.getInternalTherapistProfile(challenge.email)
        }
      : (() => {
          const workspaceAccount = this.workspaceStateService.getAccountByEmail(challenge.email);

          return {
            accountStatus: workspaceAccount.status,
            capabilities: workspaceAccount.capabilities,
            expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
            mfaVerified: true,
            therapist: workspaceAccount.therapist
          };
        })();

    const accessToken = await this.appSessionService.sign(baseSession);

    this.pendingChallenges.delete(payload.challengeId);

    return {
      ...baseSession,
      accessToken
    };
  }

  async getSessionFromAuthorizationHeader(authorization?: string) {
    const token = authorization?.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      throw new UnauthorizedException("Credenciais ausentes.");
    }

    const session = await this.appSessionService.verify(token);
    if (this.internalOpsService.isInternalEmail(session.therapist.email)) {
      return session;
    }

    return this.workspaceStateService.hydrateSession(session);
  }

  async logout() {
    return { success: true };
  }

  private assertMockLogin(payload: AuthLoginRequest) {
    const knownWorkspaceUser = (() => {
      try {
        this.workspaceStateService.getAccountByEmail(payload.email);
        return true;
      } catch {
        return false;
      }
    })();

    const knownInternalUser = this.internalOpsService.isInternalEmail(payload.email);

    if (!knownWorkspaceUser && !knownInternalUser) {
      throw new UnauthorizedException("E-mail ou senha invalidos.");
    }

    if (payload.password !== this.envService.values.MOCK_THERAPIST_PASSWORD) {
      throw new UnauthorizedException("E-mail ou senha invalidos.");
    }
  }

  private async assertSupabaseLogin(payload: AuthLoginRequest) {
    if (!this.supabaseService.adminClient) {
      throw new NotImplementedException(
        "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar configurados para auth real."
      );
    }

    const { error } = await this.supabaseService.adminClient.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
