import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustBadges from "@/components/home/TrustBadges";
import StatsSection from "@/components/home/StatsSection";
import RegionsPreview from "@/components/home/RegionsPreview";
import HowItWorks from "@/components/home/HowItWorks";
import VehicleShowcase from "@/components/home/VehicleShowcase";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import BlogPreview from "@/components/home/BlogPreview";
import HomeFAQ from "@/components/home/HomeFAQ";
import LocalSeoBlock from "@/components/home/LocalSeoBlock";
import WhatsAppButton from "@/components/WhatsAppButton";

const BASE_URL = "https://veloratransfer.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        tr: `${BASE_URL}/tr`,
        en: `${BASE_URL}/en`,
        de: `${BASE_URL}/de`,
        pl: `${BASE_URL}/pl`,
        ru: `${BASE_URL}/ru`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}`,
      siteName: "VELORA Transfer",
      type: "website",
      locale: locale === "tr" ? "tr_TR" : locale === "de" ? "de_DE" : locale === "pl" ? "pl_PL" : locale === "ru" ? "ru_RU" : "en_US",
      images: [{ url: `${BASE_URL}/images/og-default.jpg`, width: 1200, height: 630, alt: "VELORA Transfer - Antalya Airport VIP Transfer" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${BASE_URL}/images/og-default.jpg`],
    },
    keywords: locale === "tr"
      ? "antalya havalimanı transfer, antalya vip transfer, havalimanı transfer, antalya özel transfer, belek transfer, side transfer, alanya transfer, kemer transfer"
      : locale === "de"
      ? "Antalya Flughafen Transfer, VIP Transfer Antalya, Flughafen Transfer, Belek Transfer, Side Transfer"
      : locale === "ru"
      ? "трансфер из аэропорта Анталии, VIP трансфер Анталия, трансфер Белек, трансфер Сиде"
      : "antalya airport transfer, antalya vip transfer, airport transfer antalya, belek transfer, side transfer, alanya transfer, kemer transfer",
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // JSON-LD Structured Data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VELORA Transfer",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description: "Antalya Airport VIP Transfer Service",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Antalya",
      addressRegion: "Antalya",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-543-145-15-48",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English", "German", "Russian", "Polish"],
    },
    sameAs: [
      "https://instagram.com/veloratransfer",
      "https://facebook.com/veloratransfer",
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "VELORA Transfer",
    image: `${BASE_URL}/images/og-default.jpg`,
    url: BASE_URL,
    telephone: "+90-543-145-15-48",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Antalya Havalimanı",
      addressLocality: "Antalya",
      addressRegion: "Antalya",
      postalCode: "07230",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 36.8987,
      longitude: 30.8005,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1250",
      bestRating: "5",
    },
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VELORA Transfer",
    url: BASE_URL,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/{locale}/regions`,
      "query-input": "required name=search_term_string",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Antalya Airport VIP Transfer",
    provider: {
      "@type": "Organization",
      name: "VELORA Transfer",
    },
    areaServed: {
      "@type": "Place",
      name: "Antalya, Turkey",
    },
    serviceType: "Airport Transfer",
    description: "Premium VIP transfer service from Antalya Airport to all resort destinations including Belek, Side, Alanya, Kemer, and more.",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "35",
      highPrice: "180",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustBadges />
        <HowItWorks />
        <RegionsPreview />
        <VehicleShowcase />
        <StatsSection />
        <TestimonialsSection />
        <HomeFAQ />
        <CTASection />
        <BlogPreview locale={locale} />
        <LocalSeoBlock />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
