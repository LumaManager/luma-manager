import { Body, Controller, Get, Headers, Inject, Param, Post, Query } from "@nestjs/common";
import type { PatientCreateRequest } from "@terapia/contracts";

import { AuthService } from "@/modules/auth/auth.service";

import { PatientsService } from "./patients.service";

@Controller("patients")
export class PatientsController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(PatientsService) private readonly patientsService: PatientsService
  ) {}

  @Get()
  async list(
    @Headers("authorization") authorization?: string,
    @Query()
    query?: Record<string, string>
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.patientsService.listPatients(session, query ?? {});
  }

  @Post()
  async create(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: PatientCreateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.patientsService.createPatient(session, body);
  }

  @Get(":patientId")
  async detail(
    @Headers("authorization") authorization: string | undefined,
    @Param("patientId") patientId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.patientsService.getPatientDetail(session, patientId);
  }
}
