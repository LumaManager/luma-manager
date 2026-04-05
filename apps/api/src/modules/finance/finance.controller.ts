import { Controller, Get, Headers, Inject, Param, Query } from "@nestjs/common";

import { AuthService } from "@/modules/auth/auth.service";

import { FinanceService } from "./finance.service";

@Controller("finance")
export class FinanceController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(FinanceService) private readonly financeService: FinanceService
  ) {}

  @Get("charges")
  async listCharges(
    @Headers("authorization") authorization: string | undefined,
    @Query() query?: Record<string, string>
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.financeService.listCharges(session, query ?? {});
  }

  @Get("charges/:chargeId")
  async detail(
    @Headers("authorization") authorization: string | undefined,
    @Param("chargeId") chargeId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.financeService.getChargeDetail(session, chargeId);
  }

  @Get("summary")
  async summary(
    @Headers("authorization") authorization: string | undefined,
    @Query() query?: Record<string, string>
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.financeService.getSummary(session, query ?? {});
  }

  @Get("export")
  async export(
    @Headers("authorization") authorization: string | undefined,
    @Query() query?: Record<string, string>
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.financeService.exportCharges(session, query ?? {});
  }
}
