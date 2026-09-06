"use client";

import { useEffect, useRef, useState } from "react";
import { FireResult } from "@/components/FireResult";
import { LocationSearch } from "@/components/LocationSearch";
import { SiteHeader } from "@/components/SiteHeader";
import type { FireStatus, GeocodeResult, PlaceKind } from "@/lib/types";

type Mode = "landing" | "loading" | "result";

type SelectedLocation = { latitude: number; longitude: number; name?: string; kind?: PlaceKind };

export function BrandriskApp({ initialQuery, initialLocation }: { initialQuery?: string; initialLocation?: SelectedLocation }) {
  const [mode, setMode] = useState<Mode>(initialQuery ? "loading" : "landing");
  const [status, setStatus] = useState<FireStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState("Hämtar brandrisk…");
  const [matches, setMatches] = useState<GeocodeResult[]>([]);
  const [resultKind, setResultKind] = useState<PlaceKind | "gps">("other");
  const selected = useRef<SelectedLocation | null>(null);
  const requestId = useRef(0);

  async function loadStatus(location: SelectedLocation, share = false) {
    const id = ++requestId.current;
    selected.current = location;
    setMatches([]);
    setMode("loading"); setError(null); setLoadingText(location.name ? `Hämtar brandrisk för ${location.name}…` : "Hämtar brandrisk för din plats…");
    try {
      const response = await fetch("/api/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lat: location.latitude, lon: location.longitude, name: location.name }), cache: "no-store", signal: AbortSignal.timeout(15000) });
      const body = await response.json() as FireStatus | { error?: string };
      if (id !== requestId.current) return;
      if (!response.ok) throw new Error("error" in body ? body.error : undefined);
      setStatus(body as FireStatus); setResultKind(location.kind ?? (location.name ? "other" : "gps")); setMode("result");
      if (share && location.name) {
        const slug = location.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const params = new URLSearchParams({ name: location.name, lat: String(location.latitude), lon: String(location.longitude) });
        if (location.kind) params.set("kind", location.kind);
        window.history.replaceState({}, "", `/plats/${slug}?${params}`);
      }
    } catch {
      if (id !== requestId.current) return;
      setStatus(null);
      setError("Brandriskdata kunde inte hämtas just nu. Försök igen om en stund."); setMode("landing");
    }
  }

  async function search(query: string, updateUrl = true) {
    setMode("loading"); setError(null); setLoadingText(`Söker efter ${query}…`);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(12000) });
      const body = await response.json() as { results?: GeocodeResult[]; error?: string; code?: string };
      if (!response.ok) {
        setError(body.code === "busy" ? "Söktjänsten är upptagen. Försök igen om några sekunder." : "Ortsökningen är tillfälligt ur drift. Använd din position eller försök senare.");
        setMode("landing"); return;
      }
      const place = body.results?.[0];
      if (!place) throw new Error("Vi hittade inte platsen. Prova ort, kommun eller postnummer.");
      if (body.results && body.results.length > 1) {
        setMatches(body.results); setMode("landing"); return;
      }
      await loadStatus(place, updateUrl);
    } catch (reason) {
      const message = reason instanceof Error && reason.message.startsWith("Vi hittade inte") ? reason.message : "Platssökningen kunde inte användas just nu. Försök igen om en stund.";
      setError(message); setMode("landing");
    }
  }

  function locate() {
    window.history.replaceState({}, "", "/");
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
    if (initialLocation) void loadStatus(initialLocation);
    else if (initialQuery) void search(initialQuery, false);
    // The route query is intentionally resolved once on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, initialLocation]);

  useEffect(() => {
    function refresh() {
      if (document.visibilityState !== "visible" || mode !== "result" || !status || !selected.current) return;
      if (Date.now() - Date.parse(status.checkedAt) >= 5 * 60 * 1000) void loadStatus(selected.current);
    }
    document.addEventListener("visibilitychange", refresh);
    const timer = window.setInterval(refresh, 30000);
    return () => { document.removeEventListener("visibilitychange", refresh); clearInterval(timer); };
  }, [mode, status]);

  function reset() {
    requestId.current++; selected.current = null; setMatches([]);
    setStatus(null); setError(null); setMode("landing");
    if (window.location.pathname !== "/") window.history.pushState({}, "", "/");
  }

  return <div className="site-shell">
    <SiteHeader />
    {mode === "landing" && <section className="hero"><div className="hero-inner landing">
      <p className="eyebrow">Brandrisk och eldningsförbud</p><h1>Kan jag elda här idag?</h1>
      <p className="intro">Se aktuell brandrisk och registrerade eldningsförbud där du befinner dig.</p>
      <LocationSearch busy={false} onLocate={locate} onSearch={search} />
      <p className="checked">Ortsökning: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a></p>
      {matches.length > 0 && <div className="place-options"><h2>Välj plats</h2><ul>{matches.map((place, index) => <li key={`${place.slug}-${index}`}><button type="button" onClick={() => void loadStatus(place, true)}><strong>{place.name}</strong><span>{place.displayName}</span></button></li>)}</ul></div>}
      {error && <div className="inline-error" role="alert">{error}</div>}
    </div></section>}
    {mode === "loading" && <section className="hero"><div className="hero-inner loading-panel"><div className="loading-card" role="status" aria-live="polite"><div className="spinner" aria-hidden="true" /><h1>{loadingText}</h1><p>Vi kontrollerar svenska myndigheters aktuella data.</p></div></div></section>}
    {mode === "result" && status && <FireResult data={status} locationKind={resultKind} onReset={reset} />}
    <footer className="site-footer"><span>Data från Myndigheten för civilt försvar. Byggt av KEZAB</span><a href="https://www.mcf.se/sv/om-oss/kommunikationskanaler/appar/brandrisk-ute/" target="_blank" rel="noopener noreferrer">Om Brandrisk Ute hos myndigheten</a></footer>
  </div>;
}
