import Link from "next/link";

export function HomeIntro() {
  return <div className="content home-intro">
    <section aria-labelledby="check-heading">
      <p className="article-kicker">Inför eldning utomhus</p>
      <h2 id="check-heading">Brandrisk idag på din plats i Sverige</h2>
      <p>Välj din position eller sök efter en ort eller ett postnummer. Du får aktuell brandrisk, registrerad förbudsstatus och tillgänglig prognos för de närmaste dagarna, med uppgifter från Brandrisk Ute.</p>
      <p>En ortsökning gäller en sökpunkt, vanligtvis ortens centrum. Resultatet beskriver inte automatiskt hela orten eller kommunen. Använd din position när du vill kontrollera platsen där du befinner dig.</p>
    </section>
    <div className="guide-grid">
      <section className="guide-card">
        <h2>Finns det ett eldningsförbud?</h2>
        <p>Förbudsstatus och brandrisk är olika uppgifter. Läs det lokala beslutet för att se vilka områden och aktiviteter som omfattas.</p>
        <Link href="/eldningsforbud">Förstå eldningsförbudet →</Link>
      </section>
      <section className="guide-card">
        <h2>Vad betyder risknivån?</h2>
        <p>Den sammanvägda nivån hjälper dig att tolka brandrisken. Läs den tillsammans med myndighetens råd och prognosens giltighetstid.</p>
        <Link href="/brandrisknivaer">Förstå brandrisknivåerna →</Link>
      </section>
    </div>
    <section className="safety" aria-labelledby="home-safety">
      <h2 id="home-safety">Inget registrerat förbud är inget generellt tillstånd</h2>
      <p>Kontrollera aktuella beslut hos kommunen eller länsstyrelsen innan du eldar. Om uppgifter saknas visar tjänsten det, i stället för att ange att risken är låg eller att eldning är tillåten.</p>
      <Link className="source-link" href="/om">Så fungerar tjänsten och datakällorna</Link>
    </section>
  </div>;
}
