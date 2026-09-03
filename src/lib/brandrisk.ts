import "server-only";
import { reverseGeocode } from "@/lib/geocoding";
import type { FireStatus, ForecastDay, ProhibitionStatus } from "@/lib/types";

const API_BASE = "https://api.msb.se/brandrisk/v2";

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

const RISK_NAMES: Record<number, string> = {
  1: "Mycket liten brandrisk", 2: "Liten brandrisk", 3: "Måttlig brandrisk",
  4: "Stor brandrisk", 5: "Mycket stor brandrisk", 6: "Extremt stor brandrisk",
};

export function riskName(level: number | null) {
  if (level === null || level <= 0) return "Data saknas / ej säsong";
  return RISK_NAMES[level] ?? "Okänd brandrisk";
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 600 },
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error(`Brandrisk API returned ${response.status}`);
  return response.json() as Promise<T>;
}

function normalizeLevel(level?: number) { return typeof level === "number" && level > 0 ? level : null; }

function normalizeProhibition(raw?: string): ProhibitionStatus {
  const value = raw?.toLocaleLowerCase("sv") ?? "";
  if (value.includes("skärpt")) return "severe";
  if (value.includes("inget") || value.includes("inte något") || value.includes("ej ")) return "none";
  if (value.includes("eldningsförbud")) return "prohibited";
  return "unknown";
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
  const [riskResult, prohibitionResult, forecastResult, reverseResult, levelsResult] = await Promise.allSettled([
    getJson<CurrentRiskResponse>(`/CurrentRisk/sv/${lat}/${lon}`),
    getJson<FireProhibitionResponse>(`/FireProhibition/sv/${lat}/${lon}`),
    getJson<RiskData[]>(`/RiskDailyForecast/sv/${lat}/${lon}`),
    nameHint ? Promise.resolve(null) : reverseGeocode(lat, lon),
    getJson<RiskLevelDefinition[]>("/RiskLevels/sv"),
  ]);
  if (riskResult.status === "rejected" && prohibitionResult.status === "rejected") throw new Error("Official status unavailable");

  const current = riskResult.status === "fulfilled" ? riskResult.value : undefined;
  const area = prohibitionResult.status === "fulfilled" ? prohibitionResult.value : undefined;
  const rawProhibition = area?.fireProhibition;
  const prohibitionStatus = normalizeProhibition(rawProhibition?.status);
  const reversed = reverseResult.status === "fulfilled" ? reverseResult.value : null;
  const riskLevel = normalizeLevel(current?.forecast?.riskIndex);
  const officialLevel = levelsResult.status === "fulfilled"
    ? levelsResult.value.find((item) => item.riskLevel === (riskLevel ?? 0))
    : undefined;
  const forecast: ForecastDay[] = forecastResult.status === "fulfilled"
    ? forecastResult.value.slice(0, 6).map((day) => {
        const level = normalizeLevel(day.riskIndex);
        return { date: day.date, level, name: riskName(level), description: day.riskMessage };
      }) : [];

  return {
    location: {
      name: nameHint || reversed?.name || area?.county || "Din plats",
      municipality: area?.county || reversed?.municipality,
      county: area?.municipality || reversed?.county,
      latitude: lat,
      longitude: lon,
    },
    risk: {
      level: riskLevel,
      name: riskName(riskLevel),
      description: officialLevel?.message || current?.forecast?.riskMessage,
      validFrom: current?.periodStartDate,
      validTo: current?.periodEndDate,
    },
    prohibition: {
      status: prohibitionStatus,
      title: prohibitionTitle(prohibitionStatus),
      description: rawProhibition?.statusMessage || rawProhibition?.description,
      authority: rawProhibition?.authority,
      sourceUrl: rawProhibition?.url,
      revisedAt: rawProhibition?.revisionDate,
    },
    forecast,
    checkedAt: new Date().toISOString(),
  };
}
