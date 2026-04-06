import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return {
    title: `${t("heading")} | VELORA Transfer`,
    description: t("subtitle"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

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

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact info */}
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-white tracking-tight">{t("getInTouch")}</h2>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/905431451548"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl transition-colors"
                    style={{ backgroundColor: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(52,211,153,0.15)" }}>
                      <MessageCircle size={20} className="text-emerald-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-bold text-white">{t("whatsapp")}</p>
                      <p className="text-sm text-[#86868b]">{t("whatsappDesc")}</p>
                    </div>
                  </a>

                  {[
                    { icon: Mail, titleKey: "emailLabel", descKey: "emailDesc", color: "rgba(129,140,248" },
                    { icon: Phone, titleKey: "phoneLabel", descKey: "phoneDesc", color: "rgba(196,181,253" },
                    { icon: MapPin, titleKey: "locationLabel", descKey: "locationDesc", color: "rgba(249,115,22" },
                  ].map(({ icon: Icon, titleKey, descKey, color }) => (
                    <div key={titleKey} className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: `${color},0.06)`, border: `1px solid ${color},0.12)` }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color},0.12)` }}>
                        <Icon size={20} style={{ color: `${color},1)` }} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{t(titleKey)}</p>
                        <p className="text-sm text-[#86868b]">{t(descKey)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact form */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">{t("sendMessage")}</h2>
                <ContactForm />
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
