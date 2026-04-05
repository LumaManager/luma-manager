import { Body, Controller, Get, Headers, Inject, Param, Post } from "@nestjs/common";
import type { PortalInviteAcceptRequest } from "@terapia/contracts";

import { PortalService } from "./portal.service";

@Controller("portal")
export class PortalController {
  constructor(@Inject(PortalService) private readonly portalService: PortalService) {}

  @Get("invite/:token")
  invite(@Param("token") token: string) {
    return this.portalService.getInvite(token);
  }

  @Post("invite/:token/accept")
  acceptInvite(@Param("token") token: string, @Body() body: PortalInviteAcceptRequest) {
    return this.portalService.acceptInvite(token, body);
  }

  @Get("bootstrap")
  bootstrap(@Headers("x-portal-token") portalToken?: string) {
    return this.portalService.getBootstrap(portalToken);
  }

  @Get("appointments")
  appointments(@Headers("x-portal-token") portalToken?: string) {
    return this.portalService.getAppointments(portalToken);
  }

  @Get("appointments/:appointmentId")
  appointmentDetail(
    @Headers("x-portal-token") portalToken: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    return this.portalService.getAppointmentDetail(portalToken, appointmentId);
  }

  @Get("appointments/:appointmentId/call")
  appointmentCall(
    @Headers("x-portal-token") portalToken: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    return this.portalService.getCall(portalToken, appointmentId);
  }

  @Get("documents")
  documents(@Headers("x-portal-token") portalToken?: string) {
    return this.portalService.getDocuments(portalToken);
  }

  @Get("documents/:documentId")
  documentDetail(
    @Headers("x-portal-token") portalToken: string | undefined,
    @Param("documentId") documentId: string
  ) {
    return this.portalService.getDocumentDetail(portalToken, documentId);
  }

  @Post("documents/:documentId/sign")
  signDocument(
    @Headers("x-portal-token") portalToken: string | undefined,
    @Param("documentId") documentId: string
  ) {
    return this.portalService.signDocument(portalToken, documentId);
  }

  @Get("payments")
  payments(@Headers("x-portal-token") portalToken?: string) {
    return this.portalService.getPayments(portalToken);
  }

  @Get("payments/:chargeId")
  paymentDetail(
    @Headers("x-portal-token") portalToken: string | undefined,
    @Param("chargeId") chargeId: string
  ) {
    return this.portalService.getPaymentDetail(portalToken, chargeId);
  }

  @Post("payments/:chargeId/confirm")
  confirmPayment(
    @Headers("x-portal-token") portalToken: string | undefined,
    @Param("chargeId") chargeId: string
  ) {
    return this.portalService.confirmPayment(portalToken, chargeId);
  }

  @Get("profile")
  profile(@Headers("x-portal-token") portalToken?: string) {
    return this.portalService.getProfile(portalToken);
  }
}
