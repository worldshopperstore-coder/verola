const BASE_URL = "https://veloratransfer.com";
const locales = ["tr", "en", "de", "pl", "ru"] as const;

export function seoAlternates(locale: string, path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return {
    canonical: `${BASE_URL}/${locale}${cleanPath}`,
    languages: Object.fromEntries(
      locales.map((l) => [l, `${BASE_URL}/${l}${cleanPath}`])
    ),
  };
}

export function seoOpenGraph(
  locale: string,
  path: string,
  title: string,
  description: string,
  image?: string
) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return {
    title,
    description,
    url: `${BASE_URL}/${locale}${cleanPath}`,
    siteName: "VELORA Transfer",
    type: "website" as const,
    locale:
      locale === "tr"
        ? "tr_TR"
        : locale === "de"
        ? "de_DE"
        : locale === "pl"
        ? "pl_PL"
        : locale === "ru"
        ? "ru_RU"
        : "en_US",
    images: [
      {
        url: image || `${BASE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  };
}
