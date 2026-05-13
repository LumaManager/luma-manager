import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Inject,
  Post,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import type { FastifyRequest } from "fastify";
import type { AuthLoginRequest, AuthMfaVerifyRequest } from "@terapia/contracts";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  login(@Body() body: AuthLoginRequest) {
    return this.authService.login(body);
  }

  @Post("register")
  async register(@Body() body: { email: string; password: string; fullName: string; practiceName: string }) {
    return this.authService.register(body);
  }

  @Post("mfa/verify")
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  verifyMfa(@Body() body: AuthMfaVerifyRequest, @Req() req: FastifyRequest) {
    return this.authService.verifyMfa(body, {
      ip:        req.ip ?? "",
      userAgent: req.headers["user-agent"] ?? ""
    });
  }

  @Get("me")
  me(@Headers("authorization") authorization?: string) {
    return this.authService.getSessionFromAuthorizationHeader(authorization);
  }

  @Post("logout")
  @HttpCode(200)
  logout() {
    return this.authService.logout();
  }

  @Get("verify-email")
  async verifyEmail(@Query("token") token: string) {
    if (!token) throw new BadRequestException("Token ausente.");
    return this.authService.verifyEmail(token);
  }

  @Post("resend-verification")
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerification(body.email ?? "");
  }

  @Delete("account")
  async deleteAccount(@Headers("authorization") authorization: string) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.authService.requestAccountDeletion(session);
  }
}
