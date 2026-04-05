import { Body, Controller, Get, Headers, HttpCode, Inject, Post } from "@nestjs/common";

import { AuthService } from "@/modules/auth/auth.service";

import { LinkedinLeadsService } from "./linkedin-leads.service";

@Controller("internal/linkedin-leads")
export class LinkedinLeadsController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(LinkedinLeadsService) private readonly linkedinLeadsService: LinkedinLeadsService
  ) {}

  @Get("status")
  async getStatus(@Headers("authorization") authorization: string | undefined) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.linkedinLeadsService.getStatus(session);
  }

  @Post("scrape")
  @HttpCode(200)
  async scrape(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: unknown
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.linkedinLeadsService.scrapeProfiles(session, body);
  }
}
