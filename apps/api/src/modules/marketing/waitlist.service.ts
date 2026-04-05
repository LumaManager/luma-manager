import { Inject, Injectable, Logger } from "@nestjs/common";
import type {
  InternalWaitlistResponse,
  WaitlistBiggestPain,
  WaitlistJoinRequest,
  WaitlistMonthlySessionsRange,
  WaitlistProfessionalRole,
  WaitlistJoinResponse,
  WaitlistSummary
} from "@terapia/contracts";
import { waitlistJoinRequestSchema } from "@terapia/contracts";

import { EmailService } from "@/modules/platform/email/email.service";
import { SupabaseService } from "@/modules/platform/supabase/supabase.service";

const PAIN_LABELS: Record<WaitlistBiggestPain, string> = {
  post_session_overload: "Pós-sessão ainda é o maior gargalo",
  scattered_workflow: "Fluxo espalhado entre ferramentas soltas",
  documents_and_consents: "Documentos e consentimentos travam a operação",
  financial_follow_up: "Cobrança e acompanhamento financeiro consomem tempo",
  switching_between_tools: "Troca constante entre agenda, prontuário e cobrança"
};

const ROLE_LABELS: Record<WaitlistProfessionalRole, string> = {
  therapist: "Psicólogo(a) clínico(a)",
  psychiatrist: "Psiquiatra",
  clinic_owner: "Clínica ou consultório",
  operations: "Operação ou secretária",
  other: "Outro perfil"
};

const MONTHLY_SESSION_LABELS: Record<WaitlistMonthlySessionsRange, string> = {
  up_to_20: "Até 20 sessões por mês",
  "21_to_60": "Entre 21 e 60 sessões por mês",
  "61_to_120": "Entre 61 e 120 sessões por mês",
  "121_plus": "Mais de 120 sessões por mês"
};

