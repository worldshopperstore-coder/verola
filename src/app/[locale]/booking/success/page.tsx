import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Phone, Mail } from "lucide-react";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const code = sp.code ?? "—";
  const t = await getTranslations("bookingSuccess");

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#111113]">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            {t("description")}
          </p>

          {/* Reservation code */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">{t("reservationCode")}</p>
            <p className="text-3xl font-bold text-white tracking-wider">
              {code}
            </p>
            <p className="text-xs text-gray-500 mt-3">
              {t("saveCode")}
            </p>
          </div>

          {/* What happens next */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 text-left">
            <h2 className="font-bold text-white mb-4">
              {t("whatNext")}
            </h2>
            <ol className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                {t("step1")}
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                {t("step2")}
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                {t("step3")}
              </li>
            </ol>
          </div>

          {/* Contact */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "905431451548"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-medium rounded-lg hover:bg-[#20BD5A] transition-colors"
            >
              <Phone size={16} />
              {t("whatsappSupport")}
            </a>
            <a
              href="mailto:info@veloratransfer.com"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 font-medium rounded-lg hover:bg-white/5 transition-colors text-gray-300"
            >
              <Mail size={16} />
              {t("emailSupport")}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
