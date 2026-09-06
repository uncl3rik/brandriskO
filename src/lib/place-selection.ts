type PlaceCandidate = { name?: string; type?: string; addresstype?: string };
const settlements = new Set(["city", "town", "village", "hamlet"]);
const clean = (value: string) => value.normalize("NFC").trim().toLocaleLowerCase("sv").replace(/\s+/g, " ");

export function placeKind(item: PlaceCandidate): "settlement" | "municipality" | "other" {
  // Municipality boundaries can have a city address type. Check their own name first.
  if (/\bkommun$/iu.test(item.name?.trim() ?? "") || item.addresstype === "municipality" || item.type === "municipality") return "municipality";
  if (settlements.has(item.addresstype ?? item.type ?? "")) return "settlement";
  return "other";
}

export function selectPlaces<T extends PlaceCandidate>(items: T[], query: string): T[] {
  const explicitMunicipality = /(?:^|\s)kommun(?:\s|$)/iu.test(query);
  const preferred = items.filter((item) => placeKind(item) === (explicitMunicipality ? "municipality" : "settlement"));
  // Do not silently replace an explicit municipality search with a town.
  const candidates = explicitMunicipality ? preferred : preferred.length ? preferred : items;
  const exact = candidates.filter((item) => clean(item.name ?? "") === clean(query));
  // Never choose the largest town automatically when names are genuinely ambiguous.
  return exact.length ? exact : candidates;
}
