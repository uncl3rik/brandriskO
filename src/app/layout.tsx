import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://brandrisk.info"),
  title: { default: "Brandrisk idag", template: "%s | Brandrisk" },
  description: "Se aktuell brandrisk och status för eldningsförbud på din plats i Sverige.",
  applicationName: "Brandrisk",
  alternates: { canonical: "https://brandrisk.info" },
  openGraph: {
    title: "Brandrisk idag",
    description: "Se aktuell brandrisk och status för eldningsförbud på din plats i Sverige.",
    url: "https://brandrisk.info",
    siteName: "Brandrisk",
    locale: "sv_SE",
    type: "website",
    images: [
      {
        url: "https://brandrisk.info/og.png",
        width: 1200,
        height: 630,
        alt: "Brandrisk idag",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandrisk idag",
    description: "Se aktuell brandrisk och status för eldningsförbud på din plats i Sverige.",
    images: ["https://brandrisk.info/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sv" className={`${geist.variable} ${geistMono.variable}`}><body>{children}</body></html>;
}
