import { NextResponse } from "next/server";
import { normalizeWeather } from "@/lib/weather-normalization";

export async function POST(request: Request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ogiltig plats." }, { status: 400 }); }
  const { lat, lon } = body ?? {};
  if (typeof lat !== "number" || typeof lon !== "number" || !Number.isFinite(lat) || !Number.isFinite(lon) || lat < 54 || lat > 70 || lon < 10 || lon > 25) {
    return NextResponse.json({ error: "Platsen måste ligga inom tjänstens svenska sökområde." }, { status: 400 });
  }
  try {
    // Coarsen before sending to SMHI or using the URL as a server cache key.
    const url = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon.toFixed(2)}/lat/${lat.toFixed(2)}/data.json?timeseries=8&parameters=air_temperature,relative_humidity,wind_speed`;
    const response = await fetch(url, { next: { revalidate: 600 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Weather unavailable");
    let weather = normalizeWeather(await response.json());
    // Revalidation can serve an expired forecast to the first visitor after inactivity.
    if (!weather) {
      const fresh = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(4000) });
      if (fresh.ok) weather = normalizeWeather(await fresh.json());
    }
    if (!weather) throw new Error("No valid near-term forecast");
    return NextResponse.json(weather, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Väderprognosen är tillfälligt otillgänglig." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
