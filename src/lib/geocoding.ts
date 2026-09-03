import "server-only";
import type { GeocodeResult } from "@/lib/types";

const NOMINATIM = "https://nominatim.openstreetmap.org";
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
  };
}

export async function searchSwedishPlaces(query: string): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({ q: query, format: "jsonv2", addressdetails: "1", countrycodes: "se", limit: "5", dedupe: "1" });
  const response = await fetch(`${NOMINATIM}/search?${params}`, {
    headers: REQUEST_HEADERS,
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Geocoding failed");
  const items = (await response.json()) as NominatimItem[];
  return items.map(normalize).filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));
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
