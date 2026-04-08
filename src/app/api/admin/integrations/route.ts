import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { invalidateConfigCache } from "@/lib/config";

const ALLOWED_KEYS = [
  "stripe_secret_key",
  "stripe_publishable_key",
  "stripe_webhook_secret",
  "resend_api_key",
  "telegram_bot_token",
  "telegram_chat_id",
  "whatsapp_number",
  "site_url",
  "admin_emails",
];

// GET — read integration settings (masked)
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("settings")
    .select("key, value, updated_at")
    .in("key", ALLOWED_KEYS);

  // Mask sensitive values — show only last 4 chars
  const masked = (data ?? []).map((row) => {
    const val = String(row.value ?? "");
    const isSensitive = !["whatsapp_number", "site_url", "admin_emails"].includes(row.key);
    return {
      key: row.key,
      value: isSensitive && val.length > 4
        ? "•".repeat(val.length - 4) + val.slice(-4)
        : val,
      hasValue: val.length > 0,
      updated_at: row.updated_at,
    };
  });

  // Add missing keys (not yet in DB)
  for (const key of ALLOWED_KEYS) {
    if (!masked.find((m) => m.key === key)) {
      // Check env var as fallback
      const envMap: Record<string, string> = {
        stripe_secret_key: "STRIPE_SECRET_KEY",
        stripe_publishable_key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        stripe_webhook_secret: "STRIPE_WEBHOOK_SECRET",
        resend_api_key: "RESEND_API_KEY",
        telegram_bot_token: "TELEGRAM_BOT_TOKEN",
        telegram_chat_id: "TELEGRAM_CHAT_ID",
        whatsapp_number: "NEXT_PUBLIC_WHATSAPP_NUMBER",
        site_url: "NEXT_PUBLIC_SITE_URL",
        admin_emails: "ADMIN_EMAILS",
      };
      const envVal = process.env[envMap[key]] ?? "";
      masked.push({
        key,
        value: "",
        hasValue: envVal.length > 0,
        updated_at: null as unknown as string,
      });
    }
  }

  return NextResponse.json({ data: masked });
}

// POST — save an integration setting
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { key, value } = body;

  if (!ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  if (typeof value !== "string") {
    return NextResponse.json({ error: "Value must be a string" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Upsert — insert or update
  const { error } = await supabase
    .from("settings")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  if (error) {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }

  // Invalidate config cache
  invalidateConfigCache();

  return NextResponse.json({ success: true });
}
