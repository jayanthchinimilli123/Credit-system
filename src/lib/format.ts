/** Format a number as whole-dollar USD. Returns an em dash for null. */
export function currency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format a 0-100 confidence value as a percentage label. */
export function percent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Multiplier of requested vs current limit, e.g. "2.5x". */
export function limitMultiple(requested: number, current: number): string {
  if (!current) return "—";
  return `${(requested / current).toFixed(1)}x`;
}

/** Current wall-clock time label like "9:18 AM" for freshly generated audit rows. */
export function nowClockLabel(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Stable id generator for client-only audit rows. */
export function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
