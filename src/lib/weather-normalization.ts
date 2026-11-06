export type WeatherMoment = {
  temperature: number | null;
  humidity: number | null;
  wind: number | null;
  windDirection: number | null;
  gust: number | null;
  validAt: string;
  precipitation: number | null;
  precipitationFrom: string | null;
  cloudCover: number | null;
};
export type WeatherSummary = WeatherMoment & {
  days: WeatherMoment[];
  issuedAt: string;
  latitude: number;
  longitude: number;
};

const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === "object" ? value as Record<string, unknown> : {};
const number = (value: unknown, min: number, max: number): number | null => typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? value : null;
const timestamp = (value: unknown): number => typeof value === "string" && /Z$/.test(value) ? Date.parse(value) : NaN;
export const weatherDate = (value: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
const localHour = (value: string) => Number(new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", hour: "2-digit", hourCycle: "h23" }).format(new Date(value)));

function moment(step: Record<string, unknown>): WeatherMoment {
  const data = record(step.data);
  const start = timestamp(step.intervalParametersStartTime);
  const end = timestamp(step.time);
  const validInterval = Number.isFinite(start) && start < end && end - start <= 12 * 3600000;
  return {
    temperature: number(data.air_temperature, -90, 60),
    humidity: number(data.relative_humidity, 0, 100),
    wind: number(data.wind_speed, 0, 150),
    windDirection: number(data.wind_from_direction, 0, 360),
    gust: number(data.wind_speed_of_gust, 0, 150),
    cloudCover: number(data.cloud_area_fraction, 0, 8),
    precipitation: validInterval ? number(data.precipitation_amount_mean, 0, 1000) : null,
    precipitationFrom: validInterval ? step.intervalParametersStartTime as string : null,
    validAt: step.time as string,
  };
}

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
  const current = moment(step);
  if ([current.temperature, current.humidity, current.wind, current.cloudCover, current.precipitation].every(v => v === null)) return null;
  const byDate = new Map<string, WeatherMoment>();
  for (const item of body.timeSeries.map(record).sort((a, b) => timestamp(a.time) - timestamp(b.time))) {
    const at = timestamp(item.time);
    if (!Number.isFinite(at) || at < now || at > now + 5 * 86400000) continue;
    const candidate = moment(item);
    const date = weatherDate(candidate.validAt);
    const previous = byDate.get(date);
    if (!previous || Math.abs(localHour(candidate.validAt) - 12) < Math.abs(localHour(previous.validAt) - 12)) byDate.set(date, candidate);
  }
  return { ...current, days: [...byDate.values()].slice(0, 5), issuedAt: body.createdTime as string, latitude, longitude };
}
