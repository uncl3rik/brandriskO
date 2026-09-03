import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://brandrisk.info"),
  title: { default: "Brandrisk idag – Eldningsförbud och brandrisk", template: "%s | Brandrisk" },
  description: "Se aktuell brandrisk och status för eldningsförbud på din plats i Sverige.",
  applicationName: "Brandrisk",
  openGraph: {
    title: "Brandrisk idag",
    description: "Se aktuell brandrisk och status för eldningsförbud på din plats i Sverige.",
    locale: "sv_SE",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sv" className={`${geist.variable} ${geistMono.variable}`}><body>{children}</body></html>;
}
