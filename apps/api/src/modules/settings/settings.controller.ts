import { Body, Controller, Get, Headers, HttpCode, Inject, Post } from "@nestjs/common";
import type {
  SettingsNotificationsUpdateRequest,
  SettingsPoliciesUpdateRequest,
  SettingsPracticeUpdateRequest,
  SettingsProfileUpdateRequest,
  SettingsSecurityUpdateRequest
} from "@terapia/contracts";

import { AuthService } from "@/modules/auth/auth.service";
import { WorkspaceStateService } from "@/modules/account/workspace-state.service";

@Controller("settings")
export class SettingsController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(WorkspaceStateService) private readonly workspaceStateService: WorkspaceStateService
  ) {}

  @Get()
  async bootstrap(@Headers("authorization") authorization: string | undefined) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.workspaceStateService.getSettingsBootstrap(session);
  }

  @Post("profile")
  @HttpCode(200)
  async updateProfile(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: SettingsProfileUpdateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.workspaceStateService.updateSettingsProfile(session, body);
  }

  @Post("practice")
  @HttpCode(200)
  async updatePractice(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: SettingsPracticeUpdateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.workspaceStateService.updateSettingsPractice(session, body);
  }

  @Post("security")
  @HttpCode(200)
  async updateSecurity(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: SettingsSecurityUpdateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.workspaceStateService.updateSettingsSecurity(session, body);
  }

  @Post("policies")
  @HttpCode(200)
  async updatePolicies(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: SettingsPoliciesUpdateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.workspaceStateService.updateSettingsPolicies(session, body);
  }

  @Post("notifications")
  @HttpCode(200)
  async updateNotifications(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: SettingsNotificationsUpdateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.workspaceStateService.updateSettingsNotifications(session, body);
  }
}
