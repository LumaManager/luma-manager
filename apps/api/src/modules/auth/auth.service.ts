// apps/api/src/modules/auth/auth.service.ts
import { randomUUID } from "node:crypto";

import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { OnModuleInit } from "@nestjs/common";
import {
  authLoginRequestSchema,
  authMfaVerifyRequestSchema,
  type AuthLoginRequest,
  type AuthLoginResponse,
  type AuthSession,
  type RegisterRequest,
  type RegisterResponse,
  type VerifyEmailResponse
} from "@terapia/contracts";

import { EnvService } from "@/common/config/env.service";
import { MfaService } from "./mfa.service";
import { PasswordService } from "./password.service";
import { TherapistRepository } from "./therapist.repository";
import { AppSessionService } from "./app-session.service";
import { OnboardingService } from "@/modules/onboarding/onboarding.service";
import { EmailVerificationRepository } from "./email-verification.repository";
import { EmailService } from "@/modules/platform/email/email.service";
import { AuditService } from "@/modules/audit/audit.service";

type PendingChallenge = {
  therapistId: string;
  email: string;
  expiresAt: number;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly pendingChallenges = new Map<string, PendingChallenge>();
  private sweepInterval?: ReturnType<typeof setInterval>;

  onModuleInit() {
    this.sweepInterval = setInterval(() => {
      const now = Date.now();
      for (const [id, ch] of this.pendingChallenges) {
        if (ch.expiresAt < now) this.pendingChallenges.delete(id);
      }
    }, 60_000);
  }

  constructor(
    @Inject(EnvService)                  private readonly env: EnvService,
    @Inject(AppSessionService)           private readonly appSessionService: AppSessionService,
    @Inject(TherapistRepository)         private readonly therapistRepository: TherapistRepository,
    @Inject(PasswordService)             private readonly passwordService: PasswordService,
    @Inject(MfaService)                  private readonly mfaService: MfaService,
    @Inject(OnboardingService)           private readonly onboardingService: OnboardingService,
    @Inject(EmailService)                private readonly emailService: EmailService,
    @Inject(EmailVerificationRepository) private readonly emailVerifRepo: EmailVerificationRepository,
    @Inject(AuditService)                private readonly auditService: AuditService
  ) {}

  async register(input: RegisterRequest): Promise<RegisterResponse> {
    const existing = await this.therapistRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictException("Este e-mail já está cadastrado.");
    }

    const passwordHash = await this.passwordService.hash(input.password);
    const therapist = await this.therapistRepository.create({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      practiceName: input.practiceName
    });

    if (!therapist) throw new Error("Failed to create therapist account.");

    await this.onboardingService.initForTherapist(therapist.id);

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const token = await this.emailVerifRepo.create(therapist.id, expiresAt);
    const appUrl = this.env.get("APP_PUBLIC_URL");
    const verifyUrl = `${appUrl}/confirmar-email?token=${token}`;

    await this.emailService.sendEmailVerification(therapist.email, therapist.fullName, verifyUrl);

    return { emailSent: true, email: therapist.email };
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const record = await this.emailVerifRepo.findByToken(token);

    if (!record)                       throw new BadRequestException("Token inválido.");
    if (record.usedAt)                 throw new BadRequestException("Este link já foi utilizado.");
    if (record.expiresAt < new Date()) throw new BadRequestException("Link expirado. Solicite um novo.");

    await this.emailVerifRepo.markUsed(record.id);
    await this.therapistRepository.setEmailVerified(record.therapistId);

    return { verified: true };
  }

  async resendVerification(email: string): Promise<{ sent: true }> {
    const therapist = await this.therapistRepository.findByEmail(email);

    if (!therapist || therapist.emailVerifiedAt) return { sent: true };

    await this.emailVerifRepo.invalidatePreviousTokens(therapist.id);

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const token = await this.emailVerifRepo.create(therapist.id, expiresAt);
    const appUrl = this.env.get("APP_PUBLIC_URL");
    const verifyUrl = `${appUrl}/confirmar-email?token=${token}`;

    await this.emailService.sendEmailVerification(therapist.email, therapist.fullName, verifyUrl);

    return { sent: true };
  }

  async login(input: AuthLoginRequest): Promise<AuthLoginResponse & { accessToken?: string }> {
    const payload = authLoginRequestSchema.parse(input);
    const therapist = await this.therapistRepository.findByEmail(payload.email);

    // Always hash-check to prevent timing oracle on email enumeration
    const hash = therapist?.passwordHash ?? "$2a$12$invalidsafehashplaceholder00000000000000000000000";
    const passwordValid = await this.passwordService.verify(payload.password, hash);

    if (!therapist || !passwordValid) {
      throw new UnauthorizedException("E-mail ou senha incorretos.");
    }

    // --- REQUIRE_MFA=false: cria challenge normalmente, qualquer código é aceito ---
    if (!this.env.values.REQUIRE_MFA) {
      const challengeId = randomUUID();
      this.pendingChallenges.set(challengeId, {
        therapistId: therapist.id,
        email: therapist.email,
        expiresAt: Date.now() + 5 * 60 * 1000
      });
      return {
        challengeId,
        requiresMfa: false,
        mfaMethod: "totp",
        expiresInSeconds: 300,
        hint: "MFA desativado. Digite qualquer código de 6 dígitos para continuar.",
        accessToken: ""
      } as AuthLoginResponse & { accessToken?: string };
    }

    // --- REQUIRE_MFA=true (padrão): fluxo normal com desafio TOTP ---
    const challengeId = randomUUID();
    this.pendingChallenges.set(challengeId, {
      therapistId: therapist.id,
      email: therapist.email,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    return {
      challengeId,
      requiresMfa: true,
      mfaMethod: "totp",
      expiresInSeconds: 300,
      hint: "Use o aplicativo autenticador configurado na sua conta."
    };
  }

  async verifyMfa(input: unknown, context?: { ip?: string; userAgent?: string }): Promise<AuthSession> {
    const payload = authMfaVerifyRequestSchema.parse(input);
    const challenge = this.pendingChallenges.get(payload.challengeId);

    if (!challenge || challenge.expiresAt < Date.now()) {
      throw new UnauthorizedException("Desafio de MFA expirado. Inicie o login novamente.");
    }

    // Quando REQUIRE_MFA=false, qualquer código é aceito (fallback de segurança)
    const valid = this.env.values.REQUIRE_MFA
      ? await this.mfaService.verifyForTherapist(challenge.therapistId, payload.code)
      : true;

    if (!valid) {
      throw new UnauthorizedException("Código de MFA inválido.");
    }

    this.pendingChallenges.delete(payload.challengeId);

    const session = await this.buildSession(challenge.therapistId);
    const accessToken = await this.appSessionService.sign(session);

    this.auditService.log({
      therapistId: session.therapist.id,
      tenantId:    session.tenant.id,
      action:      "login",
      resource:    "auth",
      ipAddress:   context?.ip,
      userAgent:   context?.userAgent
    });

    return { ...session, accessToken };
  }

  async getSessionFromAuthorizationHeader(authorization?: string): Promise<AuthSession> {
    const token = authorization?.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      throw new UnauthorizedException("Credenciais ausentes.");
    }
    return this.appSessionService.verify(token);
  }

  async logout() {
    return { success: true };
  }

  async requestAccountDeletion(session: AuthSession): Promise<{ requested: true; message: string }> {
    await this.therapistRepository.markPendingDeletion(session.therapist.id);

    this.auditService.log({
      therapistId: session.therapist.id,
      tenantId:    session.tenant.id,
      action:      "delete",
      resource:    "auth",
      metadata:    { reason: "account_deletion_requested" }
    });

    return {
      requested: true,
      message:   "Sua solicitação foi registrada. A conta será removida em até 30 dias."
    };
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private readonly internalEmails = ["dev@lumamanager.com.br", "ops@terapia.internal"];

  private isInternalEmail(email: string): boolean {
    return this.internalEmails.includes(email) || email.endsWith("@terapia.internal");
  }

  private async buildSession(therapistId: string): Promise<Omit<AuthSession, "accessToken">> {
    const therapist = await this.therapistRepository.findByIdWithTenant(therapistId);
    if (!therapist) {
      throw new UnauthorizedException("Conta não encontrada.");
    }

    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    const isInternal = this.isInternalEmail(therapist.email);

    return {
      emailVerified: therapist.emailVerifiedAt != null,
      tenant: {
        id: therapist.tenantId,
        name: therapist.practiceName,
        shortName: therapist.practiceName.slice(0, 30),
        status: therapist.status === "pending_onboarding" ? "pending_setup" : "ready_for_operations"
      },
      therapist: {
        id: therapist.id,
        email: therapist.email,
        fullName: therapist.fullName,
        firstName: therapist.fullName.split(" ")[0] ?? therapist.fullName,
        crp: isInternal ? "INTERNAL" : "",
        practiceName: therapist.practiceName,
        roleLabel: therapist.role === "owner" ? "Titular" : "Colaborador",
        timezone: "America/Sao_Paulo"
      },
      accountStatus: therapist.status === "pending_onboarding" ? "pending_setup" : "ready_for_operations",
      capabilities: {
        audioTranscription: false,
        brazilOnlyProcessing: true,
        patientPortalPayments: false,
        stepUpAuthentication: this.env.values.REQUIRE_MFA
      },
      mfaVerified: true,
      expiresAt
    };
  }
}
