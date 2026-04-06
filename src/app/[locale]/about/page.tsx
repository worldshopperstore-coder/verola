import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Shield, Users, Star, CheckCircle, Zap, Globe } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: `${t("heading")} | VELORA Transfer`,
    description: t("subtitle"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, #1c1c1e 0%, #111113 100%)" }}>
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ backgroundColor: "rgba(249,115,22,0.06)" }} />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-4">{t("title")}</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-5 tracking-tight text-white">{t("heading")}</h1>
            <p className="text-[#86868b] text-lg max-w-xl mx-auto">{t("subtitle")}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-5">
              <p className="text-[#86868b] text-lg leading-relaxed">{t("paragraph1")}</p>
              <p className="text-[#86868b] text-lg leading-relaxed">{t("paragraph2")}</p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-5 mt-14">
              {[
                { icon: Shield, value: "500+", labelKey: "statTransfers" },
                { icon: Star, value: "4.9", labelKey: "statRating" },
                { icon: Users, value: "24/7", labelKey: "statSupport" },
              ].map(({ icon: Icon, value, labelKey }) => (
                <div key={labelKey} className="text-center p-8 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(249,115,22,0.1)" }}>
                    <Icon size={22} className="text-orange-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                  <p className="text-sm text-[#86868b] mt-1 font-medium">{t(labelKey)}</p>
                </div>
              ))}
            </div>

            {/* Why Choose Us */}
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">{t("whyChoose")}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: CheckCircle, titleKey: "feature1Title", descKey: "feature1Desc" },
                  { icon: Zap, titleKey: "feature2Title", descKey: "feature2Desc" },
                  { icon: Globe, titleKey: "feature3Title", descKey: "feature3Desc" },
                  { icon: Shield, titleKey: "feature4Title", descKey: "feature4Desc" },
                ].map(({ icon: Icon, titleKey, descKey }) => (
                  <div key={titleKey} className="flex items-start gap-4 p-5 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(249,115,22,0.1)" }}>
                      <Icon size={18} className="text-orange-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">{t(titleKey)}</h3>
                      <p className="text-[#86868b] text-sm leading-relaxed">{t(descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
