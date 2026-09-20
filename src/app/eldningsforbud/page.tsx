import Link from "next/link";
import { ArticlePage } from "@/components/ArticlePage";
import { pageMetadata, PROHIBITION_SOURCE, BRANDRISK_SOURCE } from "@/lib/seo";

export const metadata = pageMetadata("Eldningsförbud – regler för grillning och eldning", "Vad gäller vid eldningsförbud? Läs om egen tomt, fasta grillplatser, gasolgrill och stormkök. Kontrollera din plats och det lokala beslutet.", "/eldningsforbud");

export default function Page() {
  return <ArticlePage title="Eldningsförbud – vad gäller?" intro="Kontrollera både förbudsstatus och det lokala beslutet. Kommunen eller länsstyrelsen beslutar om eldningsförbud och vilka områden det gäller.">
    <nav aria-label="Frågor på den här sidan">
      <ul>
        <li><a href="#grilla">Grillning vid eldningsförbud</a></li>
        <li><a href="#egen-tomt">Grilla på egen tomt</a></li>
        <li><a href="#friluftskok">Gasolgrill och stormkök</a></li>
        <li><a href="#skarpt-forbud">Skärpt eldningsförbud</a></li>
      </ul>
    </nav>
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
    <section id="grilla">
      <h2>Får man grilla vid eldningsförbud?</h2>
      <p>Vanligtvis är eldning med ved eller kol i skog och mark förbjuden. En fast grillplats kan vara undantagen, men är inte automatiskt tillåten. Läs beslutet för platsen innan du tänder grillen.</p>
      <p><a href={PROHIBITION_SOURCE}>Läs myndighetens frågor och svar om eldningsförbud och grillning.</a></p>
    </section>
    <section id="egen-tomt">
      <h2>Får man grilla på egen tomt?</h2>
      <p>Grillning i en trädgård inom sammanhållen bebyggelse är normalt tillåten enligt myndighetens vägledning. För ett hus ensamt i skogen eller en naturcamping behöver du kontrollera områdets villkor särskilt. Eldning sker alltid under eget ansvar.</p>
    </section>
    <section id="friluftskok">
      <h2>Gäller eldningsförbud för gasolgrill och stormkök?</h2>
      <p>Matlagning med gas eller flytande bränsle kan vara tillåten, men utrustningen ger inget generellt undantag. Kontrollera om beslutet omfattar din gasolgrill eller ditt friluftskök och vilka villkor som gäller där du ska använda det.</p>
    </section>
    <section id="skarpt-forbud">
      <h2>Vad gäller vid skärpt eldningsförbud?</h2>
      <p>Vid extrem brandrisk kan fler aktiviteter omfattas av förbud. Läs det aktuella beslutet på nytt; utgå inte från tidigare undantag för grillplatser eller matlagning.</p>
      <p><Link href="/">Kontrollera registrerad förbudsstatus för din plats</Link> och följ länken till ansvarig myndighet när den finns i resultatet.</p>
    </section>
    <section>
      <h2>Är hög brandrisk samma sak som eldningsförbud?</h2>
      <p>Nej. <Link href="/brandrisknivaer">Brandrisknivån är en prognos</Link>, medan förbudsstatus bygger på registrerade beslut. I vårt resultat visas de separat. En låg nivå upphäver inte ett förbud.</p>
      <p><Link href="/om">Läs hur vi hämtar och visar uppgifterna.</Link></p>
    </section>
    <section>
      <h2>Lokala beslut i Stockholm</h2>
      <p>Ska du elda eller grilla i Stockholms kommun? I vår guide om <Link href="/eldningsforbud/stockholm">eldningsförbud i Stockholm</Link> hittar du lokala beslutskällor och skillnaden mellan besked för kommunen, länet och din sökpunkt.</p>
    </section>
    <section className="article-sources">
      <h2>Källor</h2>
      <p><a href={PROHIBITION_SOURCE}>Myndigheten för civilt försvar: Eldningsförbud</a>, kontrollerad <time dateTime="2026-09-20">20 september 2026</time>. Uppgifter om tjänstens datakälla: <a href={BRANDRISK_SOURCE}>Brandrisk Ute</a>, kontrollerad 9 september 2026. Aktuell lokal status kontrolleras i platsverktyget.</p>
    </section>
  </ArticlePage>;
}
