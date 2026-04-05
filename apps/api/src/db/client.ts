import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import type { EnvService } from "@/common/config/env.service";

export function createDatabaseClient(env: EnvService) {
  if (!env.values.DATABASE_URL) {
    return null;
  }

  const sql = postgres(env.values.DATABASE_URL, {
    max: 1,
    prepare: false
  });

  return drizzle(sql);
}
