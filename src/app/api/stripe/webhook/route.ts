import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendReservationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const reservationId = session.metadata?.reservation_id;
    const reservationCode = session.metadata?.reservation_code;

    if (reservationId) {
      // Update reservation status to paid
      await supabase
        .from("reservations")
        .update({
          status: "paid",
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        })
        .eq("id", reservationId);

      // Log notification
      await supabase.from("notification_log").insert({
        type: "payment_received",
        channel: "system",
        recipient: "admin",
        content: `Payment received for reservation ${reservationCode}. Amount: $${(session.amount_total ?? 0) / 100}`,
        metadata: { reservation_id: reservationId, session_id: session.id },
      });

      // Send confirmation email to customer
      const { data: resData } = await supabase
        .from("reservations")
        .select("*, regions(name_en, name_tr, name_de, name_pl, name_ru, slug), customers(email, first_name)")
        .eq("id", reservationId)
        .single();

      if (resData?.customers?.email) {
        const locale = session.success_url?.match(/\/(\w{2})\/booking/)?.[1] ?? "en";
        const regionName =
          resData.regions?.[`name_${locale}` as keyof typeof resData.regions] ??
          resData.regions?.name_en ??
          "";
        const eurRate = resData.exchange_rate_eur ?? 1;
        const totalEur = eurRate > 0 ? resData.total_price / eurRate : resData.total_price;

        sendReservationEmail({
          to: resData.customers.email,
          reservationCode: resData.reservation_code,
          firstName: resData.customers.first_name,
          regionName: String(regionName),
          pickupDate: resData.pickup_datetime?.split("T")[0] ?? "",
          pickupTime: resData.pickup_datetime?.split("T")[1]?.slice(0, 5) ?? "",
          tripType: resData.trip_type,
          returnDate: resData.return_datetime?.split("T")[0],
          returnTime: resData.return_datetime?.split("T")[1]?.slice(0, 5),
          totalEur,
          locale,
        }).catch(() => {});
      }

      // Send Telegram notification (fire and forget)
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      if (telegramBotToken && telegramChatId) {
        const message = `💰 New Payment!\n\nCode: ${reservationCode}\nAmount: $${((session.amount_total ?? 0) / 100).toFixed(2)}\nEmail: ${session.customer_email}`;
        fetch(
          `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: message,
              parse_mode: "HTML",
            }),
          }
        ).catch(() => {});
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const reservationId = session.metadata?.reservation_id;
    if (reservationId) {
      await supabase
        .from("reservations")
        .update({ status: "cancelled" })
        .eq("id", reservationId)
        .eq("status", "pending");
    }
  }

  return NextResponse.json({ received: true });
}
