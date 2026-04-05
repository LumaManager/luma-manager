import { Controller, Get, Headers, Inject } from "@nestjs/common";

import { AuthService } from "@/modules/auth/auth.service";

import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(DashboardService) private readonly dashboardService: DashboardService
  ) {}

  @Get("therapist")
  async getTherapistDashboard(@Headers("authorization") authorization?: string) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.dashboardService.getTherapistDashboard(session);
  }
}
