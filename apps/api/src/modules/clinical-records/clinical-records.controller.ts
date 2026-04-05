import { Controller, Get, Headers, Inject, Param } from "@nestjs/common";

import { AuthService } from "@/modules/auth/auth.service";

import { ClinicalRecordsService } from "./clinical-records.service";

@Controller("clinical-records/patients")
export class ClinicalRecordsController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(ClinicalRecordsService)
    private readonly clinicalRecordsService: ClinicalRecordsService
  ) {}

  @Get(":patientId")
  async patientRecord(
    @Headers("authorization") authorization: string | undefined,
    @Param("patientId") patientId: string
  ) {
    await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalRecordsService.getPatientClinicalRecord(patientId);
  }

  @Get(":patientId/:recordId")
  async entry(
    @Headers("authorization") authorization: string | undefined,
    @Param("patientId") patientId: string,
    @Param("recordId") recordId: string
  ) {
    await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalRecordsService.getClinicalRecordEntry(patientId, recordId);
  }

  @Get(":patientId/:recordId/versions")
  async versions(
    @Headers("authorization") authorization: string | undefined,
    @Param("patientId") patientId: string,
    @Param("recordId") recordId: string
  ) {
    await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalRecordsService.getClinicalRecordVersions(patientId, recordId);
  }
}
