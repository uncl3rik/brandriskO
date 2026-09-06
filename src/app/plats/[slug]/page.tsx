import type { Metadata } from "next";
import { BrandriskApp } from "@/components/BrandriskApp";
import type { PlaceKind } from "@/lib/types";

function placeFromSlug(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("sv"));
}

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const query = placeFromSlug(slug);
  const search = await searchParams;
  const place = typeof search.name === "string" ? search.name.slice(0, 100) : query;
  const title = `Brandrisk ${place} idag – eldningsförbud och brandrisk`;
  const description = `Se aktuell brandrisk och status för eldningsförbud i ${place}.`;
  const url = new URL(`/plats/${encodeURIComponent(slug)}`, "https://brandrisk.info");
  for (const key of ["name", "lat", "lon", "kind"]) if (typeof search[key] === "string") url.searchParams.set(key, search[key]);
  const images = [{ url: "https://brandrisk.info/og.png", width: 1200, height: 630, alt: "Brandrisk idag" }];
  return { title, description, robots: { index: false, follow: true }, alternates: { canonical: null }, openGraph: { title, description, url, images }, twitter: { card: "summary_large_image", title, description, images } };
}

export default async function PlacePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const search = await searchParams;
  const latitude = typeof search.lat === "string" ? Number(search.lat) : NaN;
  const longitude = typeof search.lon === "string" ? Number(search.lon) : NaN;
  const name = typeof search.name === "string" ? search.name.slice(0, 100) : placeFromSlug(slug);
  const kind: PlaceKind = search.kind === "settlement" || search.kind === "municipality" ? search.kind : "other";
  const initialLocation = Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= 54 && latitude <= 70 && longitude >= 10 && longitude <= 25 ? { latitude, longitude, name, kind } : undefined;
  return <BrandriskApp initialQuery={name} initialLocation={initialLocation} />;
}
