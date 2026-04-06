import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWizard from "@/components/booking/BookingWizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return {
    title: `${t("title")} | VELORA Transfer`,
    description: t("subtitle"),
  };
}

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1" style={{ backgroundColor: "#111113" }}>
        <BookingWizard
          initialRegion={sp.region}
          initialTrip={(sp.trip as "one_way" | "round_trip") ?? "one_way"}
          initialDate={sp.date}
          initialTime={sp.time}
          initialReturnDate={sp.returnDate}
          initialReturnTime={sp.returnTime}
          initialFlight={sp.flight}
          initialAdults={sp.adults ? parseInt(sp.adults) : 2}
          initialChildren={sp.children ? parseInt(sp.children) : 0}
          initialLuggage={sp.luggage ? parseInt(sp.luggage) : 2}
        />
      </main>
      <Footer />
    </>
  );
}
