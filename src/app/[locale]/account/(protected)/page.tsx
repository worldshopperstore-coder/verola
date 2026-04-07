import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CalendarCheck, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";

const t: Record<string, Record<string, string>> = {
  title: { en: "Dashboard", tr: "Panel", de: "Dashboard", pl: "Panel", ru: "Панель" },
  welcome: { en: "Welcome back", tr: "Tekrar hoş geldiniz", de: "Willkommen zurück", pl: "Witamy ponownie", ru: "С возвращением" },
  upcoming: { en: "Upcoming Transfers", tr: "Yaklaşan Transferler", de: "Bevorstehende Transfers", pl: "Nadchodzące transfery", ru: "Предстоящие трансферы" },
  noUpcoming: { en: "No upcoming transfers", tr: "Yaklaşan transfer yok", de: "Keine bevorstehenden Transfers", pl: "Brak nadchodzących transferów", ru: "Нет предстоящих трансферов" },
  total: { en: "Total Bookings", tr: "Toplam Rezervasyon", de: "Gesamtbuchungen", pl: "Łączne rezerwacje", ru: "Всего бронирований" },
  active: { en: "Active", tr: "Aktif", de: "Aktiv", pl: "Aktywne", ru: "Активных" },
  completed: { en: "Completed", tr: "Tamamlanan", de: "Abgeschlossen", pl: "Zakończone", ru: "Завершённых" },
  cancelled: { en: "Cancelled", tr: "İptal", de: "Storniert", pl: "Anulowane", ru: "Отменённых" },
  viewAll: { en: "View All Reservations", tr: "Tüm Rezervasyonları Gör", de: "Alle Buchungen anzeigen", pl: "Zobacz wszystkie rezerwacje", ru: "Все бронирования" },
  bookNew: { en: "Book New Transfer", tr: "Yeni Transfer Rezervasyonu", de: "Neuen Transfer buchen", pl: "Zarezerwuj nowy transfer", ru: "Забронировать трансфер" },
};

export default async function AccountDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "";

  // Find customer record
  const { data: customer } = await admin
    .from("customers")
    .select("id")
    .eq("auth_user_id", user!.id)
    .single();

  let totalCount = 0;
  let activeCount = 0;
  let completedCount = 0;
  let cancelledCount = 0;
  let upcoming: Array<{ reservation_code: string; pickup_datetime: string; status: string; regions: { name_en: string; name_tr: string } | null }> = [];

  if (customer) {
    const { data: reservations } = await admin
      .from("reservations")
      .select("reservation_code, pickup_datetime, status, regions(name_en, name_tr)")
      .eq("customer_id", customer.id)
      .order("pickup_datetime", { ascending: false });

    const all = reservations ?? [];
    totalCount = all.length;
    activeCount = all.filter(r => ["paid", "driver_assigned", "passenger_picked_up"].includes(r.status)).length;
    completedCount = all.filter(r => r.status === "completed").length;
    cancelledCount = all.filter(r => r.status === "cancelled").length;

    upcoming = all
      .filter(r => new Date(r.pickup_datetime) >= new Date() && r.status !== "cancelled" && r.status !== "completed")
      .slice(0, 3)
      .map(r => ({
        ...r,
        regions: Array.isArray(r.regions) ? r.regions[0] ?? null : r.regions,
      })) as typeof upcoming;
  }

  const regionName = (r: { name_en: string; name_tr: string } | null) =>
    r?.[`name_${locale}` as keyof typeof r] ?? r?.name_en ?? "";

  const stats = [
    { label: t.total[locale] ?? t.total.en, value: totalCount, icon: CalendarCheck, color: "text-blue-400 bg-blue-400/10" },
    { label: t.active[locale] ?? t.active.en, value: activeCount, icon: Clock, color: "text-orange-400 bg-orange-400/10" },
    { label: t.completed[locale] ?? t.completed.en, value: completedCount, icon: CheckCircle, color: "text-green-400 bg-green-400/10" },
    { label: t.cancelled[locale] ?? t.cancelled.en, value: cancelledCount, icon: XCircle, color: "text-red-400 bg-red-400/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.title[locale] ?? t.title.en}</h1>
        <p className="text-gray-400 text-sm mt-1">{t.welcome[locale] ?? t.welcome.en}, {userName}!</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={16} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming transfers */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="font-bold text-white mb-4">{t.upcoming[locale] ?? t.upcoming.en}</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500 text-sm">{t.noUpcoming[locale] ?? t.noUpcoming.en}</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((r) => (
              <div key={r.reservation_code} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-white">Antalya Airport → {regionName(r.regions)}</p>
                  <p className="text-xs text-gray-500">{new Date(r.pickup_datetime).toLocaleDateString(locale)} — {new Date(r.pickup_datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <span className="text-xs font-mono text-orange-400">{r.reservation_code}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href={`/${locale}/account/reservations`}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex items-center justify-between transition-colors"
        >
          <span className="text-sm text-gray-300">{t.viewAll[locale] ?? t.viewAll.en}</span>
          <ArrowRight size={16} className="text-gray-500" />
        </a>
        <a
          href={`/${locale}/booking`}
          className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl p-4 flex items-center justify-between transition-colors"
        >
          <span className="text-sm text-orange-400 font-medium">{t.bookNew[locale] ?? t.bookNew.en}</span>
          <ArrowRight size={16} className="text-orange-500" />
        </a>
      </div>
    </div>
  );
}
