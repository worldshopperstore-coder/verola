import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Users,
  Luggage,
  Wifi,
  Snowflake,
  Droplets,
  Zap,
  Shield,
  Armchair,
  ArrowRight,
  Car,
} from "lucide-react";

export default function VehicleShowcase() {
  const t = useTranslations("vehicle");

  const specs = [
    { icon: Users, labelKey: "spec1", color: "#60A5FA" },
    { icon: Luggage, labelKey: "spec2", color: "#A78BFA" },
    { icon: Snowflake, labelKey: "spec3", color: "#22D3EE" },
    { icon: Wifi, labelKey: "spec4", color: "#818CF8" },
    { icon: Droplets, labelKey: "spec5", color: "#2DD4BF" },
    { icon: Zap, labelKey: "spec6", color: "#FBBF24" },
    { icon: Shield, labelKey: "spec7", color: "#34D399" },
    { icon: Armchair, labelKey: "spec8", color: "#F97316" },
  ];

  return (
    <section className="py-24 lg:py-32" style={{ backgroundColor: "#000" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Vehicle visual */}
          <div className="relative">
            <div
              className="rounded-3xl aspect-[4/3] flex items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(145deg, #1d1d1f 0%, #111 100%)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="text-center p-10">
                <div
                  className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)" }}
                >
                  <Car size={40} className="text-orange-400" strokeWidth={1.2} />
                </div>
                <p className="text-white text-2xl font-semibold tracking-tight">Mercedes Vito</p>
                <p className="text-gray-500 text-sm mt-2">{t("vipTourer")}</p>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div>
            <p className="text-orange-400 text-sm font-medium tracking-wide mb-3">{t("fleetLabel")}</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
              {t("heading")}
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-10">
              {t("subheading")}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {specs.map(({ icon: Icon, labelKey, color }) => (
                <div key={labelKey} className="flex items-center gap-3 py-2">
                  <Icon size={16} style={{ color }} strokeWidth={1.5} />
                  <span className="text-gray-300 text-sm">{t(labelKey)}</span>
                </div>
              ))}
            </div>

            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              {t("reserveTransfer")}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
