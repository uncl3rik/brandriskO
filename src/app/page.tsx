import { BrandriskApp } from "@/components/BrandriskApp";
import { HomeIntro } from "@/components/HomeIntro";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Brandrisk idag – kontrollera brandrisk och eldningsförbud",
  "Kontrollera aktuell brandrisk och registrerade eldningsförbud på din plats i Sverige. Sök ort eller postnummer och se tillgänglig prognos.",
  "/",
);

export default function Home() {
  return <BrandriskApp><HomeIntro /></BrandriskApp>;
}
