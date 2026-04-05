import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Inject,
  Post
} from "@nestjs/common";
import type { AuthLoginRequest, AuthMfaVerifyRequest } from "@terapia/contracts";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  login(@Body() body: AuthLoginRequest) {
    return this.authService.login(body);
  }

  @Post("mfa/verify")
  @HttpCode(200)
  verifyMfa(@Body() body: AuthMfaVerifyRequest) {
    return this.authService.verifyMfa(body);
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
}
