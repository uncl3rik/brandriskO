export function normalizeLevel(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 6 ? value : null;
}

export function riskName(level: number | null) {
  return level === null ? "Brandriskdata saknas" : `Sammanvägd nivå ${level}`;
}

// Source timestamps have no documented offset. Check calendar-day overlap,
// not browser-local parsing. An end at midnight belongs to the preceding day.
export function periodOverlapsDay(start: unknown, end: unknown, day: string): boolean {
  if (typeof start !== "string" || typeof end !== "string") return false;
  const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/;
  if (!pattern.test(start) || !pattern.test(end) || start >= end) return false;
  const startDay = start.slice(0, 10);
  const endDay = end.slice(0, 10);
  const endsAtMidnight = /^00:00:00(?:\.0+)?$/.test(end.slice(11));
  return startDay <= day && (day < endDay || (day === endDay && !endsAtMidnight));
}

// Swagger lists numeric values but does not document their meanings. Only the
// observed code/text pair for absence is accepted; unknown wording fails closed.
export function normalizeProhibition(raw: unknown, code: unknown): "none" | "prohibited" | "severe" | "unknown" {
  if (typeof raw !== "string") return "unknown";
  const value = raw.trim().toLocaleLowerCase("sv");
  if (value === "inget eldningsförbud" && code === 2) return "none";
  if (value === "skärpt eldningsförbud") return "severe";
  if (value === "eldningsförbud" || value === "annat eldningsförbud") return "prohibited";
  return "unknown";
}

export function safeSourceUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch { return undefined; }
}
