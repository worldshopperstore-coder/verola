import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, reservationCode } = await request.json();

    if (!paymentIntentId || !reservationCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify payment intent status with Stripe
    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Verify the reservation code matches metadata
    if (paymentIntent.metadata?.reservation_code !== reservationCode) {
      return NextResponse.json(
        { error: "Reservation mismatch" },
        { status: 400 }
      );
    }

    // Update reservation status to paid
    const { error: updateErr } = await supabase
      .from("reservations")
      .update({
        status: "paid",
        stripe_payment_intent_id: paymentIntent.id,
      })
      .eq("reservation_code", reservationCode)
      .eq("status", "pending");

    if (updateErr) {
      console.error("Confirm update error:", updateErr);
      return NextResponse.json(
        { error: "Failed to confirm reservation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Confirm API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
