import "server-only";
import type { GeocodeResult } from "@/lib/types";
import { placeKind, selectPlaces } from "@/lib/place-selection";

const NOMINATIM = process.env.GEOCODING_BASE_URL || "https://nominatim.openstreetmap.org";
let nextRequestAt = 0;
const resultsCache = new Map<string, { expires: number; results: GeocodeResult[] }>();
const REQUEST_HEADERS = {
  "User-Agent": "Brandrisk.info/1.0 (+https://brandrisk.info)",
  Accept: "application/json",
  "Accept-Language": "sv",
};

type NominatimItem = {
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type?: string;
  addresstype?: string;
  address?: Record<string, string>;
};

export function slugifyPlace(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalize(item: NominatimItem): GeocodeResult {
  const address = item.address ?? {};
  const name = item.name || address.city || address.town || address.village || address.municipality || address.postcode || "Vald plats";
  return {
    name,
    displayName: item.display_name,
    municipality: address.municipality || address.city || address.town,
    county: address.county || address.state,
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    slug: slugifyPlace(name),
    kind: placeKind(item),
  };
}

export async function searchSwedishPlaces(query: string): Promise<GeocodeResult[]> {
  const key = query.trim().toLocaleLowerCase("sv").replace(/\s+/g, " ");
  const cached = resultsCache.get(key);
  if (cached && cached.expires > Date.now()) return cached.results;
  // A public Nominatim budget cannot be enforced across Vercel instances without
  // a shared gateway. Production must point to a provider or rate-limited proxy.
  if (process.env.VERCEL && NOMINATIM === "https://nominatim.openstreetmap.org") throw new Error("Configure production geocoder");
  if (nextRequestAt > Date.now()) throw new Error("Geocoder busy");
  nextRequestAt = Date.now() + 1100;
  const params = new URLSearchParams({ q: query, format: "jsonv2", addressdetails: "1", countrycodes: "se", limit: "20", dedupe: "1" });
  const response = await fetch(`${NOMINATIM}/search?${params}`, {
    headers: REQUEST_HEADERS,
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Geocoding failed");
  const items = (await response.json()) as NominatimItem[];
  const valid = items.filter((item) => Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lon)));
  const results = selectPlaces(valid, query).map(normalize);
  if (resultsCache.size >= 500) resultsCache.clear();
  resultsCache.set(key, { expires: Date.now() + 86400000, results });
  return results;
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({ lat: String(latitude), lon: String(longitude), format: "jsonv2", addressdetails: "1", zoom: "12" });
  try {
    const response = await fetch(`${NOMINATIM}/reverse?${params}`, {
      headers: REQUEST_HEADERS,
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    return normalize((await response.json()) as NominatimItem);
  } catch { return null; }
}
