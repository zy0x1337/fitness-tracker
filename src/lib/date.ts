// Datums-Helfer. Wochenstart ist Montag (Index 0 = Mo … 6 = So).

export const WEEKDAY_LABELS = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
];

export const WEEKDAY_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

/** JS getDay(): 0 = So … 6 = Sa → unser Index: 0 = Mo … 6 = So */
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/** Lokales Datum als YYYY-MM-DD (nicht UTC, damit „heute" stimmt). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function todayWeekday(): number {
  return weekdayIndex(new Date());
}

/** Menschlich lesbares Datum, z.B. „Montag, 16. Juni". */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** Kurzes Datum aus ISO-String, z.B. „Mo, 16.06.". */
export function formatShortFromISO(iso: string): string {
  const date = parseISODate(iso);
  const wd = WEEKDAY_SHORT[weekdayIndex(date)];
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${wd}, ${d}.${m}.`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** ISO-Datum vor n Tagen relativ zu heute. */
export function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
}
