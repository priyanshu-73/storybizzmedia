import type { Metadata } from "next";
import { Hanken_Grotesk, Playfair_Display } from "next/font/google";
import Nav from "@/components/Nav";
import PrModal from "@/components/PrModal";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SiteFx from "@/components/SiteFx";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "StoryBizz — Become impossible to ignore",
  description:
    "The media visibility partner. We put your story where people decide who to trust — media, Google, podcasts, magazines and social feeds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-anim="rich">
      <body className={`${hanken.variable} ${playfair.variable}`}>
        <Nav />
        {children}
        <PrModal />
        <WhatsAppFloat />
        <SiteFx />
      </body>
    </html>
  );
}
