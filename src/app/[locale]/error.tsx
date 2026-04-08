"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <main
      className="flex-1 flex items-center justify-center"
      style={{ backgroundColor: "#111113", minHeight: "100vh" }}
    >
      <div className="text-center px-4">
        <p
          className="text-7xl font-extrabold mb-4"
          style={{
            background: "linear-gradient(135deg, #F97316, #EF4444)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          500
        </p>
        <h1 className="text-2xl font-semibold text-white mb-2">{t("title")}</h1>
        <p className="text-[#86868b] mb-8">{t("description")}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
          >
            {t("tryAgain")}
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-white/10 text-gray-300 hover:bg-white/5 font-medium rounded-xl transition-colors"
          >
            {t("goHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
