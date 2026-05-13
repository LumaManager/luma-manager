import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";

import { EnvService } from "@/common/config/env.service";
import { EncryptionService } from "@/common/services/encryption.service";
import { AuditModule } from "@/modules/audit/audit.module";
import { DATABASE_CLIENT } from "@/common/tokens";
import { createDatabaseClient } from "@/db/client";
import type { DrizzleClient } from "@/db/client";
import { MfaRepository } from "@/modules/auth/mfa.repository";
import { MfaService } from "@/modules/auth/mfa.service";
import { PasswordService } from "@/modules/auth/password.service";
import { EmailVerificationRepository } from "@/modules/auth/email-verification.repository";
import { TherapistRepository } from "@/modules/auth/therapist.repository";
import { AccountController } from "@/modules/account/account.controller";
import { AppointmentsController } from "@/modules/appointments/appointments.controller";
import { AppointmentsRepository } from "@/modules/appointments/appointments.repository";
import { AppointmentsService } from "@/modules/appointments/appointments.service";
import { WorkspaceStateService } from "@/modules/account/workspace-state.service";
import { AppShellController } from "@/modules/app-shell/app-shell.controller";
import { AppSessionService } from "@/modules/auth/app-session.service";
import { AuthController } from "@/modules/auth/auth.controller";
import { AuthService } from "@/modules/auth/auth.service";
import { DashboardController } from "@/modules/dashboard/dashboard.controller";
import { DashboardService } from "@/modules/dashboard/dashboard.service";
import { HealthController } from "@/modules/health/health.controller";
import { ClinicalReviewController } from "@/modules/clinical-review/clinical-review.controller";
import { ClinicalReviewService } from "@/modules/clinical-review/clinical-review.service";
import { ClinicalRecordsController } from "@/modules/clinical-records/clinical-records.controller";
import { ClinicalRecordsRepository } from "@/modules/clinical-records/clinical-records.repository";
import { ClinicalRecordsService } from "@/modules/clinical-records/clinical-records.service";
import { DocumentsController } from "@/modules/documents/documents.controller";
import { DocumentsRepository } from "@/modules/documents/documents.repository";
import { DocumentsService } from "@/modules/documents/documents.service";
import { ChargesController } from "@/modules/finance/charges.controller";
import { FinanceController } from "@/modules/finance/finance.controller";
import { FinanceRepository } from "@/modules/finance/finance.repository";
import { FinanceService } from "@/modules/finance/finance.service";
import { EbookLeadsController } from "@/modules/ebook-leads/ebook-leads.controller";
import { EbookLeadsService } from "@/modules/ebook-leads/ebook-leads.service";
import { InternalController } from "@/modules/internal/internal.controller";
import { InternalOpsService } from "@/modules/internal/internal-ops.service";
import { LinkedinLeadsController } from "@/modules/linkedin-leads/linkedin-leads.controller";
import { LinkedinLeadsService } from "@/modules/linkedin-leads/linkedin-leads.service";
import { WaitlistController } from "@/modules/marketing/waitlist.controller";
import { WaitlistService } from "@/modules/marketing/waitlist.service";
import { EmailService } from "@/modules/platform/email/email.service";
import { PatientsController } from "@/modules/patients/patients.controller";
import { PatientsRepository } from "@/modules/patients/patients.repository";
import { PatientsService } from "@/modules/patients/patients.service";
import { SupabaseService } from "@/modules/platform/supabase/supabase.service";
import { PortalController } from "@/modules/portal/portal.controller";
import { PortalService } from "@/modules/portal/portal.service";
import { SettingsController } from "@/modules/settings/settings.controller";
import { OnboardingController } from "@/modules/onboarding/onboarding.controller";
import { OnboardingRepository } from "@/modules/onboarding/onboarding.repository";
import { OnboardingService } from "@/modules/onboarding/onboarding.service";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name:  "short",
        ttl:   60_000,
        limit: 10
      }
    ]),
    AuditModule
  ],
  controllers: [
    HealthController,
    AuthController,
    AccountController,
    AppointmentsController,
    AppShellController,
    DashboardController,
    ClinicalReviewController,
    ClinicalRecordsController,
    DocumentsController,
    FinanceController,
    ChargesController,
    SettingsController,
    EbookLeadsController,
    InternalController,
    LinkedinLeadsController,
    PatientsController,
    PortalController,
    WaitlistController,
    OnboardingController
  ],
  providers: [
    EnvService,
    EncryptionService,
    WorkspaceStateService,
    SupabaseService,
    AppSessionService,
    AuthService,
    {
      provide: DATABASE_CLIENT,
      inject: [EnvService],
      useFactory: (env: EnvService) => createDatabaseClient(env)
    },
    {
      provide: "MFA_ENCRYPTION_KEY_BUFFER",
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        // Quando REQUIRE_MFA=false a chave é opcional.
        // Fornecemos um buffer dummy para o MfaRepository inicializar sem erro
        // (seus métodos nunca serão chamados quando MFA está desativado).
        const key = env.values.MFA_ENCRYPTION_KEY ?? "0".repeat(64);
        return Buffer.from(key, "hex");
      }
    },
    TherapistRepository,
    EmailVerificationRepository,
    PasswordService,
    {
      provide: MfaRepository,
      inject: [DATABASE_CLIENT, "MFA_ENCRYPTION_KEY_BUFFER"],
      useFactory: (db: DrizzleClient, key: Buffer) => new MfaRepository(db, key)
    },
    MfaService,
    AppointmentsRepository,
    AppointmentsService,
    DashboardService,
    ClinicalReviewService,
    ClinicalRecordsRepository,
    ClinicalRecordsService,
    DocumentsRepository,
    DocumentsService,
    FinanceRepository,
    FinanceService,
    EbookLeadsService,
    InternalOpsService,
    LinkedinLeadsService,
    PatientsRepository,
    PatientsService,
    PortalService,
    WaitlistService,
    EmailService,
    OnboardingRepository,
    OnboardingService
  ]
})
export class AppModule {}
