import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface MessagePayload {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  storeName: string;
  storePhone: string;
  message: string;
}

export async function POST(req: Request) {
  const body: MessagePayload = await req.json();
  const { customerEmail, customerName, orderNumber, storeName, storePhone, message } = body;

  const to = process.env.TO_OVERRIDE ?? customerEmail;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">

        <tr>
          <td style="background:#7C3AED;padding:28px 40px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">Goprix</p>
            <p style="margin:6px 0 0;font-size:12px;color:#e9d5ff;">Message de votre magasin</p>
          </td>
        </tr>

        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 20px;font-size:15px;color:#374151;">
            Bonjour <strong>${customerName}</strong>,
          </p>
          <p style="margin:0 0 20px;font-size:14px;color:#6b7280;">
            L'équipe du magasin <strong>${storeName}</strong> vous a laissé un message concernant votre réservation <strong style="color:#7C3AED;">${orderNumber}</strong> :
          </p>

          <div style="background:#f5f3ff;border-left:4px solid #7C3AED;border-radius:0 12px 12px 0;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;font-size:15px;color:#1f2937;line-height:1.6;">${message.replace(/\n/g, "<br>")}</p>
          </div>

          <p style="margin:0;font-size:13px;color:#9ca3af;">
            Pour toute question, contactez le magasin directement au <strong>${storePhone}</strong>.
          </p>
        </td></tr>

        <tr>
          <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:16px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Goprix — Click &amp; Collect</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL ?? "Goprix <onboarding@resend.dev>",
    to,
    subject: `Message de votre magasin — commande ${orderNumber}`,
    html,
  });

  if (error) {
    console.error("[message] Resend error:", error);
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
