import { Body, Controller, Get, Headers, Inject, Param, Post, Query } from "@nestjs/common";
import type { DocumentCreateRequest } from "@terapia/contracts";

import { AuthService } from "@/modules/auth/auth.service";

import { DocumentsService } from "./documents.service";

@Controller("documents")
export class DocumentsController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(DocumentsService) private readonly documentsService: DocumentsService
  ) {}

  @Get()
  async list(
    @Headers("authorization") authorization: string | undefined,
    @Query() query?: Record<string, string>
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.documentsService.listDocuments(session, query ?? {});
  }

  @Post()
  async create(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: DocumentCreateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.documentsService.createDocument(session, body);
  }

  @Get(":documentId")
  async detail(
    @Headers("authorization") authorization: string | undefined,
    @Param("documentId") documentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.documentsService.getDocumentDetail(session, documentId);
  }

  @Post(":documentId/resend")
  async resend(
    @Headers("authorization") authorization: string | undefined,
    @Param("documentId") documentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.documentsService.resendDocument(session, documentId);
  }

  @Post(":documentId/revoke")
  async revoke(
    @Headers("authorization") authorization: string | undefined,
    @Param("documentId") documentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.documentsService.revokeDocument(session, documentId);
  }

  @Post(":documentId/sign")
  async sign(
    @Headers("authorization") authorization: string | undefined,
    @Param("documentId") documentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.documentsService.signDocument(session, documentId);
  }
}
