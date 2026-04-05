import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

import { EnvService } from "@/common/config/env.service";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;

  constructor(private readonly env: EnvService) {
    const key = this.env.get("RESEND_API_KEY");
    this.resend = key ? new Resend(key) : null;
  }

  async sendWaitlistConfirmation(to: string, fullName?: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn("RESEND_API_KEY not configured — skipping confirmation email");
      return;
    }

    const name = fullName?.trim() || null;
    const greeting = name ? `Olá, ${name.split(" ")[0]}` : "Olá";

    const { error } = await this.resend.emails.send({
      from: "Luma Manager <noreply@lumamanager.com.br>",
      to,
      subject: "Você está na lista — Luma Manager",
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background:#f5f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7f9;padding:40px 0;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                <tr>
                  <td style="background:#0f4c5c;padding:32px 40px;">
                    <p style="margin:0;color:#ffffff;font-size:20px;font-weight:600;letter-spacing:-0.3px;">Luma Manager</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px;">
                    <p style="margin:0 0 16px;color:#0f4c5c;font-size:24px;font-weight:600;line-height:1.3;">${greeting}, sua vaga está reservada.</p>
                    <p style="margin:0 0 24px;color:#4a5568;font-size:16px;line-height:1.6;">
                      Você entrou na waitlist do Luma Manager — a plataforma feita para psicólogos que querem organizar a prática sem abrir dez abas.
                    </p>
                    <p style="margin:0 0 24px;color:#4a5568;font-size:16px;line-height:1.6;">
                      Quando abrirmos os primeiros convites, você será um dos primeiros a saber.
                    </p>
                    <p style="margin:0;color:#718096;font-size:14px;line-height:1.6;">
                      Até lá,<br>
                      <strong style="color:#0f4c5c;">Equipe Luma Manager</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 40px;border-top:1px solid #e8ecef;">
                    <p style="margin:0;color:#a0aec0;font-size:12px;">
                      Você recebeu este e-mail porque se cadastrou em lumamanager.com.br. Se não foi você, pode ignorar esta mensagem.
                    </p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `
    });

    if (error) {
      this.logger.error("Failed to send waitlist confirmation email", error);
    }
  }
}
