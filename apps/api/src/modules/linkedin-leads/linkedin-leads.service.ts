import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException
} from "@nestjs/common";
import type { AuthSession } from "@terapia/contracts";
import { z } from "zod";

import { EnvService } from "@/common/config/env.service";
import { InternalOpsService } from "@/modules/internal/internal-ops.service";

const linkedinLeadScrapeRequestSchema = z.object({
  profileUrls: z.array(z.string().url()).min(1).max(100)
});

type LinkedinLeadScrapeRequest = z.infer<typeof linkedinLeadScrapeRequestSchema>;

function normalizeLinkedinProfileUrl(rawUrl: string) {
  const url = new URL(rawUrl.trim());
  const normalizedPath = url.pathname.replace(/\/+$/, "");
  const hostname = url.hostname.toLowerCase();
  const isLinkedinHost = hostname === "linkedin.com" || hostname.endsWith(".linkedin.com");
  const isProfilePath =
    normalizedPath.startsWith("/in/") || normalizedPath.startsWith("/pub/");

  if (!isLinkedinHost || !isProfilePath) {
    throw new BadRequestException(
      "Cada item precisa ser uma URL publica de perfil do LinkedIn, como https://www.linkedin.com/in/nome."
    );
  }

  url.protocol = "https:";
  url.hostname = "www.linkedin.com";
  url.pathname = normalizedPath;
  url.search = "";
  url.hash = "";

  return url.toString();
}

@Injectable()
export class LinkedinLeadsService {
  constructor(
    @Inject(EnvService) private readonly envService: EnvService,
    @Inject(InternalOpsService) private readonly internalOpsService: InternalOpsService
  ) {}

  getStatus(session: AuthSession) {
    const operator = this.internalOpsService.assertInternalSession(session);

    return {
      configured: Boolean(this.envService.values.APIFY_TOKEN),
      actorId: this.envService.values.APIFY_LINKEDIN_PROFILE_SCRAPER_ACTOR_ID,
      requestedBy: {
        email: operator.email,
        fullName: operator.fullName
      },
      limits: {
        maxProfileUrlsPerRun: 100
      }
    };
  }

  async scrapeProfiles(session: AuthSession, input: unknown) {
    const operator = this.internalOpsService.assertInternalSession(session);
    const payload = linkedinLeadScrapeRequestSchema.parse(input);
    const profileUrls = this.normalizeProfileUrls(payload);
    const actorId = this.envService.values.APIFY_LINKEDIN_PROFILE_SCRAPER_ACTOR_ID;
    const token = this.getRequiredToken();
    const endpoint = this.buildRunSyncEndpoint(actorId, token);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          profileUrls
        })
      });

      const rawPayload = (await response.json()) as unknown;

      if (!response.ok) {
        throw new BadGatewayException(this.extractApifyErrorMessage(rawPayload));
      }

      const items = Array.isArray(rawPayload) ? rawPayload : [];

      return {
        success: true,
        actorId,
        requestedBy: {
          email: operator.email,
          fullName: operator.fullName
        },
        input: {
          profileUrls
        },
        results: {
          totalItems: items.length,
          items
        }
      };
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw new BadGatewayException(this.formatApifyError(error));
    }
  }

  private getRequiredToken() {
    const token = this.envService.values.APIFY_TOKEN;

    if (!token) {
      throw new ServiceUnavailableException(
        "APIFY_TOKEN nao configurado. Defina o token do Apify antes de usar o scraping."
      );
    }

    return token;
  }

  private normalizeProfileUrls(input: LinkedinLeadScrapeRequest) {
    const uniqueUrls = new Set<string>();

    for (const rawUrl of input.profileUrls) {
      uniqueUrls.add(normalizeLinkedinProfileUrl(rawUrl));
    }

    if (uniqueUrls.size === 0) {
      throw new BadRequestException("Informe pelo menos uma URL publica de perfil do LinkedIn.");
    }

    return [...uniqueUrls];
  }

  private buildRunSyncEndpoint(actorId: string, token: string) {
    const normalizedActorId = actorId.replace("/", "~");
    const params = new URLSearchParams({
      token,
      clean: "true"
    });

    return `https://api.apify.com/v2/acts/${normalizedActorId}/run-sync-get-dataset-items?${params.toString()}`;
  }

  private extractApifyErrorMessage(payload: unknown) {
    if (
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      payload.error &&
      typeof payload.error === "object" &&
      "message" in payload.error &&
      typeof payload.error.message === "string"
    ) {
      return `Falha ao executar o actor do Apify: ${payload.error.message}`;
    }

    return "Falha ao executar o actor do Apify.";
  }

  private formatApifyError(error: unknown) {
    if (error instanceof Error) {
      return `Falha ao executar o actor do Apify: ${error.message}`;
    }

    return "Falha ao executar o actor do Apify.";
  }
}
