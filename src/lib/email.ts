import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

interface ReservationEmailData {
  to: string;
  reservationCode: string;
  firstName: string;
  regionName: string;
  pickupDate: string;
  pickupTime: string;
  tripType: "one_way" | "round_trip";
  returnDate?: string;
  returnTime?: string;
  totalEur: number;
  locale: string;
}

const subjects: Record<string, string> = {
  en: "Your VELORA Transfer Reservation",
  tr: "VELORA Transfer Rezervasyonunuz",
  de: "Ihre VELORA Transfer Reservierung",
  pl: "Twoja Rezerwacja VELORA Transfer",
  ru: "Ваше Бронирование VELORA Transfer",
};

export async function sendReservationEmail(data: ReservationEmailData) {
  const resend = getResend();
  if (!resend) return;

  const subject = subjects[data.locale] ?? subjects.en;
  const tripLabel =
    data.tripType === "round_trip" ? "Round Trip" : "One Way";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #111113; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">VELORA</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">VIP Airport Transfer</p>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px; margin: 0 0 24px;">Hi ${data.firstName},</p>
        <p style="margin: 0 0 24px; color: #a1a1aa;">Your transfer has been confirmed. Here are your details:</p>
        
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <div style="text-align: center; margin-bottom: 16px;">
            <p style="color: #86868b; font-size: 12px; margin: 0;">Reservation Code</p>
            <p style="color: #f97316; font-size: 28px; font-weight: bold; margin: 4px 0; letter-spacing: 3px;">${data.reservationCode}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #86868b; font-size: 13px;">Route</td>
              <td style="padding: 8px 0; text-align: right; font-size: 13px;">Antalya Airport → ${data.regionName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #86868b; font-size: 13px;">Type</td>
              <td style="padding: 8px 0; text-align: right; font-size: 13px;">${tripLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #86868b; font-size: 13px;">Date</td>
              <td style="padding: 8px 0; text-align: right; font-size: 13px;">${data.pickupDate} at ${data.pickupTime}</td>
            </tr>
            ${
              data.returnDate
                ? `<tr>
              <td style="padding: 8px 0; color: #86868b; font-size: 13px;">Return</td>
              <td style="padding: 8px 0; text-align: right; font-size: 13px;">${data.returnDate} at ${data.returnTime}</td>
            </tr>`
                : ""
            }
            <tr style="border-top: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 12px 0 0; color: #86868b; font-size: 13px; font-weight: bold;">Total</td>
              <td style="padding: 12px 0 0; text-align: right; font-size: 16px; font-weight: bold; color: #f97316;">€${data.totalEur.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <p style="color: #86868b; font-size: 13px; margin: 0 0 8px;">Need help? Contact us:</p>
        <p style="font-size: 13px; margin: 0;">
          <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "905431451548"}" style="color: #25D366;">WhatsApp</a> · 
          <a href="mailto:info@veloratransfer.com" style="color: #f97316;">info@veloratransfer.com</a>
        </p>
      </div>
      <div style="background: rgba(255,255,255,0.03); padding: 16px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
        <p style="color: #52525b; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} VELORA Transfer · Antalya, Turkey</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "VELORA Transfer <noreply@veloratransfer.com>",
      to: data.to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send reservation email:", err);
  }
}
