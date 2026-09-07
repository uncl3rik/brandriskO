import "server-only";
import { normalizeLevel, normalizeProhibition, periodOverlapsDay, riskName, safeSourceUrl } from "@/lib/risk-normalization";
import type { FireStatus, ForecastDay, ProhibitionStatus } from "@/lib/types";

const API_BASE = "https://api.msb.se/brandrisk/v2";
const cache = new Map<string, { expires: number; data: unknown }>();

type RiskData = { date: string; issuedDate?: string; riskIndex: number; riskMessage?: string };
type RiskLevelDefinition = { riskLevel: number; message?: string };
type CurrentRiskResponse = { periodStartDate?: string; periodEndDate?: string; forecast?: RiskData };
type FireProhibitionResponse = {
  county?: string;
  municipality?: string;
  fireProhibition?: {
    status?: string; statusMessage?: string; statusCode?: number; revisionDate?: string;
    description?: string; authority?: string; url?: string;
  };
};

async function getJson<T>(path: string, precise = false): Promise<T> {
  const cached = precise ? undefined : cache.get(path);
  if (cached && cached.expires > Date.now()) return cached.data as T;
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error(`Brandrisk API returned ${response.status}`);
  const data: unknown = await response.json();
  if (path.startsWith("/CurrentRisk") && (!data || typeof data !== "object" || !("forecast" in data))) throw new Error("Invalid risk response");
  if ((path.startsWith("/RiskLevels") || path.startsWith("/RiskDailyForecast")) && !Array.isArray(data)) throw new Error("Invalid list response");
  if (!precise) {
    if (cache.size >= 500) cache.clear();
    cache.set(path, { expires: Date.now() + 600000, data });
  }
  return data as T;
}

function prohibitionTitle(status: ProhibitionStatus) {
  if (status === "none") return "Inget eldningsförbud registrerat";
  if (status === "prohibited") return "Eldningsförbud";
  if (status === "severe") return "Skärpt eldningsförbud";
  return "Status för eldningsförbud saknas";
}

export async function getFireStatus(latitude: number, longitude: number, nameHint?: string): Promise<FireStatus> {
  // Three decimals is roughly 110 metres and avoids caching precise personal coordinates.
  const lat = Number(latitude.toFixed(3));
  const lon = Number(longitude.toFixed(3));
  const [riskResult, prohibitionResult, forecastResult, levelsResult] = await Promise.allSettled([
    getJson<CurrentRiskResponse>(`/CurrentRisk/sv/${lat}/${lon}`, true),
    getJson<FireProhibitionResponse>(`/FireProhibition/sv/${latitude}/${longitude}`, true),
    getJson<RiskData[]>(`/RiskDailyForecast/sv/${lat}/${lon}`),
    getJson<RiskLevelDefinition[]>("/RiskLevels/sv"),
  ]);
  if (riskResult.status === "rejected" && prohibitionResult.status === "rejected") throw new Error("Official status unavailable");

  const candidate = riskResult.status === "fulfilled" ? riskResult.value : undefined;
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(new Date());
  const current = periodOverlapsDay(candidate?.periodStartDate, candidate?.periodEndDate, today) ? candidate : undefined;
  const area = prohibitionResult.status === "fulfilled" ? prohibitionResult.value : undefined;
  const rawProhibition = area?.fireProhibition;
  const prohibitionStatus = normalizeProhibition(rawProhibition?.status, rawProhibition?.statusCode);
  const riskLevel = normalizeLevel(current?.forecast?.riskIndex);
  const officialLevel = levelsResult.status === "fulfilled"
    ? levelsResult.value.find((item) => item.riskLevel === riskLevel)
    : undefined;
  const forecast: ForecastDay[] = forecastResult.status === "fulfilled"
    ? forecastResult.value.filter((day) => day && typeof day.date === "string" && day.date.slice(0, 10) >= today).slice(0, 6).map((day) => {
        const level = normalizeLevel(day.riskIndex);
        return { date: day.date, level, name: riskName(level), description: day.riskMessage };
      }) : [];

  return {
    location: {
      name: nameHint || area?.county || "Din plats",
      // The live API has these English field names reversed.
      municipality: area?.county,
      county: area?.municipality,
      latitude: lat,
      longitude: lon,
    },
    risk: {
      level: riskLevel,
      name: riskName(riskLevel),
      description: current?.forecast?.riskMessage || officialLevel?.message || (riskResult.status === "rejected"
        ? "Den aktuella riskprognosen kunde inte hämtas från myndigheten. Försök igen senare. Förbudsstatus kontrolleras separat."
        : candidate && !current
          ? "Myndighetens prognosperiod kunde inte bekräftas för idag. Därför visas ingen aktuell risknivå. Förbudsstatus kontrolleras separat."
          : "Myndigheten saknar en användbar risknivå för platsen just nu. Förbudsstatus kontrolleras separat."),
      issuedAt: current?.forecast?.issuedDate,
      validFrom: current?.periodStartDate,
      validTo: current?.periodEndDate,
    },
    prohibition: {
      status: prohibitionStatus,
      title: prohibitionTitle(prohibitionStatus),
      description: prohibitionStatus === "unknown" ? "Uppgiften kunde inte bekräftas. Kontrollera aktuellt beslut hos kommunen eller länsstyrelsen." : rawProhibition?.statusMessage || rawProhibition?.description,
      authority: rawProhibition?.authority,
      sourceUrl: safeSourceUrl(rawProhibition?.url),
      revisedAt: rawProhibition?.revisionDate,
    },
    forecast,
    checkedAt: new Date().toISOString(),
  };
}
