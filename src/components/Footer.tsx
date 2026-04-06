import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#000", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Company */}
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-4">{t("company")}</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: t("about") },
                { href: "/contact", label: t("contact") },
                { href: "/blog", label: t("blog") },
                { href: "/faq", label: t("faq") },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-500 hover:text-white text-xs transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-4">{t("destinations")}</h4>
            <ul className="space-y-2.5">
              {["Belek", "Side", "Alanya", "Kemer", "Kaş"].map((name) => (
                <li key={name}>
                  <Link href={`/regions/${name.toLowerCase()}`} className="text-gray-500 hover:text-white text-xs transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-4">{t("legal")}</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/privacy", label: t("privacy") },
                { href: "/terms", label: t("terms") },
                { href: "/cookies", label: t("cookies") },
                { href: "/cancellation", label: t("cancellation") },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-500 hover:text-white text-xs transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-4">{t("support")}</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:info@veloratransfer.com" className="flex items-center gap-2 text-gray-500 hover:text-white text-xs transition-colors">
                  <Mail size={12} />
                  info@veloratransfer.com
                </a>
              </li>
              <li className="pt-1">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "905431451548"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-xs transition-colors"
                >
                  <MessageCircle size={12} />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-gray-600 text-xs">
            © {currentYear} VELORA Transfer. {t("allRightsReserved")}
          </p>
          <p className="text-gray-600 text-xs">Antalya, Türkiye</p>
        </div>
      </div>
    </footer>
  );
}
