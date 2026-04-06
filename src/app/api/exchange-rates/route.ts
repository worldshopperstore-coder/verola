import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: rates, error } = await supabase
    .from("exchange_rates")
    .select("target_currency, rate, last_updated")
    .eq("base_currency", "USD");

  if (error) {
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
  }

  const rateMap: Record<string, number> = {};
  for (const r of rates ?? []) {
    rateMap[r.target_currency] = r.rate;
  }

  return NextResponse.json({
    base: "USD",
    rates: rateMap,
    lastUpdated: rates?.[0]?.last_updated ?? null,
  });
}
