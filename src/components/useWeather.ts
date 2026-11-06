"use client";

import { useEffect, useState } from "react";
import type { WeatherSummary } from "@/lib/weather-normalization";
import { requestTimeout } from "@/lib/request-timeout";

export function useWeather(latitude: number, longitude: number, checkedAt: string) {
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const timeout = requestTimeout(15000);
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/weather", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lat: latitude, lon: longitude }), cache: "no-store", signal: timeout.signal });
        if (!response.ok) throw new Error("Weather unavailable");
        const result: WeatherSummary = await response.json();
        if (active) { setWeather(result); setFailed(false); }
      } catch { if (active) { setWeather(null); setFailed(true); } }
      finally { timeout.dispose(); }
    }
    void load();
    return () => { active = false; timeout.dispose(); };
  }, [latitude, longitude, checkedAt]);
  return { weather, failed };
}
