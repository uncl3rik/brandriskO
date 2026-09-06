import { NextRequest, NextResponse } from "next/server";
import { getFireStatus } from "@/lib/brandrisk";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") throw new Error("Invalid body");
    return respond(body.lat, body.lon, body.name);
  } catch {
    return NextResponse.json({ error: "Platsen kunde inte läsas." }, { status: 400 });
  }
}

async function respond(latitude: unknown, longitude: unknown, nameHint: unknown) {
  const lat = typeof latitude === "number" ? latitude : NaN;
  const lon = typeof longitude === "number" ? longitude : NaN;
  const name = typeof nameHint === "string" ? nameHint.trim().slice(0, 100) : undefined;
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < 54 || lat > 70 || lon < 10 || lon > 25) {
    return NextResponse.json({ error: "Platsen måste ligga i Sverige." }, { status: 400 });
  }
  try {
    return NextResponse.json(await getFireStatus(lat, lon, name), { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Brandriskdata kunde inte hämtas just nu. Försök igen om en stund." }, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lon = Number(request.nextUrl.searchParams.get("lon"));
  const name = request.nextUrl.searchParams.get("name")?.trim().slice(0, 100);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < 54 || lat > 70 || lon < 10 || lon > 25) {
    return NextResponse.json({ error: "Platsen måste ligga i Sverige." }, { status: 400 });
  }
  try {
    return respond(lat, lon, name);
  } catch {
    return NextResponse.json({ error: "Brandriskdata kunde inte hämtas just nu. Försök igen om en stund." }, { status: 502 });
  }
}
