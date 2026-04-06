import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VELORA Transfer",
  description: "Antalya Airport VIP Transfer Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
