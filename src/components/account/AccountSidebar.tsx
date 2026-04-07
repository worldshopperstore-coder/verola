"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  CalendarCheck,
  User,
  LogOut,
} from "lucide-react";

interface Props {
  locale: string;
  userEmail: string;
  userName: string;
}

const menuItems = [
  { key: "dashboard", icon: LayoutDashboard, href: "" },
  { key: "reservations", icon: CalendarCheck, href: "/reservations" },
  { key: "profile", icon: User, href: "/profile" },
];

const labels: Record<string, Record<string, string>> = {
  dashboard: { en: "Dashboard", tr: "Panel", de: "Dashboard", pl: "Panel", ru: "Панель" },
  reservations: { en: "My Reservations", tr: "Rezervasyonlarım", de: "Meine Buchungen", pl: "Moje rezerwacje", ru: "Мои бронирования" },
  profile: { en: "Profile", tr: "Profil", de: "Profil", pl: "Profil", ru: "Профиль" },
  logout: { en: "Sign Out", tr: "Çıkış", de: "Abmelden", pl: "Wyloguj", ru: "Выйти" },
};

export default function AccountSidebar({ locale, userEmail, userName }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  const basePath = `/${locale}/account`;

  return (
    <div className="lg:w-64 flex-shrink-0">
      {/* User info */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-4">
        <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mb-3">
          <User size={18} className="text-orange-500" />
        </div>
        <p className="text-white font-medium text-sm truncate">{userName}</p>
        <p className="text-gray-500 text-xs truncate">{userEmail}</p>
      </div>

      {/* Navigation */}
      <nav className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        {menuItems.map((item) => {
          const fullPath = `${basePath}${item.href}`;
          const isActive = item.href === "" ? pathname === basePath : pathname.startsWith(fullPath);
          const Icon = item.icon;

          return (
            <a
              key={item.key}
              href={fullPath}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-orange-500/10 text-orange-500 font-medium border-l-2 border-orange-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {labels[item.key]?.[locale] ?? labels[item.key]?.en}
            </a>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors border-t border-white/5"
        >
          <LogOut size={16} />
          {labels.logout[locale] ?? labels.logout.en}
        </button>
      </nav>
    </div>
  );
}
