import { Controller, Get, Inject } from "@nestjs/common";

import { EnvService } from "@/common/config/env.service";
import { SupabaseService } from "@/modules/platform/supabase/supabase.service";

@Controller("health")
export class HealthController {
  constructor(
    @Inject(EnvService) private readonly envService: EnvService,
    @Inject(SupabaseService) private readonly supabaseService: SupabaseService
  ) {}

  @Get()
  getHealth() {
    return {
      status: "ok",
      environment: {
        authProvider: this.envService.values.AUTH_PROVIDER,
        brazilOnlyProcessing: this.envService.values.BRAZIL_ONLY_PROCESSING,
        audioTranscriptionEnabled: this.envService.values.AUDIO_TRANSCRIPTION_ENABLED,
        apifyConfigured: Boolean(this.envService.values.APIFY_TOKEN),
        apifyLinkedinActorId: this.envService.values.APIFY_LINKEDIN_PROFILE_SCRAPER_ACTOR_ID
      },
      supabase: this.supabaseService.getStatusSummary()
    };
  }
}
