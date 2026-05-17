import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";

import type { ConsentDocumentPublic, ConsentSignResponse } from "@terapia/contracts";
import type { DrizzleClient } from "@/db/client";
import { DATABASE_CLIENT } from "@/common/tokens";
import { patients, therapists } from "@/db/schema";
import { ConsentRepository } from "./consent.repository";

@Injectable()
export class ConsentService {
  constructor(
    @Inject(ConsentRepository) private readonly consentRepo: ConsentRepository,
    @Inject(DATABASE_CLIENT) private readonly db: DrizzleClient
  ) {}

  async getPublicConsentDocument(token: string): Promise<ConsentDocumentPublic> {
    const doc = await this.consentRepo.findByToken(token);
    if (!doc) throw new NotFoundException("Documento de consentimento não encontrado");

    if (doc.status === "signed") {
      return this.toPublic(doc, await this.resolveNames(doc.patientId, doc.therapistId));
    }

    if (doc.status !== "pending" || doc.tokenExpiresAt < new Date()) {
      await this.consentRepo.markExpired(token);
      throw new BadRequestException("Link de consentimento expirado ou inválido");
    }

    return this.toPublic(doc, await this.resolveNames(doc.patientId, doc.therapistId));
  }

  async signConsent(
    token: string,
    signerName: string,
    signerIp: string
  ): Promise<ConsentSignResponse> {
    const doc = await this.consentRepo.findByToken(token);
    if (!doc) throw new NotFoundException("Documento de consentimento não encontrado");

    if (doc.status === "signed") {
      return { success: true, signedAt: doc.signedAt!.toISOString() };
    }

    if (doc.status !== "pending" || doc.tokenExpiresAt < new Date()) {
      throw new BadRequestException("Link de consentimento expirado ou inválido");
    }

    const updated = await this.consentRepo.markSigned(token, signerName, signerIp);
    if (!updated) throw new NotFoundException("Falha ao registrar assinatura");

    return { success: true, signedAt: updated.signedAt!.toISOString() };
  }

  private async resolveNames(
    patientId: string,
    therapistId: string
  ): Promise<{ patientName: string; therapistName: string }> {
    const [patientRows, therapistRows] = await Promise.all([
      this.db.select({ fullName: patients.fullName }).from(patients).where(eq(patients.id, patientId)).limit(1),
      this.db.select({ fullName: therapists.fullName }).from(therapists).where(eq(therapists.id, therapistId)).limit(1)
    ]);

    return {
      patientName: patientRows[0]?.fullName ?? "Paciente",
      therapistName: therapistRows[0]?.fullName ?? "Terapeuta"
    };
  }

  private toPublic(
    doc: Awaited<ReturnType<ConsentRepository["findByToken"]>>,
    names: { patientName: string; therapistName: string }
  ): ConsentDocumentPublic {
    return {
      token: doc!.token,
      documentType: doc!.documentType,
      documentVersion: doc!.documentVersion,
      status: doc!.status as "pending" | "signed" | "expired" | "revoked",
      patientName: names.patientName,
      therapistName: names.therapistName,
      expiresAt: doc!.tokenExpiresAt.toISOString()
    };
  }
}
