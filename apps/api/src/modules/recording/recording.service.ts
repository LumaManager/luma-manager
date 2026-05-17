import { Injectable, Logger } from "@nestjs/common";

import { readEnv } from "@/common/config/env";
import { AppointmentsRepository } from "@/modules/appointments/appointments.repository";
import { DailyClient } from "@/modules/appointments/daily.client";
import { SupabaseService } from "@/modules/platform/supabase/supabase.service";

interface AssemblyAITranscriptResponse {
  id: string;
  status: string;
  utterances?: Array<{
    speaker: string;
    text: string;
    start: number;
  }>;
  text?: string;
}

@Injectable()
export class RecordingService {
  private readonly logger = new Logger(RecordingService.name);

  constructor(
    private readonly appointmentsRepo: AppointmentsRepository,
    private readonly dailyClient: DailyClient,
    private readonly supabaseService: SupabaseService
  ) {}

  async handleRecordingReady(recordingId: string, roomName: string): Promise<void> {
    const appointmentId = roomName.replace("luma-", "");
    const appointment = await this.appointmentsRepo.findByRoomProviderRef(roomName);
    const apptId = appointment?.id ?? appointmentId;

    try {
      const downloadUrl = await this.dailyClient.getRecordingAccessLink(recordingId);
      const audioBuffer = await this.downloadFile(downloadUrl);

      const env = readEnv();
      if (!this.supabaseService.isConfigured() || !env.ASSEMBLY_AI_API_KEY) {
        this.logger.warn("Supabase or AssemblyAI not configured — skipping transcript processing");
        return;
      }

      const storagePath = `recordings/${apptId}/${recordingId}.mp4`;
      await this.uploadToSupabase(storagePath, audioBuffer);

      const signedUrl = await this.getSignedUrl(storagePath, 1800);

      const transcriptId = await this.submitToAssemblyAI(signedUrl, env.ASSEMBLY_AI_API_KEY);

      await this.appointmentsRepo.setRecordingDailyId(apptId, recordingId);
      await this.appointmentsRepo.setTranscriptDraft(apptId, transcriptId, "");

      await this.deleteFromSupabase(storagePath);

      this.logger.log(`Recording ${recordingId} submitted to AssemblyAI as ${transcriptId}`);
    } catch (err) {
      this.logger.error(`Failed to process recording ${recordingId}`, err);
    }
  }

  async handleTranscriptReady(transcriptId: string): Promise<void> {
    const appointment = await this.appointmentsRepo.findByTranscriptJobId(transcriptId);
    if (!appointment) {
      this.logger.warn(`No appointment found for transcript ${transcriptId}`);
      return;
    }

    try {
      const env = readEnv();
      if (!env.ASSEMBLY_AI_API_KEY) return;

      const transcript = await this.fetchTranscript(transcriptId, env.ASSEMBLY_AI_API_KEY);
      const draft = this.formatTranscript(transcript);

      await this.appointmentsRepo.setTranscriptDraft(appointment.id, transcriptId, draft);

      await this.purgeAssemblyAITranscript(transcriptId, env.ASSEMBLY_AI_API_KEY);

      this.logger.log(`Transcript ${transcriptId} saved for appointment ${appointment.id}`);
    } catch (err) {
      this.logger.error(`Failed to handle transcript ${transcriptId}`, err);
    }
  }

  private async downloadFile(url: string): Promise<Buffer> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  private async uploadToSupabase(path: string, buffer: Buffer): Promise<void> {
    const client = this.supabaseService.adminClient!;
    const { error } = await client.storage
      .from("session-recordings")
      .upload(path, buffer, { contentType: "video/mp4", upsert: true });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
  }

  private async getSignedUrl(path: string, expiresInSeconds: number): Promise<string> {
    const client = this.supabaseService.adminClient!;
    const { data, error } = await client.storage
      .from("session-recordings")
      .createSignedUrl(path, expiresInSeconds);
    if (error || !data?.signedUrl) throw new Error(`Signed URL failed: ${error?.message}`);
    return data.signedUrl;
  }

  private async deleteFromSupabase(path: string): Promise<void> {
    const client = this.supabaseService.adminClient!;
    await client.storage.from("session-recordings").remove([path]);
  }

  private async submitToAssemblyAI(audioUrl: string, apiKey: string): Promise<string> {
    const res = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        speaker_labels: true,
        language_code: "pt"
      })
    });
    if (!res.ok) throw new Error(`AssemblyAI submission failed: ${res.status}`);
    const data = await res.json() as { id: string };
    return data.id;
  }

  private async fetchTranscript(transcriptId: string, apiKey: string): Promise<AssemblyAITranscriptResponse> {
    const res = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { Authorization: apiKey }
    });
    if (!res.ok) throw new Error(`AssemblyAI fetch failed: ${res.status}`);
    return res.json() as Promise<AssemblyAITranscriptResponse>;
  }

  private async purgeAssemblyAITranscript(transcriptId: string, apiKey: string): Promise<void> {
    await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      method: "DELETE",
      headers: { Authorization: apiKey }
    });
  }

  private formatTranscript(transcript: AssemblyAITranscriptResponse): string {
    if (!transcript.utterances?.length) return transcript.text ?? "";

    return transcript.utterances
      .sort((a, b) => a.start - b.start)
      .map((u) => {
        const speaker = u.speaker === "A" ? "Terapeuta" : "Paciente";
        return `[${speaker}]: ${u.text}`;
      })
      .join("\n\n");
  }
}
