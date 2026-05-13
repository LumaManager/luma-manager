import { randomUUID } from "node:crypto";

import { Inject, Injectable, Logger } from "@nestjs/common";

import type { DrizzleClient } from "@/db/client";
import { DATABASE_CLIENT } from "@/common/tokens";
import { auditLogs } from "@/db/schema";

export type AuditAction   = "login" | "logout" | "read" | "create" | "update" | "delete";
export type AuditResource = "patient" | "clinical_record" | "document" | "appointment" | "billing" | "auth" | "settings";

export type AuditEntry = {
  therapistId: string;
  tenantId:    string;
  action:      AuditAction;
  resource:    AuditResource;
  resourceId?: string;
  patientId?:  string;
  ipAddress?:  string;
  userAgent?:  string;
  metadata?:   Record<string, unknown>;
};

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  log(entry: AuditEntry): void {
    this.writeAsync(entry).catch(err => {
      this.logger.error("Failed to write audit log", err);
    });
  }

  private async writeAsync(entry: AuditEntry): Promise<void> {
    await this.db.insert(auditLogs).values({
      id:          randomUUID(),
      therapistId: entry.therapistId,
      tenantId:    entry.tenantId,
      action:      entry.action,
      resource:    entry.resource,
      resourceId:  entry.resourceId ?? null,
      patientId:   entry.patientId  ?? null,
      ipAddress:   entry.ipAddress  ?? "",
      userAgent:   entry.userAgent  ?? "",
      metadata:    entry.metadata ? JSON.stringify(entry.metadata) : null
    });
  }
}
