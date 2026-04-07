import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));

  // Range: first day of month to last day of month (with buffer for timezone)
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 1).toISOString();

  const admin = createAdminClient();

  const { data } = await admin
    .from("reservations")
    .select(
      "id, reservation_code, status, pickup_datetime, return_datetime, trip_type, total_price, hotel_name, adults, children, customers(first_name, last_name, phone), regions(name_en), vehicle_categories(name), driver_assignments(drivers(full_name))"
    )
    .gte("pickup_datetime", startDate)
    .lt("pickup_datetime", endDate)
    .order("pickup_datetime", { ascending: true });

  const events = (data ?? []).map((r) => {
    const customer = Array.isArray(r.customers) ? r.customers[0] : r.customers;
    const region = Array.isArray(r.regions) ? r.regions[0] : r.regions;
    const vehicle = Array.isArray(r.vehicle_categories) ? r.vehicle_categories[0] : r.vehicle_categories;
    const assignment = r.driver_assignments?.[0];
    const driver = assignment ? (Array.isArray(assignment.drivers) ? assignment.drivers[0] : assignment.drivers) : null;

    return {
      id: r.id,
      code: r.reservation_code,
      status: r.status,
      pickup: r.pickup_datetime,
      returnDate: r.return_datetime,
      tripType: r.trip_type,
      price: r.total_price,
      hotel: r.hotel_name,
      adults: r.adults,
      children: r.children,
      customer: customer ? `${customer.first_name} ${customer.last_name}` : "",
      phone: (customer as { phone?: string })?.phone ?? "",
      region: (region as { name_en?: string })?.name_en ?? "",
      vehicle: (vehicle as { name?: string })?.name ?? "",
      driver: (driver as { full_name?: string })?.full_name ?? "",
    };
  });

  return NextResponse.json({ events, year, month });
}
