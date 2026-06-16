// Zentrale Datentypen der App. Alles wird lokal im Browser gehalten.

export type Category =
  | 'push'
  | 'pull'
  | 'legs'
  | 'cardio'
  | 'core'
  | 'mobility'
  | 'custom';

export interface Workout {
  id: string;
  name: string;
  category: Category;
  /** geschätzte Dauer in Minuten, optional */
  durationMin?: number;
}

/** Wochenplan: Schlüssel 0 = Montag … 6 = Sonntag. Leerer Tag = Ruhetag. */
export type WeeklyPlan = Record<number, Workout[]>;

export type LogStatus = 'complete' | 'skipped';

export interface LogEntry {
  status: LogStatus;
  note?: string;
  /** Namens-Snapshot, damit der Verlauf stabil bleibt, falls der Plan später geändert wird */
  workoutName: string;
  category: Category;
  /** ISO-Zeitstempel der letzten Änderung */
  updatedAt: string;
}

/** Tageslog: log[YYYY-MM-DD][workoutId] = Eintrag */
export type DailyLog = Record<string, Record<string, LogEntry>>;

export type ThemePref = 'light' | 'dark' | 'system';

export interface AppState {
  version: number;
  plan: WeeklyPlan;
  log: DailyLog;
  theme: ThemePref;
}

export const STATE_VERSION = 1;

export function createEmptyState(): AppState {
  return {
    version: STATE_VERSION,
    plan: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
    log: {},
    theme: 'system',
  };
}
