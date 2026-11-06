/** Meteorological direction is where the wind comes FROM, clockwise from north. */
export function windDirectionLabel(degrees: number | null): string {
  if (degrees === null || !Number.isFinite(degrees) || degrees < 0 || degrees > 360) return "Riktning saknas";
  return `Från ${["norr", "nordost", "öst", "sydost", "söder", "sydväst", "väst", "nordväst"][Math.round(degrees / 45) % 8]}`;
}
