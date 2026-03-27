// lib/email.ts — kirim email via Nodemailer SMTP
// Konfigurasi SMTP ada di lib/config.ts
import nodemailer from "nodemailer";
import { SMTP } from "./config";

const transporter = nodemailer.createTransport({
  host:   SMTP.host,
  port:   SMTP.port,
  secure: SMTP.secure,
  auth: {
    user: SMTP.user,
    pass: SMTP.pass,
  },
});

export async function sendOtpEmail(
  to: string,
  otp: string,
  type: "register" | "login"
): Promise<{ success: boolean; error?: string }> {
  const isRegister = type === "register";
  const subject    = isRegister
    ? "Kode Verifikasi Registrasi Snaptok"
    : "Kode Verifikasi Login Snaptok";

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:60px 0;">
        <table class="container" width="460" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #eef2f6;border-radius:8px;">
          
          <tr>
            <td style="padding:48px 40px 32px;text-align:left;">
              <div style="font-size:20px;font-weight:800;letter-spacing:-1px;color:#000000;text-transform:uppercase;">
                SNAP<span style="color:#94a3b8;">TOK</span>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 48px;">
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;letter-spacing:-0.03em;">
                Verifikasi Identitas
              </h1>
              <p style="margin:0 0 32px;font-size:15px;color:#4b5563;line-height:1.6;letter-spacing:-0.01em;">
                Gunakan kode keamanan di bawah ini untuk melanjutkan akses ke akun Snaptok Anda. Kode ini hanya berlaku selama 10 menit.
              </p>
              
              <div style="background-color:#f8fafc;border:1px solid #f1f5f9;border-radius:12px;padding:32px;text-align:center;margin-bottom:32px;">
                <span style="font-size:42px;font-weight:700;letter-spacing:10px;color:#000000;font-family:'Roboto Mono',SFMono-Regular,Menlo,Monaco,Consolas,monospace;display:inline-block;margin-left:10px;">
                  ${otp}
                </span>
              </div>

              <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">
                Jika Anda tidak meminta kode ini, harap abaikan pesan ini. Demi keamanan, jangan bagikan kode ini kepada siapapun.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px;background-color:#f9fafb;border-top:1px solid #f1f5f9;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#6b7280;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">
                      Snaptok Developer Team
                    </p>
                    <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;">
                      © ${new Date().getFullYear()} snaptok.my.id — Platform Video Pendek Masa Kini.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <table width="460" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#cbd5e1;">
                Email otomatis. Mohon tidak membalas.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: SMTP.from,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("[email] sendMail error:", err);
    return { success: false, error: String(err) };
  }
}
