import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { token, status } = await request.json();

    if (!token || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validStatuses = ["accepted", "picked_up", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Find assignment by token
    const { data: assignment } = await supabase
      .from("driver_assignments")
      .select("id, reservation_id, status")
      .eq("link_token", token)
      .single();

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Update assignment status  + timestamps
    const updateData: Record<string, unknown> = { status };
    if (status === "accepted") updateData.accepted_at = new Date().toISOString();
    if (status === "picked_up") updateData.picked_up_at = new Date().toISOString();
    if (status === "completed") updateData.completed_at = new Date().toISOString();

    await supabase
      .from("driver_assignments")
      .update(updateData)
      .eq("id", assignment.id);

    // Update reservation status to match
    const resStatusMap: Record<string, string> = {
      accepted: "driver_assigned",
      picked_up: "passenger_picked_up",
      completed: "completed",
    };

    await supabase
      .from("reservations")
      .update({ status: resStatusMap[status] })
      .eq("id", assignment.reservation_id);

    // Send Telegram notification
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramBotToken && telegramChatId && telegramBotToken !== "placeholder") {
      const { data: res } = await supabase
        .from("reservations")
        .select("reservation_code")
        .eq("id", assignment.reservation_id)
        .single();

      fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `🔄 Driver Status Update\n\nCode: ${res?.reservation_code}\nNew Status: ${status}`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error("Driver status update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
