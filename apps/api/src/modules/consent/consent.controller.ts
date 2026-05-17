import { Body, Controller, Get, Inject, Ip, Param, Post } from "@nestjs/common";
import type { ConsentDocumentPublic, ConsentSignRequest, ConsentSignResponse } from "@terapia/contracts";

import { ConsentService } from "./consent.service";

@Controller()
export class ConsentController {
  constructor(@Inject(ConsentService) private readonly consentService: ConsentService) {}

  @Get("public/consent/:token")
  async getConsentDocument(@Param("token") token: string): Promise<ConsentDocumentPublic> {
    return this.consentService.getPublicConsentDocument(token);
  }

  @Post("public/consent/:token/sign")
  async signConsent(
    @Param("token") token: string,
    @Body() body: ConsentSignRequest,
    @Ip() ip: string
  ): Promise<ConsentSignResponse> {
    return this.consentService.signConsent(token, body.signerName, ip ?? "");
  }
}
