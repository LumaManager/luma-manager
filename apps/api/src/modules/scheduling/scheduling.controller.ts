import { Body, Controller, Get, Headers, Inject, Param, Post, Query } from "@nestjs/common";
import type {
  BookSlotRequest,
  BookSlotResponse,
  GenerateWeekTokensRequest,
  GenerateWeekTokensResponse,
  PublicSchedulingResponse
} from "@terapia/contracts";

import { AuthService } from "@/modules/auth/auth.service";
import { SchedulingService } from "./scheduling.service";

@Controller()
export class SchedulingController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(SchedulingService) private readonly schedulingService: SchedulingService
  ) {}

  @Post("scheduling/tokens/generate-week")
  async generateWeekTokens(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: GenerateWeekTokensRequest
  ): Promise<GenerateWeekTokensResponse> {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.schedulingService.generateWeekTokens(session, body.weekStart);
  }

  @Get("scheduling/tokens/week")
  async getWeekTokens(
    @Headers("authorization") authorization: string | undefined,
    @Query("weekStart") weekStart: string
  ): Promise<GenerateWeekTokensResponse> {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.schedulingService.getWeekTokens(session, weekStart);
  }

  @Get("public/scheduling/:token")
  async getPublicSchedulingPage(
    @Param("token") token: string
  ): Promise<PublicSchedulingResponse> {
    return this.schedulingService.getPublicSchedulingPage(token);
  }

  @Post("public/scheduling/:token/book")
  async bookSlot(
    @Param("token") token: string,
    @Body() body: BookSlotRequest
  ): Promise<BookSlotResponse> {
    return this.schedulingService.bookSlot(token, body);
  }
}
