import { Body, Controller, Get, HttpCode, Inject, Post } from "@nestjs/common";
import type { WaitlistJoinRequest } from "@terapia/contracts";

import { WaitlistService } from "./waitlist.service";

@Controller("marketing/waitlist")
export class WaitlistController {
  constructor(@Inject(WaitlistService) private readonly waitlistService: WaitlistService) {}

  @Get("summary")
  getSummary() {
    return this.waitlistService.getSummary();
  }

  @Post()
  @HttpCode(200)
  join(@Body() body: WaitlistJoinRequest) {
    return this.waitlistService.join(body);
  }
}
