"use client";

import { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Plane,
  Phone,
  Hotel,
  Baby,
  Tag,
  Navigation,
  CheckCircle,
  Loader2,
  QrCode,
  FileText,
  ChevronDown,
} from "lucide-react";
import QRCodeCanvas from "@/components/QRCodeCanvas";

interface Props {
  assignment: {
    id: string;
    status: string;
    reservations: {
      reservation_code: string;
      trip_type: string;
      pickup_datetime: string;
      return_datetime: string | null;
      flight_code: string | null;
      adults: number;
      children: number;
      luggage_count: number;
      child_seat: boolean;
      welcome_sign: boolean;
      welcome_name: string | null;
      hotel_name: string | null;
      hotel_address: string | null;
      notes: string | null;
      total_price: number;
      status: string;
      qr_code_token: string | null;
      customers: {
        first_name: string;
        last_name: string;
        phone: string;
        email: string;
      } | null;
      regions: {
        name_en: string;
        name_tr: string;
        distance_km: number;
        duration_minutes: number;
      } | null;
    } | null;
    drivers: { full_name: string; phone: string } | null;
    vehicles: {
      plate_number: string;
      brand: string;
      model: string;
    } | null;
  };
  token: string;
}

export default function DriverPanel({ assignment, token }: Props) {
  const [status, setStatus] = useState(assignment.status);
  const [loading, setLoading] = useState(false);

  const res = assignment.reservations;
  const customer = res?.customers;
  const region = res?.regions;
  const vehicle = assignment.vehicles;

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/driver/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status: newStatus }),
      });
      if (response.ok) {
        setStatus(newStatus);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  if (!res) {
    return (
      <div className="text-center py-12 text-gray-400">
        Reservation data not found
      </div>
    );
  }

  const pickupDate = new Date(res.pickup_datetime);
  const isCompleted = status === "completed";

  return (
    <div className="space-y-4">
      {/* Status banner */}
      <div
        className={`rounded-xl p-4 text-center text-sm font-medium ${
          status === "assigned"
            ? "bg-yellow-50 text-yellow-800"
            : status === "accepted"
              ? "bg-blue-50 text-blue-800"
              : status === "picked_up"
                ? "bg-purple-50 text-purple-800"
                : "bg-green-50 text-green-800"
        }`}
      >
        Status:{" "}
        <span className="font-bold uppercase">
          {status.replace("_", " ")}
        </span>
      </div>

      {/* Reservation info card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Transfer Details</h2>
          <span className="font-mono text-sm font-bold text-slate-900">
            {res.reservation_code}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          {/* Route */}
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-orange-500 mt-0.5" />
            <div>
              <p className="font-medium">
                Antalya Airport → {region?.name_en}
              </p>
              <p className="text-xs text-gray-400">
                ~{region?.duration_minutes} min • {region?.distance_km} km
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <p className="font-medium">
                {pickupDate.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-orange-500 font-bold">
                {pickupDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Flight */}
          {res.flight_code && (
            <div className="flex items-center gap-3">
              <Plane size={16} className="text-gray-400" />
              <p className="font-medium">{res.flight_code}</p>
            </div>
          )}

          {/* Passengers */}
          <div className="flex items-center gap-3">
            <Users size={16} className="text-gray-400" />
            <p>
              {res.adults} adults, {res.children} children, {res.luggage_count}{" "}
              luggage
            </p>
          </div>

          {/* Child seat */}
          {res.child_seat && (
            <div className="flex items-center gap-3">
              <Baby size={16} className="text-green-500" />
              <p className="text-green-700">Child seat required</p>
            </div>
          )}

          {/* Welcome sign */}
          {res.welcome_sign && (
            <div className="flex items-center gap-3">
              <Tag size={16} className="text-blue-500" />
              <p className="text-blue-700">
                Welcome sign: {res.welcome_name || "Customer name"}
              </p>
            </div>
          )}

          {/* Hotel */}
          {res.hotel_name && (
            <div className="flex items-start gap-3">
              <Hotel size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">{res.hotel_name}</p>
                {res.hotel_address && (
                  <p className="text-xs text-gray-400">{res.hotel_address}</p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {res.notes && (
            <div className="p-3 bg-yellow-50 rounded-lg text-yellow-800 text-xs">
              📝 {res.notes}
            </div>
          )}

          {/* Return trip */}
          {res.trip_type === "round_trip" && res.return_datetime && (
            <div className="p-3 bg-blue-50 rounded-lg text-blue-800 text-xs">
              🔄 Return:{" "}
              {new Date(res.return_datetime).toLocaleDateString("en-GB")}{" "}
              {new Date(res.return_datetime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </div>

      {/* Customer contact card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-3">Customer</h3>
        <div className="space-y-2">
          <p className="font-medium text-gray-800">
            {customer?.first_name} {customer?.last_name}
          </p>
          <a
            href={`tel:${customer?.phone}`}
            className="flex items-center gap-2 text-blue-600 font-medium"
          >
            <Phone size={16} />
            {customer?.phone}
          </a>
          <a
            href={`https://wa.me/${customer?.phone?.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm rounded-lg font-medium"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Vehicle info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-2">Vehicle</h3>
        <p className="text-sm">
          {vehicle?.brand} {vehicle?.model} —{" "}
          <span className="font-mono font-bold">{vehicle?.plate_number}</span>
        </p>
      </div>

      {/* QR Code section */}
      {res.qr_code_token && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
          <h3 className="font-bold text-gray-900 mb-2">
            <QrCode size={16} className="inline mr-2" />
            Verification QR Code
          </h3>
          <p className="text-xs text-gray-400 mb-3">
            Show this to verify the transfer
          </p>
          {/* QR code rendered client-side */}
          <div className="inline-block p-4 bg-gray-50 rounded-lg">
            <QRCodeCanvas value={res.qr_code_token} size={192} />
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!isCompleted && (
        <div className="space-y-3">
          {status === "assigned" && (
            <button
              onClick={() => updateStatus("accepted")}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle size={18} />
              )}
              Accept Transfer
            </button>
          )}

          {status === "accepted" && (
            <button
              onClick={() => updateStatus("picked_up")}
              disabled={loading}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Navigation size={18} />
              )}
              Passenger Picked Up
            </button>
          )}

          {status === "picked_up" && (
            <button
              onClick={() => updateStatus("completed")}
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle size={18} />
              )}
              Transfer Completed
            </button>
          )}

          {/* Navigate button */}
          {res.hotel_address && (status === "accepted" || status === "picked_up") && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(res.hotel_address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-gray-800 text-white font-medium rounded-xl flex items-center justify-center gap-2"
            >
              <Navigation size={16} />
              Navigate to Destination
            </a>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="text-center py-8">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-800">
            Transfer Completed!
          </p>
          <p className="text-sm text-gray-400">Thank you for your service.</p>
        </div>
      )}
    </div>
  );
}
