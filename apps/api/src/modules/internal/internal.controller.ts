import { Controller, Get, Headers, Inject, Param, Query } from "@nestjs/common";

import { AuthService } from "@/modules/auth/auth.service";

import { InternalOpsService } from "./internal-ops.service";

@Controller("internal")
export class InternalController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(InternalOpsService) private readonly internalOpsService: InternalOpsService
  ) {}

  @Get("bootstrap")
  async bootstrap(@Headers("authorization") authorization: string | undefined) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.internalOpsService.getBootstrap(session);
  }

  @Get("summary")
  async summary(@Headers("authorization") authorization: string | undefined) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.internalOpsService.getSummary(session);
  }

  @Get("waitlist")
  async waitlist(@Headers("authorization") authorization: string | undefined) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.internalOpsService.getWaitlist(session);
  }

  @Get("tenants")
  async tenants(
    @Headers("authorization") authorization: string | undefined,
    @Query() query?: Record<string, string>
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.internalOpsService.listTenants(session, query ?? {});
  }

  @Get("tenants/:tenantId")
  async tenantDetail(
    @Headers("authorization") authorization: string | undefined,
    @Param("tenantId") tenantId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.internalOpsService.getTenantDetail(session, tenantId);
  }

  @Get("support")
  async support(@Headers("authorization") authorization: string | undefined) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.internalOpsService.getSupport(session);
  }

  @Get("billing")
  async billing(@Headers("authorization") authorization: string | undefined) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.internalOpsService.getBilling(session);
  }

  @Get("audit")
  async audit(@Headers("authorization") authorization: string | undefined) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.internalOpsService.getAudit(session);
  }

  @Get("incidents")
  async incidents(@Headers("authorization") authorization: string | undefined) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.internalOpsService.getIncidents(session);
  }
}
