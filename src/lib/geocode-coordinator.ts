import { createHash, randomUUID } from "node:crypto";

export class GeocodeUnavailable extends Error {
  readonly code: "busy" | "configuration" | "upstream";
  constructor(code: "busy" | "configuration" | "upstream") { super(code); this.code = code; }
}

type Command = (args: (string | number)[]) => Promise<unknown>;
const LOCK = "brandrisk:nominatim:lock:v1";
const COOLDOWN = "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('PEXPIRE', KEYS[1], ARGV[2]) else return 0 end";

export function normalizedQuery(query: string) {
  const value = query.normalize("NFC").trim().toLocaleLowerCase("sv").replace(/\s+/g, " ");
  return /^\d{3}\s?\d{2}$/.test(value) ? value.replace(/\s/g, "").replace(/^(\d{3})/, "$1 ") : value;
}

export function redisCommand(url: string, token: string): Command {
  if (new URL(url).protocol !== "https:") throw new GeocodeUnavailable("configuration");
  return async (args) => {
    const response = await fetch(url, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args), cache: "no-store", signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) throw new GeocodeUnavailable("upstream");
    const body = await response.json();
    if (body.error || !("result" in body)) throw new GeocodeUnavailable("upstream");
    return body.result;
  };
}

// All instances/environments of this app must use the same Redis database.
// Lock spans the upstream call plus a cooldown, not merely the Redis roundtrip.
export async function coordinatedSearch<T>(command: Command, key: string, lookup: () => Promise<T>): Promise<T> {
  const cacheKey = `brandrisk:geocode:v2:${createHash("sha256").update(key).digest("hex")}`;
  const cached = await command(["GET", cacheKey]);
  if (typeof cached === "string") return JSON.parse(cached) as T;
  const owner = randomUUID();
  const acquiredAt = Date.now();
  const acquired = await command(["SET", LOCK, owner, "NX", "PX", 30000]);
  if (acquired !== "OK") throw new GeocodeUnavailable("busy");
  try {
    // Refuse to start if a stalled acquisition used most of the lease.
    if (Date.now() - acquiredAt > 5000) throw new GeocodeUnavailable("busy");
    const result = await lookup(); // caller enforces an 8-second timeout
    await command(["SET", cacheKey, JSON.stringify(result), "EX", 86400]);
    return result;
  } finally {
    // Never delete a successor's lock. On Redis failure the lease expires safely.
    await command(["EVAL", COOLDOWN, 1, LOCK, owner, 1100]).catch(() => undefined);
  }
}
