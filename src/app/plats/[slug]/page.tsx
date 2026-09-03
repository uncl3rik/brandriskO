import type { Metadata } from "next";
import { BrandriskApp } from "@/components/BrandriskApp";
import { searchSwedishPlaces } from "@/lib/geocoding";

function placeFromSlug(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("sv"));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const query = placeFromSlug(slug);
  const place = (await searchSwedishPlaces(query).catch(() => []))[0]?.name || query;
  return { title: `Brandrisk ${place} idag – eldningsförbud och brandrisk`, description: `Se aktuell brandrisk och status för eldningsförbud i ${place}.` };
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BrandriskApp initialQuery={placeFromSlug(slug)} />;
}
