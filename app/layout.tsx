import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono, IBM_Plex_Serif, Instrument_Serif, Playfair_Display } from "next/font/google";
import Nav from "@/components/Nav";
import PrModal from "@/components/PrModal";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SiteFx from "@/components/SiteFx";
import { SITE_URL } from "@/lib/site";
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

/* The Draft's newsroom typography: mono chrome, serif body, serif pull-quotes. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const title = "StoryBizz — Become impossible to ignore";
const description =
  "The media visibility partner. We put your story where people decide who to trust — media, Google, podcasts, magazines and social feeds.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s" },
  description,
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "StoryBizz",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-anim="rich">
      <body className={`${hanken.variable} ${playfair.variable} ${plexMono.variable} ${plexSerif.variable} ${instrumentSerif.variable}`}>
        <Nav />
        {children}
        <PrModal />
        <WhatsAppFloat />
        <SiteFx />
      </body>
    </html>
  );
}
