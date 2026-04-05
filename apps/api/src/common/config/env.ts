import { z } from "zod";

const envSchema = z.object({
  API_PORT: z.coerce.number().default(4000),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  APP_SESSION_SECRET: z.string().min(12),
  AUTH_PROVIDER: z.enum(["mock", "supabase"]).default("mock"),
  MOCK_THERAPIST_EMAIL: z.string().email().default("ana@institutovivace.com.br"),
  MOCK_THERAPIST_PASSWORD: z.string().min(8).default("12345678"),
  MOCK_MFA_CODE: z.string().min(6).max(8).default("123456"),
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
  RESEND_API_KEY: z.string().optional()
});

export type Environment = z.infer<typeof envSchema>;

export function readEnv(): Environment {
  return envSchema.parse(process.env);
}
