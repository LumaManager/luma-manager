// apps/api/src/db/client.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import type { EnvService } from "@/common/config/env.service";

export type DrizzleClient = ReturnType<typeof drizzle>;

export function createDatabaseClient(env: EnvService): DrizzleClient {
  if (!env.values.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is required but not set. " +
      "If running on Railway, ensure the Postgres service is linked to this service " +
      "via a variable reference: DATABASE_URL = ${{Postgres.DATABASE_URL}}"
    );
  }

  const sql = postgres(env.values.DATABASE_URL, {
    max: 10,
    prepare: false
  });

  return drizzle(sql);
}
