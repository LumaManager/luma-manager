import { Body, Controller, Get, Headers, HttpCode, Inject, Post } from "@nestjs/common";
import type { OnboardingCompleteStepRequest } from "@terapia/contracts";

import { AuthService } from "@/modules/auth/auth.service";

import { WorkspaceStateService } from "./workspace-state.service";

@Controller("account")
export class AccountController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(WorkspaceStateService) private readonly workspaceStateService: WorkspaceStateService
  ) {}

  @Get()
  async getAccount(@Headers("authorization") authorization?: string) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.workspaceStateService.getAccountSummary(session);
  }

  @Get("capabilities")
  async getCapabilities(@Headers("authorization") authorization?: string) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.workspaceStateService.getCapabilities(session);
  }

  @Get("onboarding")
  async getOnboarding(@Headers("authorization") authorization?: string) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.workspaceStateService.getOnboardingBootstrap(session);
  }

  @Post("onboarding/start")
  @HttpCode(200)
  async startOnboarding(@Headers("authorization") authorization?: string) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return {
      onboarding: this.workspaceStateService.startOnboarding(session)
    };
  }

  @Post("onboarding/complete-step")
  @HttpCode(200)
  async completeStep(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: OnboardingCompleteStepRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.workspaceStateService.completeOnboardingStep(session, body);
  }
}
