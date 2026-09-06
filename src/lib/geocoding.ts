import "server-only";
import type { GeocodeResult } from "@/lib/types";
import { placeKind, selectPlaces } from "@/lib/place-selection";
import { coordinatedSearch, GeocodeUnavailable, normalizedQuery, redisCommand } from "@/lib/geocode-coordinator";

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
  const key = normalizedQuery(query);
  const cached = resultsCache.get(key);
  if (cached && cached.expires > Date.now()) return cached.results;
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  const lookup = async () => {
  const params = new URLSearchParams({ q: key, format: "jsonv2", addressdetails: "1", countrycodes: "se", limit: "20", dedupe: "1" });
  const response = await fetch(`${NOMINATIM}/search?${params}`, {
    headers: REQUEST_HEADERS,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Geocoding failed");
  const items = (await response.json()) as NominatimItem[];
  const valid = items.filter((item) => Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lon)));
  return selectPlaces(valid, key).map(normalize);
  };
  let results: GeocodeResult[];
  if (redisUrl && redisToken) {
    results = await coordinatedSearch(redisCommand(redisUrl, redisToken), `${NOMINATIM}:${key}`, lookup);
  } else {
    if (process.env.VERCEL && new URL(NOMINATIM).hostname === "nominatim.openstreetmap.org") throw new GeocodeUnavailable("configuration");
    if (nextRequestAt > Date.now()) throw new GeocodeUnavailable("busy");
    nextRequestAt = Date.now() + 30000;
    try { results = await lookup(); } finally { nextRequestAt = Date.now() + 1100; }
  }
  if (resultsCache.size >= 500) resultsCache.clear();
  resultsCache.set(key, { expires: Date.now() + 86400000, results });
  return results;
}
