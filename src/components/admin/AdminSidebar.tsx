"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Car,
  DollarSign,
  MapPin,
  Ticket,
  Star,
  Wallet,
  Settings,
  LogOut,
  ChevronRight,
  FileText,
  Calendar,
} from "lucide-react";

const navDefs = [
  { path: "", label: "Dashboard", icon: LayoutDashboard },
  { path: "/reservations", label: "Reservations", icon: CalendarCheck },
  { path: "/calendar", label: "Calendar", icon: Calendar },
  { path: "/drivers", label: "Drivers", icon: Users },
  { path: "/vehicles", label: "Vehicles", icon: Car },
  { path: "/pricing", label: "Pricing", icon: DollarSign },
  { path: "/regions", label: "Regions", icon: MapPin },
  { path: "/blog", label: "Blog Posts", icon: FileText },
  { path: "/coupons", label: "Coupons", icon: Ticket },
  { path: "/reviews", label: "Reviews", icon: Star },
  { path: "/driver-payments", label: "Driver Payments", icon: Wallet },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  // Extract locale from pathname (e.g. /en/admin/... → en)
  const locale = pathname.split("/")[1] || "en";
  const base = `/${locale}/admin`;

  const navItems = navDefs.map((d) => ({
    ...d,
    href: d.path ? `${base}${d.path}` : base,
  }));

  const isActive = (href: string) => {
    if (href === base) return pathname === base;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-40"
      style={{ backgroundColor: "#0F172A" }}
    >
      {/* Logo */}
      <div className="px-6 h-16 flex items-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href={base} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">
              VELORA
            </span>
            <span className="text-slate-500 text-[10px] font-medium ml-1.5 uppercase tracking-widest">
              Admin
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Menu
        </p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200"
                style={{
                  backgroundColor: active ? "rgba(249,115,22,0.1)" : "transparent",
                  color: active ? "#fb923c" : "#94a3b8",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
              >
                <item.icon
                  size={18}
                  strokeWidth={active ? 2 : 1.5}
                  style={{ color: active ? "#fb923c" : "#64748b" }}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <ChevronRight size={14} style={{ color: "rgba(251,146,60,0.6)" }} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">Admin</p>
            <p className="text-[11px] text-slate-500 truncate">admin@velora.com</p>
          </div>
        </div>
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-[13px] text-slate-500 hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  );
}
