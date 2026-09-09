import Link from "next/link";
import type { ReactNode } from "react";

export function ArticlePage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <main id="main-content" className="article-page">
    <div className="article-header">
      <nav className="breadcrumbs" aria-label="Brödsmulor"><Link href="/">Start</Link><span aria-hidden="true"> / </span><span aria-current="page">{title}</span></nav>
      <p className="article-kicker">Brandrisk.info · Kunskap och vägledning</p>
      <h1>{title}</h1>
      <p className="article-intro">{intro}</p>
      <Link className="article-cta" href="/">Kontrollera brandrisken på din plats →</Link>
    </div>
    <article className="article-body" aria-label={title}>
      {children}
      <aside className="article-check">
        <h2>Kontrollera platsen innan du eldar</h2>
        <p>Se tillgänglig brandrisk och registrerad förbudsstatus för din position, ort eller ditt postnummer.</p>
        <Link className="article-cta" href="/">Välj plats och se aktuell status →</Link>
      </aside>
    </article>
  </main>;
}
