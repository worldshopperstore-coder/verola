import { createClient } from "@supabase/supabase-js";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Link } from "@/i18n/routing";
import {
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Star,
  Users,
  Plane,
  CreditCard,
  CheckCircle,
  Zap,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Locale = "tr" | "en" | "de" | "pl" | "ru";

export async function generateStaticParams() {
  const { data: regions } = await supabase
    .from("regions")
    .select("slug")
    .eq("is_active", true);

  const locales: Locale[] = ["tr", "en", "de", "pl", "ru"];
  const params: { locale: string; region: string }[] = [];

  for (const locale of locales) {
    for (const region of regions ?? []) {
      params.push({ locale, region: `${region.slug}-transfer` });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; region: string }>;
}): Promise<Metadata> {
  const { locale, region: regionParam } = await params;
  const slug = regionParam.replace("-transfer", "");

  const { data: region } = await supabase
    .from("regions")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!region) return {};

  const name = region[`name_${locale}`] || region.name_en;
  const metaTitle =
    region[`meta_title_${locale}`] ||
    `${name} Transfer | VELORA Antalya Airport VIP Transfer`;
  const metaDesc =
    region[`meta_description_${locale}`] ||
    `VIP private transfer from Antalya Airport to ${name}. Fixed price, professional drivers, 24/7 service.`;

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: `/${locale}/${slug}-transfer`,
      languages: {
        tr: `/tr/${slug}-transfer`,
        en: `/en/${slug}-transfer`,
        de: `/de/${slug}-transfer`,
        pl: `/pl/${slug}-transfer`,
        ru: `/ru/${slug}-transfer`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      type: "website",
      siteName: "VELORA Transfer",
    },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ locale: string; region: string }>;
}) {
  const { locale, region: regionParam } = await params;
  const slug = regionParam.replace("-transfer", "");
  const t = await getTranslations({ locale, namespace: "regionDetail" });
  const bt = await getTranslations({ locale, namespace: "booking" });
  const nt = await getTranslations({ locale, namespace: "nav" });

  const { data: region } = await supabase
    .from("regions")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!region) notFound();

  // Fetch pricing
  const { data: pricing } = await supabase
    .from("pricing")
    .select("one_way_price, round_trip_price")
    .eq("region_id", region.id)
    .single();

  // Fetch reviews for this region
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating, comment, created_at, customers(first_name)")
    .eq("is_approved", true)
    .limit(6);

  const name = region[`name_${locale as Locale}`] || region.name_en;
  const description =
    region[`description_${locale as Locale}`] || region.description_en;

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `VELORA ${name} Transfer`,
    description: t("defaultDesc", { name }),
    provider: {
      "@type": "Organization",
      name: "VELORA Transfer",
      url: "https://veloratransfer.com",
    },
    areaServed: {
      "@type": "Place",
      name: name,
    },
    offers: pricing
      ? {
          "@type": "Offer",
          price: pricing.one_way_price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

        {/* Hero */}
        <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #1c1c1e 0%, #111113 100%)" }}>
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ backgroundColor: "rgba(249,115,22,0.06)" }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-[#555] mb-6">
              <Link href="/" className="hover:text-white transition-colors">{t("home")}</Link>
              <span>/</span>
              <Link href="/regions" className="hover:text-white transition-colors">{nt("regions")}</Link>
              <span>/</span>
              <span className="text-white">{name}</span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-5 tracking-tight text-white">
                {t("airportTo", { name })}
              </h1>
              <p className="text-lg text-[#86868b] mb-8 leading-relaxed">
                {description || t("defaultDesc", { name })}
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Clock size={16} className="text-orange-400" strokeWidth={1.5} />
                  <span className="text-sm text-white">~{region.duration_minutes} {t("min")}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <MapPin size={16} className="text-orange-400" strokeWidth={1.5} />
                  <span className="text-sm text-white">{region.distance_km} km</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose + CTA */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">{t("whyChoose")}</h2>
                <div className="space-y-3">
                  {[
                    { icon: Shield, title: t("fixedPriceTitle"), desc: t("fixedPriceDesc") },
                    { icon: Users, title: t("proDriversTitle"), desc: t("proDriversDesc") },
                    { icon: Plane, title: t("flightTrackTitle"), desc: t("flightTrackDesc") },
                    { icon: CreditCard, title: t("securePayTitle"), desc: t("securePayDesc") },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-4 p-5 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(249,115,22,0.1)" }}>
                        <Icon size={18} className="text-orange-400" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
                        <p className="text-[#86868b] text-sm leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book CTA Card */}
              <div className="rounded-2xl p-8" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
                  {t("bookYourTransfer", { name })}
                </h2>
                <p className="text-[#86868b] mb-8 leading-relaxed">
                  {t("bookDesc")}
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    t("driveFromAirport", { duration: region.duration_minutes }),
                    t("mercedesVito"),
                    t("freeFlightMonitoring"),
                    t("freeCancellation"),
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-sm text-[#86868b]">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/booking?region=${slug}`}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  {bt("title")} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Features */}
        <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">{t("vehicleHeading")}</h2>
            <div className="grid sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: t("specPassengers"), icon: Users },
                { label: t("specWifi"), icon: Zap },
                { label: t("specClimate"), icon: Shield },
                { label: t("specLeather"), icon: Star },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-xl p-5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(249,115,22,0.1)" }}>
                    <Icon size={18} className="text-orange-400" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-medium text-[#86868b]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-white mb-8 text-center tracking-tight">{t("customerReviews")}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review: Record<string, unknown>, i: number) => {
                  const cust = review.customers as Record<string, string> | null;
                  return (
                    <div key={i} className="rounded-xl p-5" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={14} className={j < (review.rating as number) ? "text-amber-400 fill-amber-400" : "text-[#333]"} />
                        ))}
                      </div>
                      {typeof review.comment === "string" && review.comment && (
                        <p className="text-sm text-[#86868b] mb-2">&ldquo;{review.comment}&rdquo;</p>
                      )}
                      <p className="text-xs text-[#555]">{cust?.first_name ?? t("guest")}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8 text-center tracking-tight">{t("faqHeading", { name })}</h2>
            <div className="space-y-3">
              {[
                { q: t("faqQ1", { name }), a: t("faqA1", { name, duration: region.duration_minutes, distance: region.distance_km }) },
                { q: t("faqQ2", { name }), a: t("faqA2") },
                { q: t("faqQ3", { name }), a: t("faqA3") },
                { q: t("faqQ4"), a: t("faqA4") },
              ].map(({ q, a }) => (
                <details key={q} className="rounded-xl overflow-hidden group" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <summary className="px-5 py-4 cursor-pointer font-medium text-white text-sm flex items-center justify-between">
                    {q}
                    <span className="text-[#555] group-open:rotate-180 transition-transform">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#86868b]" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>{a}</div>
                </details>
              ))}
            </div>

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org", "@type": "FAQPage",
              mainEntity: [
                { "@type": "Question", name: t("faqQ1", { name }), acceptedAnswer: { "@type": "Answer", text: t("faqA1", { name, duration: region.duration_minutes, distance: region.distance_km }) } },
                { "@type": "Question", name: t("faqQ2", { name }), acceptedAnswer: { "@type": "Answer", text: t("faqA2") } },
              ],
            }) }} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">{t("readyToBook", { name })}</h2>
            <p className="text-[#86868b] mb-8">{t("readyDesc")}</p>
            <Link
              href={`/booking?region=${slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20"
            >
              {t("bookNow")} <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
