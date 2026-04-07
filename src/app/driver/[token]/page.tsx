import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import DriverPanel from "@/components/driver/DriverPanel";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function DriverPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Find assignment by token
  const { data: assignment } = await supabase
    .from("driver_assignments")
    .select(
      `*,
       drivers(full_name, phone),
       vehicles(plate_number, brand, model),
       reservations(
         reservation_code, trip_type, pickup_datetime, return_datetime,
         flight_code, adults, children, luggage_count, child_seat,
         welcome_sign, welcome_name, hotel_name, hotel_address, notes,
         status, qr_code_token,
         customers(first_name, last_name, phone, email),
         regions(name_en, name_tr, distance_km, duration_minutes)
       )`
    )
    .eq("link_token", token)
    .single();

  if (!assignment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            VELORA
          </h1>
          <p className="text-sm text-gray-400">Driver Panel</p>
        </div>

        <DriverPanel
          assignment={JSON.parse(JSON.stringify(assignment))}
          token={token}
        />
      </div>
    </div>
  );
}
