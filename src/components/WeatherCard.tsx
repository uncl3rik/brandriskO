import type { WeatherMoment, WeatherSummary } from "@/lib/weather-normalization";
import { windDirectionLabel } from "@/lib/wind";

export const weatherTime = (date: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
const time = (date: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
export const weatherValue = (n: number | null, unit: string) => n === null ? "Saknas" : `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(n)}${unit}`;
export const cloudLabel = (cover: number | null) => cover === null ? "Molnighet saknas" : cover <= 1 ? "Klart" : cover <= 5 ? "Delvis molnigt" : "Molnigt";

export function WeatherSymbol({ moment }: { moment: WeatherMoment }) {
  const cover = moment.cloudCover;
  return <svg className="weather-symbol" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    {cover === null ? <text x="22" y="44" fill="currentColor" stroke="none" fontSize="32">–</text> : <>
      {cover <= 5 && <><circle cx="27" cy="25" r="12" fill="#e7c777"/><path d="M27 5v4M27 41v4M7 25h4M43 25h4M13 11l3 3M38 36l3 3M13 39l3-3M38 14l3-3"/></>}
      {cover > 1 && <path d="M18 49h31a10 10 0 0 0 0-20 15 15 0 0 0-29-2 11 11 0 0 0-2 22Z" fill="#e4e8df"/>}
    </>}
  </svg>;
}

export function Precipitation({ moment }: { moment: WeatherMoment }) {
  return <><strong>{weatherValue(moment.precipitation, " mm")}</strong><span>Nederbörd{moment.precipitationFrom && <> kl. {weatherTime(moment.precipitationFrom)}–{weatherTime(moment.validAt)}</>}</span></>;
}

export function WeatherCard({ weather, failed }: { weather: WeatherSummary | null; failed: boolean }) {
  return <section className="outdoor-weather wind-weather" aria-labelledby="weather-heading">
    <div className="weather-heading-row"><h2 id="weather-heading">Känn in dagen.</h2>{weather && <span>Prognos · {time(weather.validAt)} · svensk tid</span>}</div>
    <div aria-live="polite">
      {!weather && <p className="weather-unavailable">{failed ? "Vädret kunde inte hämtas just nu. Brandrisk och förbudsstatus visas ändå." : "Hämtar ditt uteväder…"}</p>}
      {weather && <>
        <div className="weather-trio">
          <div className="wind-main">
            <div className="wind-compass" aria-hidden="true">
              <svg viewBox="0 0 180 180" fill="none">
                <circle cx="90" cy="90" r="68" stroke="currentColor" opacity=".3"/>
                <circle cx="90" cy="90" r="54" stroke="currentColor" strokeDasharray="1 8" opacity=".4"/>
                <g fill="currentColor" fontSize="11" textAnchor="middle"><text x="90" y="13">N</text><text x="171" y="94">Ö</text><text x="90" y="176">S</text><text x="9" y="94">V</text></g>
                {weather.windDirection !== null && weather.wind !== null && weather.wind > 0 && <g transform={`rotate(${weather.windDirection} 90 90)`}><path d="M90 35 108 108 90 99 72 108Z" fill="#f3cb75"/><path d="M90 99v43" stroke="#f3cb75" strokeWidth="2"/></g>}
                <circle cx="90" cy="90" r="4" fill="currentColor"/>
              </svg>
            </div>
            <div className="wind-reading"><span className="metric-label">Vind · medel</span><strong>{weatherValue(weather.wind, "")}<small>{weather.wind !== null && " m/s"}</small></strong><span>{weather.wind === 0 ? "Vindstilla" : windDirectionLabel(weather.windDirection)}</span><span className="wind-gust">Byvind {weatherValue(weather.gust, " m/s")}</span></div>
          </div>
          <div className="primary-metric"><span className="metric-label">Temperatur</span><strong>{weatherValue(weather.temperature, "°")}</strong><span>{cloudLabel(weather.cloudCover)}</span></div>
          <div className="primary-metric"><span className="metric-label">Luftfuktighet</span><strong>{weatherValue(weather.humidity, "")}<small>{weather.humidity !== null && " %"}</small></strong><span>Relativ fuktighet i luften</span></div>
        </div>
        <div className="weather-secondary"><Precipitation moment={weather}/></div>
        <details className="weather-details"><summary>Om väderprognosen · SMHI</summary>
          <p>Vindpilen pekar mot det håll vinden kommer från. Byvind visar vindens kortvariga toppar. Luftfuktighet beskriver luften, inte hur torr marken är. Nederbörd avser angivet intervall, inte hela dagen. Alla tider är svensk tid.</p>
          <p>Prognosen skapad {time(weather.issuedAt)}. Kan vara cachad i upp till 10 minuter. Avser SMHI:s närmaste prognospunkt: {weather.latitude.toFixed(3)}° N, {weather.longitude.toFixed(3)}° E. Lokala förhållanden kan skilja sig.</p>
          <p>Källa: <a href="https://opendata.smhi.se/metfcst/snow1gv1/">SMHI</a> · <a href="https://www.smhi.se/data/om-smhis-data/villkor-for-anvandning">CC BY 4.0</a>. Värden avrundade för visning.</p>
        </details>
      </>}
    </div>
  </section>;
}
