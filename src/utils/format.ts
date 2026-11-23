/** Display formatting helpers (en-IN). */

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const shortDateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const weekdayFmt = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" });
const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });

/** Parse YYYY-MM-DD as a local calendar date (avoids UTC off-by-one). */
export function parseDateOnly(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function toDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayDateOnly(): string {
  return toDateOnly(new Date());
}

export function addDays(dateOnly: string, days: number): string {
  const d = parseDateOnly(dateOnly);
  d.setDate(d.getDate() + days);
  return toDateOnly(d);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "Date to be confirmed";
  const date = value.length === 10 ? parseDateOnly(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? "Date to be confirmed" : dateFmt.format(date);
}

export function formatShortDate(value: string): string {
  const date = value.length === 10 ? parseDateOnly(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : shortDateFmt.format(date);
}

export function formatWeekdayDate(value: string): string {
  const date = value.length === 10 ? parseDateOnly(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : weekdayFmt.format(date);
}

export function formatTime24(value: string): string {
  if (!/^\d{2}:\d{2}$/.test(value)) return value;
  const [h, m] = value.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return timeFmt.format(d);
}

export function formatRelative(iso: string, now: Date = new Date()): string {
  const diff = now.getTime() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} d ago`;
  return formatShortDate(iso);
}

export function daysUntil(dateOnly: string, today: string = todayDateOnly()): number {
  return Math.round((parseDateOnly(dateOnly).getTime() - parseDateOnly(today).getTime()) / 86_400_000);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
