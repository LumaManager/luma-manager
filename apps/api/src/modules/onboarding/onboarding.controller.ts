// apps/api/src/modules/onboarding/onboarding.controller.ts
import { Body, Controller, Get, Headers, HttpCode, Inject, Post } from "@nestjs/common";

import { AuthService } from "@/modules/auth/auth.service";

import { OnboardingService } from "./onboarding.service";

@Controller("v1/onboarding")
export class OnboardingController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(OnboardingService) private readonly onboardingService: OnboardingService
  ) {}

  @Get("status")
  async getStatus(@Headers("authorization") authorization?: string) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.onboardingService.getStatus(session.therapist.id);
  }

  @Post("practice-info")
  @HttpCode(200)
  async savePracticeInfo(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: { practiceName: string; city: string; state: string }
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.onboardingService.savePracticeInfo(session.therapist.id, body);
  }
}
