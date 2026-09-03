import { NextRequest, NextResponse } from "next/server";
import { searchSwedishPlaces } from "@/lib/geocoding";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 100) {
    return NextResponse.json({ error: "Ange en ort, kommun eller ett postnummer." }, { status: 400 });
  }
  try {
    return NextResponse.json({ results: await searchSwedishPlaces(query) });
  } catch {
    return NextResponse.json({ error: "Platssökningen kunde inte användas just nu. Försök igen om en stund." }, { status: 502 });
  }
}
