import { Body, Controller, Get, Headers, Inject, Param, Patch, Post, Query } from "@nestjs/common";
import type { ClinicalReviewDraftUpdateRequest } from "@terapia/contracts";

import { AuthService } from "@/modules/auth/auth.service";

import { ClinicalReviewService } from "./clinical-review.service";

@Controller("clinical-review")
export class ClinicalReviewController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(ClinicalReviewService)
    private readonly clinicalReviewService: ClinicalReviewService
  ) {}

  @Get()
  async list(
    @Headers("authorization") authorization: string | undefined,
    @Query() query?: Record<string, string>
  ) {
    await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalReviewService.list(query ?? {});
  }

  @Get(":appointmentId")
  async detail(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalReviewService.getDetail(appointmentId);
  }

  @Patch(":appointmentId/draft")
  async updateDraft(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string,
    @Body() body: ClinicalReviewDraftUpdateRequest
  ) {
    await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalReviewService.updateDraft(appointmentId, body);
  }

  @Post(":appointmentId/approve")
  async approve(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalReviewService.approve(appointmentId);
  }

  @Post(":appointmentId/discard")
  async discard(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalReviewService.discard(appointmentId);
  }

  @Post(":appointmentId/retry-transcript")
  async retryTranscript(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalReviewService.retryTranscript(appointmentId);
  }

  @Post(":appointmentId/retry-draft")
  async retryDraft(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalReviewService.retryDraft(appointmentId);
  }
}
