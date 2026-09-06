import { NextRequest, NextResponse } from "next/server";
import { searchSwedishPlaces } from "@/lib/geocoding";
import { GeocodeUnavailable } from "@/lib/geocode-coordinator";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 100) {
    return NextResponse.json({ error: "Ange en ort, kommun eller ett postnummer." }, { status: 400 });
  }
  try {
    return NextResponse.json({ results: await searchSwedishPlaces(query) });
  } catch (error) {
    if (error instanceof GeocodeUnavailable) {
      const busy = error.code === "busy";
      return NextResponse.json({ code: error.code, error: busy ? "Söktjänsten är upptagen. Försök igen om några sekunder." : "Ortsökningen är tillfälligt ur drift. Använd din position under tiden." }, { status: busy ? 429 : 503, headers: { "Cache-Control": "no-store", ...(busy ? { "Retry-After": "3" } : {}) } });
    }
    return NextResponse.json({ error: "Platssökningen kunde inte användas just nu. Försök igen om en stund." }, { status: 502 });
  }
}
