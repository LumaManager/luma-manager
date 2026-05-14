import { Global, Module } from "@nestjs/common";

import { ConfigModule } from "@/common/config/config.module";
import { EnvService } from "@/common/config/env.service";
import { DATABASE_CLIENT } from "@/common/tokens";
import { createDatabaseClient } from "./client";

@Global()
@Module({
  imports:   [ConfigModule],
  providers: [
    {
      provide:    DATABASE_CLIENT,
      inject:     [EnvService],
      useFactory: (env: EnvService) => createDatabaseClient(env)
    }
  ],
  exports: [DATABASE_CLIENT]
})
export class DatabaseModule {}
