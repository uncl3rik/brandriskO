import type { CSSProperties } from "react";
import Link from "next/link";
import { WeatherCard } from "@/components/WeatherCard";
import type { FireStatus, PlaceKind, ProhibitionStatus } from "@/lib/types";
import { AlertIcon, CheckIcon, ExternalIcon, PinIcon } from "@/components/Icons";

const COLORS = ["#a9b6af", "#9bd487", "#d1d86c", "#f0c35e", "#f09a45", "#e45e3f", "#d93b32"];
const riskColor = (level: number | null) => COLORS[level ?? 0] ?? COLORS[0];
const statusColor = (status: ProhibitionStatus) => status === "none" ? "#177a4c" : status === "unknown" ? "#687a72" : "#bf3b2f";
const formatTime = (value: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
const formatDay = (value: string) => value.slice(0, 10);
// The API supplies forecast timestamps without an offset. Show the source time
// literally instead of silently interpreting it in the visitor's timezone.
const sourceTime = (value: string) => value.replace("T", " ").slice(0, 16);

export function FireResult({ data, locationKind, onReset }: { data: FireStatus; locationKind: PlaceKind | "gps"; onReset: () => void }) {
  const level = data.risk.level;
  const color = riskColor(level);
  const status = data.prohibition.status;
  const area = [data.location.municipality !== data.location.name ? data.location.municipality : null, data.location.county].filter(Boolean).join(" · ");

  return <>
    <section className="hero result-hero" aria-labelledby="result-place">
      <div className="hero-inner">
        <div className="place-row">
          <div className="place-label"><PinIcon size={22} /><div><h1 id="result-place">{data.location.name}</h1>{area && <p>{area}</p>}<p>{locationKind === "gps" ? "Gäller din GPS-position." : locationKind === "settlement" ? "Gäller ortens centrum, inte hela orten." : locationKind === "municipality" ? "Gäller kommunens sökpunkt, inte hela kommunen." : "Gäller den valda sökpunkten, inte hela området."}</p></div></div>
          <button className="change-button" type="button" onClick={onReset}>Byt plats</button>
        </div>
        <div className="answer-status" style={{ "--status-color": statusColor(status) } as CSSProperties}>
          <span className="status-icon">{status === "none" ? <CheckIcon /> : <AlertIcon />}</span>
          <h2>{data.prohibition.title}</h2>
        </div>
        {data.risk.description && <p className="current-advice">{data.risk.description}</p>}
        <div className="risk-grid compact-risk" style={{ "--risk-color": color } as CSSProperties}>
          <div className={`risk-number ${level === null ? "no-data" : ""}`}>{level ?? "–"}</div>
          <div>
            <p className="risk-kicker">Sammanvägd brandrisk</p>
            <h2 className="risk-title">{data.risk.name}</h2>
            <div className="risk-scale" aria-label={level ? `Brandrisknivå ${level} av 6` : "Brandriskdata saknas"}>
              {[1, 2, 3, 4, 5, 6].map((step) => <span className={`scale-segment ${level !== null && step <= level ? "active" : ""}`} key={step} />)}
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="content">
      <section aria-labelledby="prohibition-heading">
        <div className="prohibition-card" style={{ "--status-color": statusColor(status) } as CSSProperties}>
          <div className="status-icon">{status === "none" ? <CheckIcon /> : <AlertIcon />}</div>
          <div>
            <h2 id="prohibition-heading">{data.prohibition.title}</h2>
            <p>{data.prohibition.description || "Kontrollera alltid lokala beslut innan du eldar eller grillar utomhus."}</p>
            <Link className="source-link" href="/eldningsforbud">Så tolkar du status för eldningsförbud</Link>
            {data.prohibition.sourceUrl && <a className="source-link" href={data.prohibition.sourceUrl} target="_blank" rel="noopener noreferrer">Se information från ansvarig myndighet <ExternalIcon /></a>}
          </div>
        </div>
        <p className="checked">Förbudskontroll: {formatTime(data.checkedAt)} svensk tid{data.prohibition.authority ? ` · Källa för beslut: ${data.prohibition.authority}` : ""}</p>
        {data.risk.issuedAt && <p className="checked">Prognos utfärdad: {sourceTime(data.risk.issuedAt)}. Prognosuppgifter kan vara cachade i upp till 10 minuter.</p>}
        {data.risk.validFrom && data.risk.validTo && <p className="checked">Prognosperiod: {sourceTime(data.risk.validFrom)}–{sourceTime(data.risk.validTo)} (myndighetens tidsangivelser).</p>}
      </section>

      <WeatherCard key={`${data.location.latitude}:${data.location.longitude}:${data.checkedAt}`} latitude={data.location.latitude} longitude={data.location.longitude} />

      {data.forecast.length > 0 && <section className="section" aria-labelledby="forecast-heading">
        <div className="section-head"><h2 id="forecast-heading">De närmaste dagarna</h2><span className="section-tag">Prognos</span></div>
        <div className="forecast-list">
          {data.forecast.slice(0, 5).map((day) => <div className="forecast-day" key={day.date} style={{ "--risk-color": riskColor(day.level) } as CSSProperties}>
            <time dateTime={day.date}>{formatDay(day.date)}</time><div className="forecast-level">{day.level ?? "–"}</div><div className="forecast-name">{day.name}</div>
            {day.description && <details><summary>Myndighetens råd</summary><p>{day.description}</p></details>}
          </div>)}
        </div>
      </section>}

      <section className="section explain-grid" aria-labelledby="meaning-heading">
        <div><h2 id="meaning-heading">Vad betyder brandrisken?</h2></div>
        <div><p>Brandrisknivån beskriver hur lätt en brand kan starta och sprida sig i skog och mark. Den är en prognos och kan variera lokalt. Följ alltid rådet för den aktuella nivån.</p>{data.risk.description && <p className="mt-4 font-medium text-[var(--ink)]">{data.risk.description}</p>}<Link className="source-link" href="/brandrisknivaer">Läs om brandrisknivåerna och prognosen</Link></div>
      </section>

      <aside className="section safety" aria-labelledby="safety-heading">
        <h2 id="safety-heading">Kontrollera alltid innan du eldar</h2>
        <p>Inget registrerat förbud är inte samma sak som ett generellt tillstånd att elda. Lokala regler, tillfälliga beslut och eget ansvar gäller fortfarande. Informationen kommer från Brandrisk Ute och ersätter inte ansvarig myndighets beslut.</p>
      </aside>
    </div>
  </>;
}
