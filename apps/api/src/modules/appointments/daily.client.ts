import { Injectable } from "@nestjs/common";
import { readEnv } from "../../common/config/env";

interface DailyRoom {
  id: string;
  name: string;
  url: string;
}

interface DailyMeetingToken {
  token: string;
}

interface DailyRecordingAccessLink {
  download_link: string;
}

@Injectable()
export class DailyClient {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.daily.co/v1";

  constructor() {
    this.apiKey = readEnv().DAILY_API_KEY ?? "";
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Daily.co ${method} ${path} → ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
  }

  async createRoom(name: string): Promise<DailyRoom> {
    return this.request<DailyRoom>("POST", "/rooms", {
      name,
      privacy: "private",
      properties: {
        enable_recording: "cloud",
        max_participants: 2,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4
      }
    });
  }

  async createMeetingToken(roomName: string, isOwner: boolean): Promise<DailyMeetingToken> {
    return this.request<DailyMeetingToken>("POST", "/meeting-tokens", {
      properties: {
        room_name: roomName,
        is_owner: isOwner,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4
      }
    });
  }

  async startRecording(roomName: string): Promise<void> {
    await this.request("POST", `/recordings/start`, { room_name: roomName });
  }

  async getRecordingAccessLink(recordingId: string): Promise<string> {
    const data = await this.request<DailyRecordingAccessLink>(
      "GET",
      `/recordings/${recordingId}/access-link`
    );
    return data.download_link;
  }

  async deleteRoom(roomName: string): Promise<void> {
    await this.request("DELETE", `/rooms/${roomName}`);
  }
}
