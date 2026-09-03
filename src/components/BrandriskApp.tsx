"use client";

import { useEffect, useState } from "react";
import { FireResult } from "@/components/FireResult";
import { LocationSearch } from "@/components/LocationSearch";
import { SiteHeader } from "@/components/SiteHeader";
import type { FireStatus, GeocodeResult } from "@/lib/types";

type Mode = "landing" | "loading" | "result";

export function BrandriskApp({ initialQuery }: { initialQuery?: string }) {
  const [mode, setMode] = useState<Mode>(initialQuery ? "loading" : "landing");
  const [status, setStatus] = useState<FireStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState("Hämtar brandrisk…");

  async function loadStatus(location: { latitude: number; longitude: number; name?: string }, share = false) {
    setMode("loading"); setError(null); setLoadingText(location.name ? `Hämtar brandrisk för ${location.name}…` : "Hämtar brandrisk för din plats…");
    try {
      const params = new URLSearchParams({ lat: String(location.latitude), lon: String(location.longitude) });
      if (location.name) params.set("name", location.name);
      const response = await fetch(`/api/status?${params}`, { signal: AbortSignal.timeout(15000) });
      const body = await response.json() as FireStatus | { error?: string };
      if (!response.ok) throw new Error("error" in body ? body.error : undefined);
      setStatus(body as FireStatus); setMode("result");
      if (share && location.name) {
        const slug = location.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        window.history.pushState({}, "", `/plats/${slug}`);
      }
    } catch (reason) {
      const message = reason instanceof Error && reason.message && reason.message !== "error" && reason.name !== "TimeoutError" ? reason.message : "Brandriskdata kunde inte hämtas just nu. Försök igen om en stund.";
      setError(message); setMode("landing");
    }
  }

  async function search(query: string, updateUrl = true) {
    setMode("loading"); setError(null); setLoadingText(`Söker efter ${query}…`);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(12000) });
      const body = await response.json() as { results?: GeocodeResult[]; error?: string };
      if (!response.ok) throw new Error(body.error);
      const place = body.results?.[0];
      if (!place) throw new Error("Vi hittade inte platsen. Prova ort, kommun eller postnummer.");
      await loadStatus(place, updateUrl);
    } catch (reason) {
      const message = reason instanceof Error && reason.message && reason.name !== "TimeoutError" ? reason.message : "Platssökningen tog för lång tid. Försök igen.";
      setError(message); setMode("landing");
    }
  }

  function locate() {
    setError(null);
    if (!("geolocation" in navigator)) { setError("Din webbläsare kan inte hämta positionen. Sök efter din ort istället."); return; }
    setMode("loading"); setLoadingText("Hämtar brandrisk för din plats…");
    navigator.geolocation.getCurrentPosition(
      (position) => void loadStatus({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      (positionError) => {
        const messages: Record<number, string> = { 1: "Vi fick inte tillgång till din position. Sök efter din ort istället.", 2: "Din position kunde inte fastställas. Sök efter din ort istället.", 3: "Det tog för lång tid att hitta din position. Försök igen eller sök efter din ort." };
        setError(messages[positionError.code] || "Positionen kunde inte hämtas. Sök efter din ort istället."); setMode("landing");
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  }

  useEffect(() => {
    // Loading the slug is the intended one-time side effect of a shareable place route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialQuery) void search(initialQuery, false);
    // The route query is intentionally resolved once on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function reset() {
    setStatus(null); setError(null); setMode("landing");
    if (window.location.pathname !== "/") window.history.pushState({}, "", "/");
  }

  return <div className="site-shell">
    <SiteHeader />
    {mode === "landing" && <section className="hero"><div className="hero-inner landing">
      <p className="eyebrow">Brandrisk och eldningsförbud</p><h1>Kan jag elda här idag?</h1>
      <p className="intro">Se aktuell brandrisk och registrerade eldningsförbud där du befinner dig.</p>
      <LocationSearch busy={false} onLocate={locate} onSearch={search} />
      {error && <div className="inline-error" role="alert">{error}</div>}
    </div></section>}
    {mode === "loading" && <section className="hero"><div className="hero-inner loading-panel"><div className="loading-card" role="status" aria-live="polite"><div className="spinner" aria-hidden="true" /><h1>{loadingText}</h1><p>Vi kontrollerar svenska myndigheters aktuella data.</p></div></div></section>}
    {mode === "result" && status && <FireResult data={status} onReset={reset} />}
    <footer className="site-footer"><span>Data från Myndigheten för civilt försvar och OpenStreetMap.</span><a href="https://www.msb.se/sv/amnesomraden/skydd-mot-olyckor-och-farliga-amnen/brand-och-explosion/brandrisk-och-eldningsforbud/" target="_blank" rel="noopener noreferrer">Om brandrisk hos myndigheten</a></footer>
  </div>;
}
