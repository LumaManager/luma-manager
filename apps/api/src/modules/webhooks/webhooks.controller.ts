import { createHmac, timingSafeEqual } from "node:crypto";

import { Controller, Headers, HttpCode, Inject, Logger, Post, Req, UnauthorizedException } from "@nestjs/common";
import type { FastifyRequest } from "fastify";

import { readEnv } from "@/common/config/env";
import { RecordingService } from "@/modules/recording/recording.service";

interface DailyWebhookPayload {
  action: string;
  recording?: {
    id: string;
    room_name: string;
  };
}

interface AssemblyAIWebhookPayload {
  transcript_id: string;
  status: string;
}

@Controller("webhooks")
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    @Inject(RecordingService) private readonly recordingService: RecordingService
  ) {}

  @Post("daily")
  @HttpCode(200)
  async handleDailyWebhook(
    @Req() req: FastifyRequest & { rawBody?: Buffer | string },
    @Headers("x-daily-signature") signature: string | undefined
  ): Promise<{ ok: boolean }> {
    const env = readEnv();
    const rawBody = req.rawBody ?? "";
    const rawBodyStr = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : rawBody;

    if (env.DAILY_WEBHOOK_SECRET && signature) {
      this.validateDailySignature(signature, rawBodyStr, env.DAILY_WEBHOOK_SECRET);
    } else if (env.DAILY_WEBHOOK_SECRET) {
      throw new UnauthorizedException("Missing Daily.co signature");
    }

    const payload = JSON.parse(rawBodyStr) as DailyWebhookPayload;
    this.logger.log(`Daily webhook: ${payload.action}`);

    if (payload.action === "recording-ready" && payload.recording) {
      const { id: recordingId, room_name: roomName } = payload.recording;
      this.recordingService.handleRecordingReady(recordingId, roomName).catch((err) => {
        this.logger.error("handleRecordingReady failed", err);
      });
    }

    return { ok: true };
  }

  @Post("assemblyai")
  @HttpCode(200)
  async handleAssemblyAIWebhook(
    @Req() req: FastifyRequest & { rawBody?: Buffer | string }
  ): Promise<{ ok: boolean }> {
    const rawBody = req.rawBody ?? "";
    const rawBodyStr = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : rawBody;

    const payload = JSON.parse(rawBodyStr) as AssemblyAIWebhookPayload;
    this.logger.log(`AssemblyAI webhook: transcript=${payload.transcript_id} status=${payload.status}`);

    if (payload.status === "completed" && payload.transcript_id) {
      this.recordingService.handleTranscriptReady(payload.transcript_id).catch((err) => {
        this.logger.error("handleTranscriptReady failed", err);
      });
    }

    return { ok: true };
  }

  private validateDailySignature(
    signatureHeader: string,
    rawBody: string,
    secret: string
  ): void {
    const parts = signatureHeader.split(",");
    const tPart = parts.find((p) => p.startsWith("t="));
    const v1Part = parts.find((p) => p.startsWith("v1="));

    if (!tPart || !v1Part) {
      throw new UnauthorizedException("Malformed Daily.co signature header");
    }

    const timestamp = tPart.slice(2);
    const receivedSig = v1Part.slice(3);
    const message = `${timestamp}.${rawBody}`;

    const expected = createHmac("sha256", secret).update(message).digest("hex");
    const expectedBuf = Buffer.from(expected, "hex");
    const receivedBuf = Buffer.from(receivedSig, "hex");

    if (expectedBuf.length !== receivedBuf.length || !timingSafeEqual(expectedBuf, receivedBuf)) {
      throw new UnauthorizedException("Invalid Daily.co signature");
    }
  }
}
