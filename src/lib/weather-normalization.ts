export type WeatherSummary = {
  temperature: number | null;
  humidity: number | null;
  wind: number | null;
  validAt: string;
  issuedAt: string;
  latitude: number;
  longitude: number;
};

const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === "object" ? value as Record<string, unknown> : {};
const number = (value: unknown, min: number, max: number): number | null => typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? value : null;
const timestamp = (value: unknown): number => typeof value === "string" && /Z$/.test(value) ? Date.parse(value) : NaN;

export function normalizeWeather(input: unknown, now = Date.now()): WeatherSummary | null {
  const body = record(input);
  const issued = timestamp(body.createdTime);
  // Do not present old model runs or distant forecast steps as near-term weather.
  if (!Number.isFinite(issued) || issued > now + 60000 || now - issued > 12 * 3600000) return null;
  const geometry = record(body.geometry);
  const coords = geometry.coordinates;
  if (geometry.type !== "Point" || !Array.isArray(coords)) return null;
  const longitude = number(coords[0], 10, 25), latitude = number(coords[1], 54, 70);
  if (latitude === null || longitude === null || !Array.isArray(body.timeSeries)) return null;
  const step = body.timeSeries.map(record).filter(item => {
    const time = timestamp(item.time);
    return time >= now && time <= now + 3 * 3600000;
  }).sort((a, b) => timestamp(a.time) - timestamp(b.time))[0];
  if (!step) return null;
  const data = record(step.data);
  const temperature = number(data.air_temperature, -90, 60);
  const humidity = number(data.relative_humidity, 0, 100);
  const wind = number(data.wind_speed, 0, 150);
  if (temperature === null && humidity === null && wind === null) return null;
  return { temperature, humidity, wind, validAt: step.time as string, issuedAt: body.createdTime as string, latitude, longitude };
}
