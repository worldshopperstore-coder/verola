import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Buffer time around each transfer (minutes)
const BUFFER_MINUTES = 90;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { reservationId, driverId, vehicleId } = body;

  if (!reservationId || !driverId || !vehicleId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Get the reservation's pickup time
  const { data: reservation } = await admin
    .from("reservations")
    .select("id, pickup_datetime, return_datetime, trip_type")
    .eq("id", reservationId)
    .single();

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  const pickupTime = new Date(reservation.pickup_datetime);
  const windowStart = new Date(pickupTime.getTime() - BUFFER_MINUTES * 60 * 1000);
  const windowEnd = new Date(pickupTime.getTime() + BUFFER_MINUTES * 60 * 1000);

  const conflicts: { type: "driver" | "vehicle"; reservation_code: string; pickup: string; region: string; status: string }[] = [];

  // Check driver conflicts: any active assignment for this driver within the time window
  const { data: driverAssignments } = await admin
    .from("driver_assignments")
    .select("id, reservation_id, status, reservations(id, reservation_code, pickup_datetime, status, regions(name_en))")
    .eq("driver_id", driverId)
    .in("status", ["assigned", "accepted", "picked_up"]);

  for (const da of driverAssignments ?? []) {
    const res = Array.isArray(da.reservations) ? da.reservations[0] : da.reservations;
    if (!res || res.id === reservationId) continue;
    if (["cancelled", "completed"].includes(res.status)) continue;

    const otherPickup = new Date(res.pickup_datetime);
    if (otherPickup >= windowStart && otherPickup <= windowEnd) {
      const region = Array.isArray(res.regions) ? res.regions[0] : res.regions;
      conflicts.push({
        type: "driver",
        reservation_code: res.reservation_code,
        pickup: res.pickup_datetime,
        region: (region as { name_en?: string })?.name_en ?? "",
        status: da.status,
      });
    }
  }

  // Check vehicle conflicts: any active assignment for this vehicle within the time window
  const { data: vehicleAssignments } = await admin
    .from("driver_assignments")
    .select("id, reservation_id, status, reservations(id, reservation_code, pickup_datetime, status, regions(name_en))")
    .eq("vehicle_id", vehicleId)
    .in("status", ["assigned", "accepted", "picked_up"]);

  for (const va of vehicleAssignments ?? []) {
    const res = Array.isArray(va.reservations) ? va.reservations[0] : va.reservations;
    if (!res || res.id === reservationId) continue;
    if (["cancelled", "completed"].includes(res.status)) continue;

    const otherPickup = new Date(res.pickup_datetime);
    if (otherPickup >= windowStart && otherPickup <= windowEnd) {
      const region = Array.isArray(res.regions) ? res.regions[0] : res.regions;
      // Avoid duplicate if same reservation already flagged as driver conflict
      const alreadyAdded = conflicts.some((c) => c.reservation_code === res.reservation_code);
      if (!alreadyAdded) {
        conflicts.push({
          type: "vehicle",
          reservation_code: res.reservation_code,
          pickup: res.pickup_datetime,
          region: (region as { name_en?: string })?.name_en ?? "",
          status: va.status,
        });
      } else {
        // Mark existing as both
        const existing = conflicts.find((c) => c.reservation_code === res.reservation_code);
        if (existing) existing.type = "driver"; // will show as "driver & vehicle" in UI
      }
    }
  }

  return NextResponse.json({
    hasConflicts: conflicts.length > 0,
    conflicts,
    bufferMinutes: BUFFER_MINUTES,
  });
}
