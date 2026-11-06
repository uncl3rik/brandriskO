import type { CSSProperties } from "react";
import type { ForecastDay } from "@/lib/types";
import { weatherDate, type WeatherSummary } from "@/lib/weather-normalization";
import { WeatherSymbol, cloudLabel, weatherTime, weatherValue, Precipitation } from "@/components/WeatherCard";
import { windDirectionLabel } from "@/lib/wind";

const dayLabel = (date: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", weekday: "short", day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00Z`));
const colors = ["#d8ddd5", "#b4d894", "#d9dc8e", "#f3cf83", "#edab78", "#ef9a84", "#ef8c87"];

export function OutdoorForecast({ forecast, weather, failed, checkedAt }: { forecast: ForecastDay[]; weather: WeatherSummary | null; failed: boolean; checkedAt: string }) {
  const today = weatherDate(checkedAt);
  const riskDays = new Map(forecast.map(day => [day.date.slice(0, 10), day]));
  const weatherDays = new Map((weather?.days ?? []).map(day => [weatherDate(day.validAt), day]));
  const hasRisk = forecast.some(day => day.level !== null);
  const dates = [...new Set([...riskDays.keys(), ...weatherDays.keys()])].filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today && (weatherDays.has(date) || riskDays.get(date)?.level != null)).sort().slice(0, 5);
  return <section className="section outdoor-forecast" aria-labelledby="forecast-heading">
    <div className="section-head"><h2 id="forecast-heading">De närmaste dagarna</h2><span className="section-tag">{hasRisk ? "Väder & brandrisk" : "Ditt uteväder"}</span></div>
    <p className="forecast-intro">Ett väderögonblick per dag, så nära kl. 12 som möjligt.{hasRisk && " Brandrisken visas separat för respektive datum."}</p>
    {dates.length === 0 && <p>{failed ? "Ingen prognos för kommande dagar är tillgänglig just nu." : weather ? "Ingen prognos för kommande dagar är tillgänglig." : "Hämtar prognosen för de närmaste dagarna…"}</p>}
    <div className="outdoor-days">
      {dates.map(date => {
        const risk = riskDays.get(date);
        const day = weatherDays.get(date);
        return <article className="outdoor-day" key={date}>
          <h3><time dateTime={date}>{date === today ? "Idag" : dayLabel(date)}</time></h3>
          {day ? <>
            <div className="day-temperature"><WeatherSymbol moment={day}/><strong>{weatherValue(day.temperature, "°")}</strong></div>
            <p className="day-condition">{cloudLabel(day.cloudCover)}<span>kl. {weatherTime(day.validAt)}</span></p>
            <div className="day-wind"><strong>Vind {weatherValue(day.wind, " m/s")}</strong><span>{day.wind === 0 ? "Vindstilla" : windDirectionLabel(day.windDirection)}</span><span>Byvind {weatherValue(day.gust, " m/s")}</span></div>
            <p className="day-humidity">Luftfuktighet <strong>{weatherValue(day.humidity, " %")}</strong></p>
            <div className="day-rain"><Precipitation moment={day}/></div>
          </> : <p className="day-missing">{weather || failed ? "Väderuppgift saknas" : "Hämtar väder…"}</p>}
          {hasRisk && <div className="day-risk" style={{ "--day-risk": colors[risk?.level ?? 0] ?? colors[0] } as CSSProperties}>
            <span>Brandrisk {risk?.level != null ? `· ${risk.level} av 6` : "· saknas"}</span>
            <strong>{risk?.name ?? "Ingen riskprognos"}</strong>
          </div>}
          {risk?.level != null && risk.description && <details><summary>Myndighetens råd</summary><p>{risk.description}</p></details>}
        </article>;
      })}
    </div>
    {!hasRisk && <p className="forecast-context">Ingen brandriskprognos tillgänglig för de kommande dagarna. När data finns visas den här tillsammans med vädret.</p>}
    <p className="forecast-context">Vädret påverkar brandrisken, men en regnskur eller sval dag betyder inte automatiskt att marken är fuktig. Följ brandriskprognosen och lokala beslut inför eldning.</p>
  </section>;
}
