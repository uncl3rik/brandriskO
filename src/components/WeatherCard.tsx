"use client";

import { useEffect, useState } from "react";
import type { WeatherSummary } from "@/lib/weather-normalization";
import { requestTimeout } from "@/lib/request-timeout";

const time = (value: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
const value = (n: number | null, unit: string) => n === null ? "Saknas" : `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(n)} ${unit}`;

export function WeatherCard({ latitude, longitude }: { latitude: number; longitude: number }) {
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const timeout = requestTimeout(10000);
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/weather", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lat: latitude, lon: longitude }), cache: "no-store", signal: timeout.signal });
        if (!response.ok) throw new Error("Weather unavailable");
        const result: WeatherSummary = await response.json();
        if (active) setWeather(result);
      } catch { if (active) setFailed(true); }
      finally { timeout.dispose(); }
    }
    void load();
    return () => { active = false; timeout.dispose(); };
  }, [latitude, longitude]);

  return <section className="section weather-card" aria-labelledby="weather-heading">
    <div className="section-head"><h2 id="weather-heading">Väder vid vald plats</h2><span className="section-tag">Prognos</span></div>
    <div aria-live="polite">
      {!weather && <p>{failed ? "Väderprognosen kunde inte hämtas. Brandrisk och förbudsstatus visas separat ovan." : "Hämtar väderprognos…"}</p>}
      {weather && <>
        <p>Gäller <time dateTime={weather.validAt}>{time(weather.validAt)}</time>, svensk tid.</p>
        <dl className="weather-values">
          <div><dt>Temperatur</dt><dd>{value(weather.temperature, "°C")}</dd></div>
          <div><dt>Relativ luftfuktighet</dt><dd>{value(weather.humidity, "%")}</dd></div>
          <div><dt>Vind</dt><dd>{value(weather.wind, "m/s")}</dd></div>
        </dl>
        <p className="checked">Prognosen skapad {time(weather.issuedAt)}, svensk tid. Kan vara cachad i upp till 10 minuter.</p>
        <p className="weather-note">Avser närmaste prognospunkt till din avrundade sökposition, inte hela orten eller kommunen. Prognospunkt: {weather.latitude.toFixed(3)}° N, {weather.longitude.toFixed(3)}° E. Lokala förhållanden kan skilja sig.</p>
      </>}
    </div>
    <p className="weather-note">Luftfuktighet beskriver luften, inte hur torr marken är. Vädret är ett komplement till brandriskprognosen och ger inget tillstånd att elda.</p>
    <p className="checked">Källa: <a href="https://opendata.smhi.se/metfcst/snow1gv1/">SMHI</a> · <a href="https://www.smhi.se/data/om-smhis-data/villkor-for-anvandning">CC BY 4.0</a>. Utvalda prognosvärden, avrundade för visning.</p>
  </section>;
}
