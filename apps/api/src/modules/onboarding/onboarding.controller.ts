// apps/api/src/modules/onboarding/onboarding.controller.ts
import { Body, Controller, Get, Headers, HttpCode, Ip, Post } from "@nestjs/common";

import type { OnboardingCompleteStepRequest } from "@terapia/contracts";
import { onboardingCompleteStepRequestSchema } from "@terapia/contracts";

import { AuthService } from "@/modules/auth/auth.service";

import { OnboardingService } from "./onboarding.service";

@Controller("v1/account/onboarding")
export class OnboardingController {
  constructor(
    private readonly authService: AuthService,
    private readonly onboardingService: OnboardingService
  ) {}

  @Get()
  async getBootstrap(@Headers("authorization") authorization?: string) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.onboardingService.getBootstrap(session.therapist.id);
  }

  @Post("start")
  @HttpCode(200)
  async start(@Headers("authorization") authorization?: string) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    const onboarding = await this.onboardingService.getBootstrap(session.therapist.id);
    return { onboarding };
  }

  @Post("complete-step")
  @HttpCode(200)
  async completeStep(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: OnboardingCompleteStepRequest,
    @Ip() ip: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    const validated = onboardingCompleteStepRequestSchema.parse(body);
    return this.onboardingService.completeStep(session.therapist.id, validated, ip);
  }
}
