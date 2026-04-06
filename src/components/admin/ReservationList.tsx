"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Phone,
  Send,
  ChevronDown,
} from "lucide-react";

interface Reservation {
  id: string;
  reservation_code: string;
  status: string;
  trip_type: string;
  total_price: number;
  pickup_datetime: string;
  return_datetime: string | null;
  flight_code: string | null;
  adults: number;
  children: number;
  child_seat: boolean;
  welcome_sign: boolean;
  hotel_name: string | null;
  notes: string | null;
  created_at: string;
  customers: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  regions: { name_en: string; slug: string } | null;
  vehicle_categories: { name: string } | null;
  driver_assignments: Array<{
    id: string;
    status: string;
    drivers: { full_name: string; phone: string } | null;
  }>;
}

interface Props {
  reservations: Reservation[];
  drivers: Array<{ id: string; full_name: string; phone: string }>;
  vehicles: Array<{
    id: string;
    plate_number: string;
    brand: string;
    model: string;
  }>;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  driver_assigned: "bg-purple-100 text-purple-800",
  passenger_picked_up: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function ReservationList({
  reservations,
  drivers,
  vehicles,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      search === "" ||
      r.reservation_code.toLowerCase().includes(search.toLowerCase()) ||
      r.customers?.first_name.toLowerCase().includes(search.toLowerCase()) ||
      r.customers?.last_name.toLowerCase().includes(search.toLowerCase()) ||
      r.customers?.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const assignDriver = async (reservationId: string) => {
    if (!selectedDriver || !selectedVehicle) return;

    const res = await fetch("/api/admin/assign-driver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reservationId,
        driverId: selectedDriver,
        vehicleId: selectedVehicle,
      }),
    });

    if (res.ok) {
      window.location.reload();
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, or email..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="driver_assigned">Driver Assigned</option>
          <option value="passenger_picked_up">Picked Up</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservation cards */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Summary row */}
            <div
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
              onClick={() =>
                setExpandedId(expandedId === r.id ? null : r.id)
              }
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {r.reservation_code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status]}`}
                  >
                    {r.status.replace("_", " ")}
                  </span>
                  {r.trip_type === "round_trip" && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      Round Trip
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {r.customers?.first_name} {r.customers?.last_name} →{" "}
                  {r.regions?.name_en}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  ${r.total_price.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(r.pickup_datetime).toLocaleDateString()}{" "}
                  {new Date(r.pickup_datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform ${expandedId === r.id ? "rotate-180" : ""}`}
              />
            </div>

            {/* Expanded detail */}
            {expandedId === r.id && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1">
                      Customer
                    </p>
                    <p className="font-medium">
                      {r.customers?.first_name} {r.customers?.last_name}
                    </p>
                    <p className="text-gray-500">{r.customers?.email}</p>
                    <p className="text-gray-500">{r.customers?.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1">
                      Transfer
                    </p>
                    <p>Airport → {r.regions?.name_en}</p>
                    <p className="text-gray-500">
                      Flight: {r.flight_code || "—"}
                    </p>
                    <p className="text-gray-500">
                      {r.adults} adults, {r.children} children
                    </p>
                    {r.child_seat && (
                      <p className="text-green-600 text-xs">
                        Child seat requested
                      </p>
                    )}
                    {r.welcome_sign && (
                      <p className="text-blue-600 text-xs">
                        Welcome sign requested
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1">
                      Details
                    </p>
                    <p>Hotel: {r.hotel_name || "—"}</p>
                    <p className="text-gray-500">
                      Notes: {r.notes || "—"}
                    </p>
                    <p className="text-gray-500">
                      Booked:{" "}
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Driver assignment */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {r.driver_assignments?.length > 0 ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-400">
                        Driver:
                      </span>
                      <span className="font-medium text-sm">
                        {r.driver_assignments[0].drivers?.full_name}
                      </span>
                      <a
                        href={`tel:${r.driver_assignments[0].drivers?.phone}`}
                        className="text-blue-600 text-sm flex items-center gap-1"
                      >
                        <Phone size={12} />
                        {r.driver_assignments[0].drivers?.phone}
                      </a>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.driver_assignments[0].status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {r.driver_assignments[0].status}
                      </span>
                    </div>
                  ) : r.status === "paid" ? (
                    assigningId === r.id ? (
                      <div className="flex items-center gap-3">
                        <select
                          value={selectedDriver}
                          onChange={(e) => setSelectedDriver(e.target.value)}
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                        >
                          <option value="">Select Driver</option>
                          {drivers.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.full_name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedVehicle}
                          onChange={(e) => setSelectedVehicle(e.target.value)}
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
                        >
                          <option value="">Select Vehicle</option>
                          {vehicles.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.plate_number} — {v.brand} {v.model}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => assignDriver(r.id)}
                          disabled={!selectedDriver || !selectedVehicle}
                          className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-40 flex items-center gap-1"
                        >
                          <Send size={14} />
                          Assign & Send Link
                        </button>
                        <button
                          onClick={() => setAssigningId(null)}
                          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAssigningId(r.id);
                          setSelectedDriver("");
                          setSelectedVehicle("");
                        }}
                        className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
                      >
                        <UserPlus size={14} />
                        Assign Driver
                      </button>
                    )
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No reservations found
          </div>
        )}
      </div>
    </div>
  );
}
