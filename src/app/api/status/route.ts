import { NextRequest, NextResponse } from "next/server";
import { getFireStatus } from "@/lib/brandrisk";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lon = Number(request.nextUrl.searchParams.get("lon"));
  const name = request.nextUrl.searchParams.get("name")?.trim().slice(0, 100);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < 54 || lat > 70 || lon < 10 || lon > 25) {
    return NextResponse.json({ error: "Platsen måste ligga i Sverige." }, { status: 400 });
  }
  try {
    return NextResponse.json(await getFireStatus(lat, lon, name));
  } catch {
    return NextResponse.json({ error: "Brandriskdata kunde inte hämtas just nu. Försök igen om en stund." }, { status: 502 });
  }
}
