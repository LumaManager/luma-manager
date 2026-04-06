import { Inject, Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

import { EnvService } from "@/common/config/env.service";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;

  constructor(@Inject(EnvService) private readonly env: EnvService) {
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
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light">
        </head>
        <body style="margin:0;padding:0;background:#ede9e3;font-family:Georgia,'Times New Roman',Times,serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#ede9e3;padding:48px 16px;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

                <!-- Header -->
                <tr>
                  <td style="background:#0f4c5c;padding:28px 40px;border-radius:10px 10px 0 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0;color:#ffffff;font-size:15px;font-weight:400;letter-spacing:0.08em;font-family:Georgia,'Times New Roman',Times,serif;text-transform:uppercase;">Luma Manager</p>
                        </td>
                        <td align="right">
                          <p style="margin:0;color:rgba(255,255,255,0.35);font-size:12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:0.04em;">lumamanager.com.br</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Accent bar -->
                <tr>
                  <td style="background:#c9a96e;height:3px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="background:#ffffff;padding:44px 40px 36px;">

                    <!-- Headline -->
                    <p style="margin:0 0 28px;color:#0f4c5c;font-size:26px;font-weight:400;line-height:1.25;font-family:Georgia,'Times New Roman',Times,serif;letter-spacing:-0.3px;">${greeting},<br>sua vaga está garantida.</p>

                    <!-- Divider -->
                    <table width="40" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                      <tr><td style="background:#c9a96e;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
                    </table>

                    <!-- Body copy -->
                    <p style="margin:0 0 20px;color:#3d4a52;font-size:15px;line-height:1.75;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      Você entrou na waitlist do Luma Manager — construído para psicólogos que querem fechar o dia sem carregar o peso do pós-sessão.
                    </p>
                    <p style="margin:0 0 32px;color:#3d4a52;font-size:15px;line-height:1.75;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      Quando os primeiros acessos abrirem, vamos chamar quem chegou antes. Você já está dentro.
                    </p>

                    <!-- Sign-off -->
                    <p style="margin:0;color:#7a8c94;font-size:14px;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      Até lá,<br>
                      <span style="color:#0f4c5c;font-weight:600;">Equipe Luma Manager</span>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f7f4ef;padding:20px 40px;border-top:1px solid #e8e2d8;border-radius:0 0 10px 10px;">
                    <p style="margin:0;color:#a89f93;font-size:11px;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      Você recebeu este e-mail porque se cadastrou em <a href="https://lumamanager.com.br" style="color:#0f4c5c;text-decoration:none;">lumamanager.com.br</a>. Se não foi você, pode ignorar esta mensagem.
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
