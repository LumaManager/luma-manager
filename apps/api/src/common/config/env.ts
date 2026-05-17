import { z } from "zod";

const envSchema = z.object({
  API_PORT: z.coerce.number().default(4000),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  APP_SESSION_SECRET: z.string().min(12),
  MFA_ENCRYPTION_KEY: z.string().regex(/^[0-9a-fA-F]{64}$/, "MFA_ENCRYPTION_KEY must be 64 hex characters").transform(v => v.toLowerCase()).optional(),
  DATA_ENCRYPTION_KEY: z.string().regex(/^[0-9a-fA-F]{64}$/, "DATA_ENCRYPTION_KEY must be 64 hex chars (32 bytes)").transform(v => v.toLowerCase()).optional(),
  AUTH_PROVIDER: z.enum(["real", "mock"]).default("real"),
  // Quando false: login completa direto após email+senha, sem TOTP.
  // Use false em dev/staging para testar sem autenticador.
  // NUNCA false em produção com dados reais.
  REQUIRE_MFA: z
    .union([z.literal("true"), z.literal("false")])
    .default("true")
    .transform((value) => value === "true"),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_PROJECT_REF: z.string().optional(),
  APIFY_TOKEN: z.string().optional(),
  APIFY_LINKEDIN_PROFILE_SCRAPER_ACTOR_ID: z
    .string()
    .default("dev_fusion/linkedin-profile-scraper"),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  DRIZZLE_LOG_SQL: z
    .union([z.literal("true"), z.literal("false")])
    .default("false")
    .transform((value) => value === "true"),
  BRAZIL_ONLY_PROCESSING: z
    .union([z.literal("true"), z.literal("false")])
    .default("true")
    .transform((value) => value === "true"),
  AUDIO_TRANSCRIPTION_ENABLED: z
    .union([z.literal("true"), z.literal("false")])
    .default("false")
    .transform((value) => value === "true"),
  RESEND_API_KEY: z.string().optional(),
  APP_PUBLIC_URL: z.string().url().default("https://lumamanager.com.br"),
  LUMA_ENV: z.string().default("production"), // deploy trigger
  DAILY_API_KEY: z.string().optional(),
  DAILY_WEBHOOK_SECRET: z.string().optional(),
  ASSEMBLY_AI_API_KEY: z.string().optional(),
  RECORDING_CONSENT_DOCUMENT_VERSION: z.string().default("1.0")
});

export type Environment = z.infer<typeof envSchema>;

export function readEnv(): Environment {
  return envSchema.parse(process.env);
}
