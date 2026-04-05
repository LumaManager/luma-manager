import { Body, Controller, Get, Headers, Inject, Param, Post, Query } from "@nestjs/common";
import type {
  AgendaAvailabilityUpdateRequest,
  AppointmentCancelRequest,
  AppointmentCreateRequest,
  AppointmentRescheduleRequest,
  ScheduleBlockCreateRequest,
  ScheduleBlockUpdateRequest
} from "@terapia/contracts";

import { AuthService } from "@/modules/auth/auth.service";

import { AppointmentsService } from "./appointments.service";

@Controller("appointments")
export class AppointmentsController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(AppointmentsService) private readonly appointmentsService: AppointmentsService
  ) {}

  @Get()
  async list(
    @Headers("authorization") authorization?: string,
    @Query() query?: Record<string, string>
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.listAgenda(session, query ?? {});
  }

  @Post()
  async create(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: AppointmentCreateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.createAppointment(session, body);
  }

  @Post("availability")
  async updateAvailability(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: AgendaAvailabilityUpdateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.updateAvailability(session, body);
  }

  @Post("blocks")
  async createBlock(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: ScheduleBlockCreateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.createBlock(session, body);
  }

  @Post("blocks/:blockId")
  async updateBlock(
    @Headers("authorization") authorization: string | undefined,
    @Param("blockId") blockId: string,
    @Body() body: ScheduleBlockUpdateRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.updateBlock(session, blockId, body);
  }

  @Post("blocks/:blockId/delete")
  async deleteBlock(
    @Headers("authorization") authorization: string | undefined,
    @Param("blockId") blockId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.deleteBlock(session, blockId);
  }

  @Post(":appointmentId/reschedule")
  async reschedule(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string,
    @Body() body: AppointmentRescheduleRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.rescheduleAppointment(session, appointmentId, body);
  }

  @Post(":appointmentId/cancel")
  async cancel(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string,
    @Body() body: AppointmentCancelRequest
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.cancelAppointment(session, appointmentId, body);
  }

  @Get(":appointmentId/call")
  async call(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.getAppointmentCall(session, appointmentId);
  }

  @Post(":appointmentId/room")
  async provisionRoom(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.provisionRoom(session, appointmentId);
  }

  @Post(":appointmentId/check-in")
  async checkIn(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.checkIn(session, appointmentId);
  }

  @Post(":appointmentId/end-session")
  async endSession(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.endSession(session, appointmentId);
  }

  @Get(":appointmentId")
  async detail(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.appointmentsService.getAppointmentDetail(session, appointmentId);
  }
}
