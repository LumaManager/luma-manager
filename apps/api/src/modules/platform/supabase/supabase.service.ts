import { Inject, Injectable } from "@nestjs/common";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { EnvService } from "@/common/config/env.service";

@Injectable()
export class SupabaseService {
  readonly adminClient: SupabaseClient | null;

  constructor(@Inject(EnvService) private readonly envService: EnvService) {
    const { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } = this.envService.values;

    this.adminClient =
      SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
        ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          })
        : null;
  }

  isConfigured() {
    return this.adminClient !== null;
  }

  getStatusSummary() {
    const { SUPABASE_PROJECT_REF, SUPABASE_URL } = this.envService.values;

    return {
      configured: this.isConfigured(),
      projectRef: SUPABASE_PROJECT_REF ?? "not-configured",
      regionHint: SUPABASE_URL?.includes("sa-east-1") ? "sao-paulo" : "external-or-unknown"
    };
  }
}
