import "reflect-metadata";

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyHelmet from "@fastify/helmet";

import { AppModule } from "./app.module";
import { readEnv } from "./common/config/env";

function loadLocalEnv() {
  const candidates = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), "..", ".env"),
    resolve(process.cwd(), "..", "..", ".env")
  ];

  const envPath = candidates.find((candidate) => existsSync(candidate));

  if (!envPath) {
    return;
  }

  const contents = readFileSync(envPath, "utf8");

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key.length > 0 && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function formatBootstrapError(error: unknown) {
  if (error instanceof Error) {
    return error.stack ?? `${error.name}: ${error.message}`;
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

async function bootstrap() {
  loadLocalEnv();
  const env = readEnv();

  if (env.LUMA_ENV === "production") {
    if (!env.REQUIRE_MFA) {
      throw new Error(
        "SECURITY BOOT FAILURE: REQUIRE_MFA must be true in production. " +
        "Set REQUIRE_MFA=true in Railway environment variables."
      );
    }
    if (!env.DATA_ENCRYPTION_KEY) {
      throw new Error(
        "SECURITY BOOT FAILURE: DATA_ENCRYPTION_KEY is required in production. " +
        "Generate with: openssl rand -hex 32"
      );
    }
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true
    })
  );

  app.setGlobalPrefix("v1");
  app.enableCors({
    origin: [env.WEB_ORIGIN],
    credentials: true
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (app as any).register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc:  ["'self'"],
        styleSrc:   ["'self'", "'unsafe-inline'"],
        imgSrc:     ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc:    ["'self'"],
        objectSrc:  ["'none'"],
        frameSrc:   ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    hsts: {
      maxAge:            63072000,
      includeSubDomains: true,
      preload:           true
    },
    frameguard:     { action: "deny" },
    noSniff:        true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  });

  const port = Number(process.env.PORT) || env.API_PORT;
  await app.listen(port, "0.0.0.0");
}

bootstrap().catch((error) => {
  console.error(formatBootstrapError(error));
  process.exit(1);
});
