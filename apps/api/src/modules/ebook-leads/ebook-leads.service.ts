import { Inject, Injectable, Logger } from "@nestjs/common";
import type {
  EbookLeadRequest,
  EbookLeadResponse,
  InternalEbookLeadsResponse,
  EbookLeadPerfil
} from "@terapia/contracts";
import { ebookLeadRequestSchema } from "@terapia/contracts";

import { SupabaseService } from "@/modules/platform/supabase/supabase.service";

const PERFIL_LABELS: Record<EbookLeadPerfil, string> = {
  clinico: "Psicólogo(a) clínico(a)",
  organizacional: "Psicólogo(a) organizacional",
  escolar: "Psicólogo(a) escolar",
  outro: "Outro"
};

type DbRow = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  perfil: EbookLeadPerfil | null;
  source_path: string;
  referrer_host: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  created_at: string;
};

@Injectable()
export class EbookLeadsService {
  private readonly logger = new Logger(EbookLeadsService.name);

  constructor(@Inject(SupabaseService) private readonly supabase: SupabaseService) {}

  async register(input: EbookLeadRequest): Promise<EbookLeadResponse> {
    const payload = ebookLeadRequestSchema.parse(input);
    const normalizedEmail = payload.email.trim().toLowerCase();

    const downloadToken = "cfp-ia-2024";

    if (!this.supabase.adminClient) {
      this.logger.warn("Supabase unavailable — returning success without persisting");
      return { success: true, alreadyRegistered: false, downloadToken };
    }

    const { data: existing } = await this.supabase.adminClient
      .from("ebook_leads")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      return { success: true, alreadyRegistered: true, downloadToken };
    }

    const { error } = await this.supabase.adminClient.from("ebook_leads").insert({
      full_name: payload.fullName,
      email: normalizedEmail,
      whatsapp: payload.whatsapp,
      perfil: payload.perfil ?? null,
      source_path: payload.sourcePath ?? "",
      referrer_host: payload.referrerHost ?? "",
      utm_source: payload.utmSource ?? "",
      utm_medium: payload.utmMedium ?? "",
      utm_campaign: payload.utmCampaign ?? ""
    });

    if (error) {
      this.logger.error("Failed to insert ebook lead", error);
    }

    return { success: true, alreadyRegistered: false, downloadToken };
  }

  async getInternalView(): Promise<InternalEbookLeadsResponse> {
    if (!this.supabase.adminClient) {
      return { totalEntries: 0, items: [] };
    }

    const { data, error } = await this.supabase.adminClient
      .from("ebook_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      this.logger.error("Failed to fetch ebook leads", error);
      return { totalEntries: 0, items: [] };
    }

    const rows = (data ?? []) as DbRow[];

    return {
      totalEntries: rows.length,
      items: rows.map((row) => ({
        id: row.id,
        fullName: row.full_name || "Não informado",
        email: row.email,
        whatsapp: row.whatsapp || "Não informado",
        perfilLabel: row.perfil ? PERFIL_LABELS[row.perfil] : "Não informado",
        sourcePath: row.source_path || "/",
        utmLabel: this.buildUtmLabel(row),
        referrerLabel: row.referrer_host || "Acesso direto",
        createdAtLabel: this.formatDate(row.created_at)
      }))
    };
  }

  private buildUtmLabel(row: DbRow) {
    const parts = [row.utm_source, row.utm_medium, row.utm_campaign].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : "Sem UTM";
  }

  private formatDate(value: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  }
}
