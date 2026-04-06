import { useTranslations } from "next-intl";
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
import WhatsAppButton from "@/components/WhatsAppButton";

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
      canonical: `/${locale}`,
      languages: {
        tr: "/tr",
        en: "/en",
        de: "/de",
        pl: "/pl",
        ru: "/ru",
      },
    },
  };
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustBadges />
        <StatsSection />
        <HowItWorks />
        <VehicleShowcase />
        <RegionsPreview />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
