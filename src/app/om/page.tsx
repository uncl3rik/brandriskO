import Link from "next/link";
import { ArticlePage } from "@/components/ArticlePage";
import { pageMetadata, BRANDRISK_SOURCE } from "@/lib/seo";

export const metadata = pageMetadata("Om Brandrisk.info – datakällor och ansvar", "Läs om Brandrisk.info, byggt av KEZAB, och hur tjänsten visar brandrisk, registrerade eldningsförbud och prognoser från Brandrisk Ute.", "/om");

export default function Page() {
  return <ArticlePage title="Om Brandrisk.info" intro="Brandrisk.info är byggt av KEZAB för att göra det enkelt att kontrollera brandrisk och registrerade eldningsförbud på en vald plats i Sverige.">
    <section>
      <h2>Om tjänsten och ansvaret</h2>
      <p>Webbplatsen använder myndighetsdata men är inte en myndighetswebbplats. Informationen är ett stöd inför eldning utomhus och ersätter inte ansvarig myndighets beslut eller din bedömning av förhållandena på plats.</p>
      <p>Börja med att <Link href="/">välja plats</Link>. Resultatet visar riskprognos och förbudsstatus var för sig, med en länk till ansvarig myndighet när datakällan tillhandahåller den.</p>
    </section>
    <section>
      <h2>Varifrån kommer uppgifterna?</h2>
      <p>Brandrisk, prognos och registrerade förbud hämtas från <a href={BRANDRISK_SOURCE}>Brandrisk Ute hos Myndigheten för civilt försvar</a>. Tjänsten visar sammanvägd brandrisk och de råd som källan lämnar.</p>
      <p>Orts- och postnummersökningen använder OpenStreetMap-data genom en Nominatim-kompatibel söktjänst. <a href="https://www.openstreetmap.org/copyright">© OpenStreetMaps bidragsgivare</a>. Vid flera sökträffar får du välja vilken plats du menar.</p>
    </section>
    <section>
      <h2>Hur aktuella är resultaten?</h2>
      <p>Aktuell risk och förbudsstatus hämtas på nytt när en plats kontrolleras. Dagsprognoser och nivåbeskrivningar kan återanvändas i upp till tio minuter. Ett öppet resultat uppdateras efter fem minuter när fliken är synlig.</p>
      <p>Kontrolltiden anger när tjänsten hämtade uppgifterna. Prognosens utfärdandetid och period visas separat när de finns. En ny kontroll innebär inte att myndigheten har utfärdat en ny prognos.</p>
    </section>
    <section>
      <h2>Begränsningar att känna till</h2>
      <p>En orts- eller kommunsökning gäller en sökpunkt. Brandrisk kan variera inom området. Saknade eller obekräftade data visas som saknade, inte som låg risk eller ett klartecken att elda.</p>
      <p>För frågor om ett lokalt förbud, dess omfattning eller giltighet kontaktar du kommunen eller länsstyrelsen. Följ beslutskällan i resultatet när den finns.</p>
      <ul>
        <li><Link href="/eldningsforbud">Så tolkar du eldningsförbud och hittar rätt beslut</Link></li>
        <li><Link href="/brandrisknivaer">Så läser du den sammanvägda brandrisknivån</Link></li>
      </ul>
    </section>
  </ArticlePage>;
}