type DbRow = {
  id: string;
  email: string;
  full_name: string;
  whatsapp: string;
  professional_role: WaitlistProfessionalRole;
  monthly_sessions_range: WaitlistMonthlySessionsRange | null;
  biggest_pain: WaitlistBiggestPain | null;
  source_path: string;
  referrer_host: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  created_at: string;
  updated_at: string;
};

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);

  constructor(
    @Inject(SupabaseService) private readonly supabase: SupabaseService,
    @Inject(EmailService) private readonly email: EmailService
  ) {}

  async getSummary(): Promise<WaitlistSummary> {
    if (!this.supabase.adminClient) {
      return this.emptySummary();
    }

    const { data, error } = await this.supabase.adminClient
      .from("waitlist_entries")
      .select("professional_role, biggest_pain, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      this.logger.error("Failed to fetch waitlist summary", error);
      return this.emptySummary();
    }

    return this.buildSummary(data ?? []);
  }

  async getInternalView(): Promise<InternalWaitlistResponse> {
    if (!this.supabase.adminClient) {
      return this.emptyInternalView();
    }

    const { data, error } = await this.supabase.adminClient
      .from("waitlist_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      this.logger.error("Failed to fetch waitlist internal view", error);
      return this.emptyInternalView();
    }

    return this.buildInternalView(data ?? []);
  }

  async join(input: WaitlistJoinRequest): Promise<WaitlistJoinResponse> {
    const payload = waitlistJoinRequestSchema.parse(input);
    const normalizedEmail = payload.email.trim().toLowerCase();

    if (!this.supabase.adminClient) {
      throw new Error("Serviço de waitlist temporariamente indisponível.");
    }

    // Check if email already exists
    const { data: existing } = await this.supabase.adminClient
      .from("waitlist_entries")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      const { error } = await this.supabase.adminClient
        .from("waitlist_entries")
        .update({
          full_name: payload.fullName ?? "",
          whatsapp: payload.whatsapp ?? "",
          professional_role: payload.professionalRole,
          monthly_sessions_range: payload.monthlySessionsRange ?? null,
          biggest_pain: payload.biggestPain ?? null,
          source_path: payload.sourcePath ?? "",
          referrer_host: payload.referrerHost ?? "",
          utm_source: payload.utmSource ?? "",
          utm_medium: payload.utmMedium ?? "",
          utm_campaign: payload.utmCampaign ?? "",
          utm_content: payload.utmContent ?? "",
          utm_term: payload.utmTerm ?? ""
        })
        .eq("email", normalizedEmail);

      if (error) {
        this.logger.error("Failed to update waitlist entry", error);
        throw new Error("Erro ao atualizar entrada na waitlist.");
      }

      return {
        success: true,
        alreadyJoined: true,
        message: "Seu contexto foi atualizado na waitlist.",
        summary: await this.getSummary()
      };
    }

    const { error } = await this.supabase.adminClient
      .from("waitlist_entries")
      .insert({
        email: normalizedEmail,
        full_name: payload.fullName ?? "",
        whatsapp: payload.whatsapp ?? "",
        professional_role: payload.professionalRole,
        monthly_sessions_range: payload.monthlySessionsRange ?? null,
        biggest_pain: payload.biggestPain ?? null,
        source_path: payload.sourcePath ?? "",
        referrer_host: payload.referrerHost ?? "",
        utm_source: payload.utmSource ?? "",
        utm_medium: payload.utmMedium ?? "",
        utm_campaign: payload.utmCampaign ?? "",
        utm_content: payload.utmContent ?? "",
        utm_term: payload.utmTerm ?? ""
      });

    if (error) {
      this.logger.error("Failed to insert waitlist entry", error);
      throw new Error("Erro ao registrar entrada na waitlist.");
    }

    void this.email.sendWaitlistConfirmation(normalizedEmail, payload.fullName ?? undefined);

    return {
      success: true,
      alreadyJoined: false,
      message:
        "Você entrou na waitlist. Quando abrirmos os primeiros convites, vamos chamar os perfis com maior aderência.",
      summary: await this.getSummary()
    };
  }

  private buildSummary(
    rows: Pick<DbRow, "professional_role" | "biggest_pain" | "updated_at">[]
  ): WaitlistSummary {
    const therapistEntries = rows.filter((r) => r.professional_role === "therapist").length;
    const clinicEntries = rows.filter((r) => r.professional_role === "clinic_owner").length;
    const painTotals = new Map<WaitlistBiggestPain, number>();

    for (const row of rows) {
      if (row.biggest_pain) {
        painTotals.set(row.biggest_pain, (painTotals.get(row.biggest_pain) ?? 0) + 1);
      }
    }

    const topPain = [...painTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const latestUpdate = rows[0]?.updated_at ?? null;

    return {
      totalEntries: rows.length,
      therapistEntries,
      clinicEntries,
      topPainLabel: topPain
        ? PAIN_LABELS[topPain]
        : "Primeiros sinais de demanda ainda em formação",
      updatedAtLabel: latestUpdate
        ? `Atualizado ${new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          }).format(new Date(latestUpdate))}`
        : "Sem inscrições ainda"
    };
  }

  private buildInternalView(rows: DbRow[]): InternalWaitlistResponse {
    const totalEntries = rows.length;
    const enrichedEntries = rows.filter((r) => this.isEnriched(r)).length;
    const campaignEntries = rows.filter(
      (r) => Boolean(r.utm_source || r.utm_medium || r.utm_campaign || r.utm_content || r.utm_term)
    ).length;
    const directEntries = totalEntries - campaignEntries;
    const painTotals = new Map<WaitlistBiggestPain, number>();
    const sourceTotals = new Map<string, number>();

    for (const row of rows) {
      if (row.biggest_pain) {
        painTotals.set(row.biggest_pain, (painTotals.get(row.biggest_pain) ?? 0) + 1);
      }
      const sourceLabel = this.getSourceLabel(row);
      sourceTotals.set(sourceLabel, (sourceTotals.get(sourceLabel) ?? 0) + 1);
    }

    const topPain = [...painTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const topSource = [...sourceTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const latestUpdate = rows[0]?.updated_at ?? null;

    return {
      summary: {
        totalEntries,
        enrichedEntries,
        campaignEntries,
        directEntries,
        topPainLabel: topPain ? PAIN_LABELS[topPain] : "Dor principal ainda sem padrão forte",
        topSourceLabel: topSource ?? "Tráfego direto ou sem origem identificada",
        updatedAtLabel: latestUpdate
          ? `Atualizado ${this.formatDate(latestUpdate)}`
          : "Sem inscrições ainda"
      },
      items: rows.map((row) => ({
        email: row.email,
        fullName: row.full_name || "Não informado",
        roleLabel: ROLE_LABELS[row.professional_role],
        contextStatusLabel: this.isEnriched(row) ? "Contexto enriquecido" : "Captura inicial",
        monthlySessionsLabel: row.monthly_sessions_range
          ? MONTHLY_SESSION_LABELS[row.monthly_sessions_range]
          : "Ainda não informou volume",
        biggestPainLabel: row.biggest_pain
          ? PAIN_LABELS[row.biggest_pain]
          : "Ainda não informou gargalo principal",
        sourceLabel: this.getSourceLabel(row),
        sourcePath: row.source_path || "/",
        utmLabel: this.getUtmLabel(row),
        referrerLabel: row.referrer_host || "Acesso direto / sem referrer",
        contactLabel: row.whatsapp || "Sem WhatsApp informado",
        createdAtLabel: this.formatDate(row.created_at),
        updatedAtLabel: this.formatDate(row.updated_at)
      }))
    };
  }

  private isEnriched(row: DbRow) {
    return Boolean(
      row.full_name || row.whatsapp || row.monthly_sessions_range || row.biggest_pain
    );
  }

  private getSourceLabel(row: DbRow) {
    if (row.utm_source && row.utm_campaign) return `${row.utm_source} / ${row.utm_campaign}`;
    if (row.utm_source) return row.utm_source;
    if (row.referrer_host) return row.referrer_host;
    return "Direto / sem origem identificada";
  }

  private getUtmLabel(row: DbRow) {
    const parts = [row.utm_source, row.utm_medium, row.utm_campaign, row.utm_content, row.utm_term].filter(Boolean);
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

  private emptySummary(): WaitlistSummary {
    return {
      totalEntries: 0,
      therapistEntries: 0,
      clinicEntries: 0,
      topPainLabel: "Primeiros sinais de demanda ainda em formação",
      updatedAtLabel: "Sem inscrições ainda"
    };
  }

  private emptyInternalView(): InternalWaitlistResponse {
    return {
      summary: {
        totalEntries: 0,
        enrichedEntries: 0,
        campaignEntries: 0,
        directEntries: 0,
        topPainLabel: "Dor principal ainda sem padrão forte",
        topSourceLabel: "Tráfego direto ou sem origem identificada",
        updatedAtLabel: "Sem inscrições ainda"
      },
      items: []
    };
  }
}
