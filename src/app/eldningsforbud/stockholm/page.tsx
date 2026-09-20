import Link from "next/link";
import { ArticlePage } from "@/components/ArticlePage";
import { pageMetadata } from "@/lib/seo";

const countySource = "https://www.lansstyrelsen.se/stockholm/natur-och-landsbygd/om-eldningsforbud.html";
const citySource = "https://boende.stockholm/skydda-dig-och-ditt-hem/brandskydd-i-hemmet/";
const fireServiceSource = "https://www.storstockholm.brand.se/pa-fritiden/eldningsforbud/";

export const metadata = pageMetadata(
  "Eldningsförbud Stockholm – kontrollera vad som gäller",
  "Ska du elda eller grilla i Stockholm? Hitta aktuella besked från lokala myndigheter, förstå skillnaden mellan kommun och län och kontrollera din plats.",
  "/eldningsforbud/stockholm",
);

export default function StockholmPage() {
  return <ArticlePage
    title="Eldningsförbud i Stockholm"
    intro="Ska du elda eller grilla i Stockholms kommun? Här hittar du rätt lokala källor och hjälp att kontrollera platsen. Stockholms kommun är en del av Stockholms län; besked för länet och en enskild plats behöver läsas tillsammans."
    parent={{ href: "/eldningsforbud", label: "Eldningsförbud" }}
    actionLabel="Kontrollera din exakta plats →"
  >
    <section aria-labelledby="today-heading">
      <h2 id="today-heading">Är det eldningsförbud i Stockholm idag?</h2>
      <p>Öppna de aktuella beskeden nedan innan du eldar. Den här guiden visar inget automatiskt uppdaterat ja- eller nej-besked för hela kommunen.</p>
      <ul>
        <li><a href={countySource}>Länsstyrelsen Stockholm: aktuellt besked om eldningsförbud</a> – information om länet, beslutens omfattning och lokala avvikelser.</li>
        <li><a href={fireServiceSource}>Storstockholms brandförsvar: eldningsförbud och grillning</a> – räddningstjänstens information och svar på frågor om eldning.</li>
        <li><a href={citySource}>Stockholms stad: grilla och elda utomhus</a> – stadens vägledning och hänvisning till brandförsvaret.</li>
      </ul>
      <p>Du kan också <Link href="/">kontrollera registrerad förbudsstatus och brandrisk på din plats</Link>. Välj din position eller sök efter ort eller postnummer. Kontrollera därefter beslutets område, giltighetstid och villkor hos ansvarig myndighet.</p>
    </section>
    <section>
      <h2>Stockholms kommun eller Stockholms län?</h2>
      <p>Den här sidan riktar sig till dig som ska vistas i Stockholms kommun. Länsstyrelsens information gäller ett större område och kan behöva kompletteras med kommunala beslut. Kontrollera därför alltid vilket område ett besked omfattar.</p>
      <p>Söker du efter Stockholm i vårt verktyg gäller resultatet den valda sökpunkten. Det är inte en kontroll av varje del av kommunen eller länet. Om du ska vidare till en annan plats, välj den platsen i stället.</p>
    </section>
    <section>
      <h2>Avrådan från eldning är också viktig information</h2>
      <p>Länsstyrelsen Stockholm beskriver att räddningstjänsten kan avråda från eldning även när inget eldningsförbud råder. Läs därför också räddningstjänstens rekommendationer.</p>
      <p>Vårt verktyg visar registrerad förbudsstatus och riskprognos separat. Det har ingen separat status för lokala avrådanden. Texten ”Inget eldningsförbud registrerat” ska därför inte läsas som ett klartecken att elda.</p>
    </section>
    <section>
      <h2>Får man grilla i Stockholm?</h2>
      <p>Stockholms stad hänvisar till Storstockholms brandförsvar för frågor om eldningsförbud. Kontrollera både aktuellt beslut och reglerna för den plats där du vill grilla, oavsett om det är en park, trädgård eller plats i skogen.</p>
      <p>Länsstyrelsens vägledning skiljer mellan sammanhållen bebyggelse och övrig skog och mark. Den skiljer också mellan vanligt och skärpt eldningsförbud: fasta grillplatser kan omfattas när förbudet skärps. Läs det aktuella beslutet innan du använder en grillplats.</p>
      <p><Link href="/eldningsforbud#egen-tomt">Läs den allmänna vägledningen om egen tomt</Link> eller <Link href="/eldningsforbud#friluftskok">gasolgrill och stormkök</Link>. De förklaringarna ersätter inte lokala villkor.</p>
    </section>
    <section>
      <h2>Brandrisk i Stockholm är en separat uppgift</h2>
      <p>Vill du se temperatur, luftfuktighet och vind inför utflykten? <Link href="/">Välj plats i verktyget</Link> så visas en väderprognos nära din sökpunkt tillsammans med resultatet. Ingen prognos för centrala Stockholm väljs automatiskt här.</p>
      <p>En <Link href="/brandrisknivaer">brandrisknivå beskriver prognosen</Link>, inte vilka aktiviteter ett beslut förbjuder. Vårt verktyg hämtar båda uppgifterna för punkten du väljer och visar när kontrollen gjordes. Om data saknas behöver du gå direkt till de lokala källorna ovan.</p>
      <p><Link href="/om">Så fungerar tjänsten och datakällorna</Link>.</p>
    </section>
    <section className="article-sources">
      <h2>Källor och granskning</h2>
      <p>Vägledningen bygger på <a href={countySource}>Länsstyrelsen Stockholm</a>, <a href={citySource}>Stockholms stad</a> och <a href={fireServiceSource}>Storstockholms brandförsvar</a>. Källorna kontrollerades <time dateTime="2026-09-20">20 september 2026</time>. Datumet avser granskning av guiden, inte en kontroll av dagens förbudsstatus.</p>
    </section>
  </ArticlePage>;
}
