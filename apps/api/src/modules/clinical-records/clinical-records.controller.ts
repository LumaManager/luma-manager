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
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalRecordsService.getPatientClinicalRecord(session.therapist.id, patientId);
  }

  @Get(":patientId/:recordId")
  async entry(
    @Headers("authorization") authorization: string | undefined,
    @Param("patientId") patientId: string,
    @Param("recordId") recordId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalRecordsService.getClinicalRecordEntry(
      session.therapist.id,
      patientId,
      recordId
    );
  }

  @Get(":patientId/:recordId/versions")
  async versions(
    @Headers("authorization") authorization: string | undefined,
    @Param("patientId") patientId: string,
    @Param("recordId") recordId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.clinicalRecordsService.getClinicalRecordVersions(
      session.therapist.id,
      patientId,
      recordId
    );
  }
}
