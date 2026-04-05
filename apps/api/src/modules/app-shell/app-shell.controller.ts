import { Controller, Get, Headers, Inject } from "@nestjs/common";

import { AuthService } from "@/modules/auth/auth.service";
import { DashboardService } from "@/modules/dashboard/dashboard.service";

@Controller("app-shell")
export class AppShellController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(DashboardService) private readonly dashboardService: DashboardService
  ) {}

  @Get("bootstrap")
  async getBootstrap(@Headers("authorization") authorization?: string) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.dashboardService.getShellBootstrap(session);
  }
}
