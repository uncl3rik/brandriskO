import Link from "next/link";
import { ArticlePage } from "@/components/ArticlePage";
import { pageMetadata, PROHIBITION_SOURCE, BRANDRISK_SOURCE } from "@/lib/seo";

export const metadata = pageMetadata("Eldningsförbud – vad gäller där du är?", "Förstå registrerat eldningsförbud, skärpt förbud och skillnaden mot brandrisk. Hitta rätt lokalt beslut innan du eldar eller grillar.", "/eldningsforbud");

export default function Page() {
  return <ArticlePage title="Eldningsförbud – vad gäller?" intro="Kontrollera både förbudsstatus och det lokala beslutet. Kommunen eller länsstyrelsen beslutar om eldningsförbud och vilka områden det gäller.">
    <section>
      <h2>Så kontrollerar du eldningsförbud idag</h2>
      <ol>
        <li><Link href="/">Välj din plats</Link> och läs den registrerade förbudsstatusen.</li>
        <li>Öppna länken till ansvarig myndighet när den finns i resultatet. Annars går du till kommunens eller länsstyrelsens webbplats.</li>
        <li>Läs beslutets område, giltighet och villkor för det du tänker göra.</li>
      </ol>
    </section>
    <section>
      <h2>Vad betyder statusen i tjänsten?</h2>
      <dl className="article-definitions">
        <dt>Inget eldningsförbud registrerat</dt><dd>Datakällan anger inget förbud för punkten. Det är inget generellt tillstånd att elda.</dd>
        <dt>Eldningsförbud</dt><dd>Ett förbud är registrerat. Läs beslutet för exakt omfattning.</dd>
        <dt>Skärpt eldningsförbud</dt><dd>Källan anger ett skärpt förbud. Utgå inte från att tidigare undantag fortfarande gäller; kontrollera beslutets villkor.</dd>
        <dt>Status för eldningsförbud saknas</dt><dd>Tjänsten har inte kunnat bekräfta uppgiften. Kontrollera direkt hos ansvarig myndighet.</dd>
      </dl>
    </section>
    <section>
      <h2>Får jag grilla eller använda friluftskök?</h2>
      <p>Det beror på platsen och beslutets villkor. Fasta grillplatser, trädgårdar och friluftskök kan omfattas på olika sätt. Kontrollera vad som gäller för din utrustning och plats; tillåten eldning sker också under eget ansvar.</p>
      <p><a href={PROHIBITION_SOURCE}>Läs myndighetens frågor och svar om eldningsförbud och grillning.</a></p>
    </section>
    <section>
      <h2>Är hög brandrisk samma sak som eldningsförbud?</h2>
      <p>Nej. <Link href="/brandrisknivaer">Brandrisknivån är en prognos</Link>, medan förbudsstatus bygger på registrerade beslut. I vårt resultat visas de separat. En låg nivå upphäver inte ett förbud.</p>
      <p><Link href="/om">Läs hur vi hämtar och visar uppgifterna.</Link></p>
    </section>
    <section className="article-sources">
      <h2>Källor</h2>
      <p><a href={PROHIBITION_SOURCE}>Myndigheten för civilt försvar: Eldningsförbud</a> och <a href={BRANDRISK_SOURCE}>Brandrisk Ute</a>. Källor kontrollerade <time dateTime="2026-09-09">9 september 2026</time>. Aktuell lokal status kontrolleras i platsverktyget.</p>
    </section>
  </ArticlePage>;
}
