import { Body, Controller, Headers, Inject, Param, Post } from "@nestjs/common";
import type { ChargeCreateRequest, ChargePaymentRequest } from "@terapia/contracts";

import { AuthService } from "@/modules/auth/auth.service";

import { FinanceService } from "./finance.service";

@Controller("charges")
export class ChargesController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(FinanceService) private readonly financeService: FinanceService
  ) {}

  @Post()
  async create(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: ChargeCreateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.financeService.createCharge(session, body);
  }

  @Post(":chargeId/payments")
  async registerPayment(
    @Headers("authorization") authorization: string | undefined,
    @Param("chargeId") chargeId: string,
    @Body() body: ChargePaymentRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.financeService.registerPayment(session, chargeId, body);
  }

  @Post(":chargeId/cancel")
  async cancel(
    @Headers("authorization") authorization: string | undefined,
    @Param("chargeId") chargeId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.financeService.cancelCharge(session, chargeId);
  }
}
