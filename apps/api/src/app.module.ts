import { Module } from "@nestjs/common";

import { EnvService } from "@/common/config/env.service";
import { AccountController } from "@/modules/account/account.controller";
import { AppointmentsController } from "@/modules/appointments/appointments.controller";
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
import { ClinicalRecordsService } from "@/modules/clinical-records/clinical-records.service";
import { DocumentsController } from "@/modules/documents/documents.controller";
import { DocumentsService } from "@/modules/documents/documents.service";
import { ChargesController } from "@/modules/finance/charges.controller";
import { FinanceController } from "@/modules/finance/finance.controller";
import { FinanceService } from "@/modules/finance/finance.service";
import { InternalController } from "@/modules/internal/internal.controller";
import { InternalOpsService } from "@/modules/internal/internal-ops.service";
import { LinkedinLeadsController } from "@/modules/linkedin-leads/linkedin-leads.controller";
import { LinkedinLeadsService } from "@/modules/linkedin-leads/linkedin-leads.service";
import { WaitlistController } from "@/modules/marketing/waitlist.controller";
import { WaitlistService } from "@/modules/marketing/waitlist.service";
import { EmailService } from "@/modules/platform/email/email.service";
import { PatientsController } from "@/modules/patients/patients.controller";
import { PatientsService } from "@/modules/patients/patients.service";
import { SupabaseService } from "@/modules/platform/supabase/supabase.service";
import { PortalController } from "@/modules/portal/portal.controller";
import { PortalService } from "@/modules/portal/portal.service";
import { SettingsController } from "@/modules/settings/settings.controller";

@Module({
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
    InternalController,
    LinkedinLeadsController,
    PatientsController,
    PortalController,
    WaitlistController
  ],
  providers: [
    EnvService,
    WorkspaceStateService,
    SupabaseService,
    AppSessionService,
    AuthService,
    AppointmentsService,
    DashboardService,
    ClinicalReviewService,
    ClinicalRecordsService,
    DocumentsService,
    FinanceService,
    InternalOpsService,
    LinkedinLeadsService,
    PatientsService,
    PortalService,
    WaitlistService,
    EmailService
  ]
})
export class AppModule {}
