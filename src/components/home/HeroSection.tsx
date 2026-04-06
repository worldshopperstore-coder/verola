"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import BookingFormMini from "@/components/booking/BookingFormMini";

export default function HeroSection() {
  const t = useTranslations("hero");
  const n = useTranslations("nav");

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #000 0%, #1d1d1f 100%)" }}>
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />

      <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left */}
          <div>
            <p className="text-orange-400 text-sm font-medium tracking-wide mb-4">
              {t("badge")}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] tracking-tight text-white mb-6">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
              {t("subtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center px-7 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
              >
                {n("bookNow")}
              </Link>
              <Link
                href="/regions"
                className="inline-flex items-center px-7 py-3 text-sm font-medium rounded-full text-blue-400 hover:text-blue-300 transition-colors"
                style={{ border: "1px solid rgba(59,130,246,0.3)" }}
              >
                {t("exploreRegions")}
              </Link>
            </div>
          </div>

          {/* Right: Booking form */}
          <div className="w-full max-w-md mx-auto lg:max-w-none">
            <BookingFormMini />
          </div>
        </div>
      </div>
    </section>
  );
}
