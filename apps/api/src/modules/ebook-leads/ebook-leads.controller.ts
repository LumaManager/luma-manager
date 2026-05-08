import { Body, Controller, HttpCode, Inject, Post } from "@nestjs/common";
import type { EbookLeadRequest } from "@terapia/contracts";

import { EbookLeadsService } from "./ebook-leads.service";

@Controller("ebook-leads")
export class EbookLeadsController {
  constructor(@Inject(EbookLeadsService) private readonly ebookLeadsService: EbookLeadsService) {}

  @Post()
  @HttpCode(200)
  register(@Body() body: EbookLeadRequest) {
    return this.ebookLeadsService.register(body);
  }
}
