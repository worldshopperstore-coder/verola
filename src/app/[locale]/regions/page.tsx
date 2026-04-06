import { createClient } from "@supabase/supabase-js";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Link } from "@/i18n/routing";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Locale = "tr" | "en" | "de" | "pl" | "ru";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "regions" });
  return {
    title: `${t("title")} | VELORA Transfer`,
    description: t("subtitle"),
  };
}

export default async function RegionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "regions" });
  const c = await getTranslations({ locale, namespace: "common" });

  const { data: regions } = await supabase
    .from("regions")
    .select("*, pricing(one_way_price, round_trip_price)")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, #1c1c1e 0%, #111113 100%)" }}>
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ backgroundColor: "rgba(249,115,22,0.06)" }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-4">{t("destinations")}</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-white">{t("title")}</h1>
            <p className="text-[#86868b] text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(regions ?? []).map((region: Record<string, unknown>) => {
                const name = (region[`name_${locale}`] ?? region.name_en) as string;

                return (
                  <Link
                    key={region.id as string}
                    href={`/${region.slug as string}-transfer`}
                    className="group rounded-2xl card-hover overflow-hidden"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(249,115,22,0.1)" }}>
                          <MapPin size={18} className="text-orange-400" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h2 className="font-bold text-white group-hover:text-orange-400 transition-colors">{name}</h2>
                          <p className="text-[11px] text-[#555] font-medium">{t("fromAirport")}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#86868b]">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#555]" />~{region.duration_minutes as number} {c("minutes")}
                        </span>
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
                        <span>{region.distance_km as number} {c("km")}</span>
                      </div>
                    </div>
                    <div className="px-5 py-3 text-[13px] font-medium text-[#86868b] flex items-center justify-between transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      {t("bookTransfer")}
                      <ArrowUpRight size={14} className="text-[#555] group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
