import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NotifyPayload {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  pickupDate: string;
  pickupStart: string;
  pickupEnd: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

export async function POST(req: Request) {
  const body: NotifyPayload = await req.json();

  const {
    customerEmail, customerName, orderNumber,
    storeName, storeAddress, storePhone,
    pickupDate, pickupStart, pickupEnd,
    items, total,
  } = body;

  const itemsHtml = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">${i.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#6b7280;text-align:center;">×${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;text-align:right;font-weight:600;">${(i.price * i.quantity).toFixed(2)} €</td>
      </tr>`
    )
    .join("");

  const dateFormatted = pickupDate.split("-").reverse().join("/");

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#7C3AED;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Goprix</p>
            <p style="margin:8px 0 0;font-size:13px;color:#e9d5ff;">Click &amp; Collect</p>
          </td>
        </tr>

        <!-- Checkmark banner -->
        <tr>
          <td style="background:#f0fdf4;border-bottom:1px solid #dcfce7;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:32px;">✅</p>
            <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:#15803d;">Votre commande est prête !</p>
            <p style="margin:4px 0 0;font-size:14px;color:#16a34a;">Vous pouvez venir la retirer dès maintenant.</p>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 24px;font-size:15px;color:#374151;">
            Bonjour <strong>${customerName}</strong>,<br><br>
            Votre réservation <strong style="color:#7C3AED;">${orderNumber}</strong> est prête à être retirée en magasin.
          </p>

          <!-- Pickup info -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#7C3AED;text-transform:uppercase;letter-spacing:.5px;">📍 Point de retrait</p>
              <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#1f2937;">${storeName}</p>
              <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${storeAddress}</p>
              <p style="margin:0 0 16px;font-size:13px;color:#6b7280;">Tél : ${storePhone}</p>
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#7C3AED;text-transform:uppercase;letter-spacing:.5px;">🕐 Créneau réservé</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#1f2937;">${dateFormatted} de ${pickupStart} à ${pickupEnd}</p>
            </td></tr>
          </table>

          <!-- Items -->
          <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1f2937;text-transform:uppercase;letter-spacing:.5px;">Articles commandés</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding:12px 0 0;font-size:15px;font-weight:700;color:#1f2937;">Total TTC</td>
              <td style="padding:12px 0 0;font-size:15px;font-weight:800;color:#7C3AED;text-align:right;">${total.toFixed(2)} €</td>
            </tr>
          </table>

          <!-- CTA -->
          <div style="text-align:center;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:#6b7280;">
              ⚠️ Votre réservation est valable <strong>48 heures</strong>. Passé ce délai, les articles pourront être remis en rayon.
            </p>
          </div>

          <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
            Des questions ? Contactez le magasin au ${storePhone}
          </p>
        </td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Goprix — Click &amp; Collect</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const to = process.env.TO_OVERRIDE ?? customerEmail;

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL ?? "Goprix <onboarding@resend.dev>",
    to,
    subject: `✅ Votre commande ${orderNumber} est prête à retirer !`,
    html,
  });

  if (error) {
    console.error("[notify] Resend error:", error);
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
