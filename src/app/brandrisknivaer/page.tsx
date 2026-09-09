import Link from "next/link";
import { ArticlePage } from "@/components/ArticlePage";
import { pageMetadata, BRANDRISK_SOURCE } from "@/lib/seo";

export const metadata = pageMetadata("Brandrisknivåer – förstå den sammanvägda prognosen", "Så tolkar du brandrisknivån på Brandrisk.info, myndighetens råd och prognosens giltighet. Läs också vad det betyder när brandriskdata saknas.", "/brandrisknivaer");

export default function Page() {
  return <ArticlePage title="Vad betyder brandrisknivåerna?" intro="Brandrisk.info visar sammanvägd brandrisk från Brandrisk Ute. Läs nivån tillsammans med myndighetens råd för platsen och prognosens giltighetstid.">
    <section>
      <h2>En samlad bedömning av brandrisken</h2>
      <p>Den sammanvägda brandrisken tar hänsyn till skogsbrandsrisk, bränsleuttorkning i skog och gräsbrandsrisk. Enligt myndighetens beskrivning används generellt det högsta av dessa värden. Det är därför inte samma mått som enbart skogsbrandsrisk, FWI.</p>
      <p><a href={BRANDRISK_SOURCE}>Myndigheten förklarar måtten som används i Brandrisk Ute.</a></p>
    </section>
    <section>
      <h2>Så läser du skalan 1–6 i vårt resultat</h2>
      <p>Tjänsten visar källans sammanvägda nivå som en siffra från 1 till 6. Fler markerade steg betyder en högre nivå på skalan. Texten intill återger myndighetens råd när det finns tillgängligt.</p>
      <p>Vi visar benämningen ”Sammanvägd nivå” för att skilja värdet från andra brandriskindex. Siffran är inte ett besked om att eldning är tillåten. Läs också <Link href="/eldningsforbud">statusen för eldningsförbud</Link>.</p>
    </section>
    <section>
      <h2>Vilken plats och tid gäller prognosen?</h2>
      <p>Resultatet gäller punkten du har valt. Vid ortsökning kan det vara ortens centrum eller kommunens sökpunkt. Det beskriver inte hela kommunen, och lokala förhållanden kan skilja sig åt.</p>
      <p>I resultatet visas prognosperiod och utfärdandetid när källan lämnar dem. Förbudskontrollens klockslag visar när tjänsten hämtade uppgifter, inte när prognosen skapades. Prognoslistan visar upp till fem tillgängliga datum.</p>
    </section>
    <section>
      <h2>Vad betyder ett streck eller saknade data?</h2>
      <p>Ett streck betyder att tjänsten saknar en användbar nivå. Det kan bero på att uppgifter inte kunde hämtas, att nivån inte kunde tolkas eller att prognosperioden inte kunde bekräftas för idag. Det betyder inte att brandrisken är låg.</p>
      <p>Förbudsstatus hämtas separat och kan fortfarande finnas. Om också den saknas behöver du kontrollera uppgifterna hos kommunen eller länsstyrelsen.</p>
      <p><Link href="/om">Läs mer om datakällor, uppdatering och begränsningar.</Link></p>
    </section>
    <section className="article-sources">
      <h2>Källa och uppdatering</h2>
      <p><a href={BRANDRISK_SOURCE}>Myndigheten för civilt försvar: Brandrisk Ute och beskrivningen av sammanvägd brandrisk</a>. Källan kontrollerad <time dateTime="2026-09-09">9 september 2026</time>. Beskrivningen av resultatvyn avser Brandrisk.info.</p>
    </section>
  </ArticlePage>;
}
