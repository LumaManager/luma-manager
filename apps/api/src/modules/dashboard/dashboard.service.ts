import { Injectable } from "@nestjs/common";

import type { AuthSession } from "@terapia/contracts";
import { Inject } from "@nestjs/common";

import { WorkspaceStateService } from "@/modules/account/workspace-state.service";
import { buildDashboard } from "./dashboard.mock";

@Injectable()
export class DashboardService {
  constructor(
    @Inject(WorkspaceStateService)
    private readonly workspaceStateService: WorkspaceStateService
  ) {}

  getShellBootstrap(session: AuthSession) {
    return this.workspaceStateService.getShellBootstrap(session);
  }

  getTherapistDashboard(session: AuthSession) {
    return buildDashboard(this.workspaceStateService.hydrateSession(session));
  }
}
