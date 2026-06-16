import { createEmptyState, STATE_VERSION, type AppState } from './types';

const STORAGE_KEY = 'fitness-tracker-v1';

/** Lädt den App-State aus localStorage; bei Fehlern wird ein leerer Default geliefert. */
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();

    const parsed = JSON.parse(raw) as Partial<AppState>;
    const empty = createEmptyState();

    // Defensiv mergen, damit fehlende/zukünftige Felder nicht crashen.
    return {
      version: STATE_VERSION,
      plan: { ...empty.plan, ...(parsed.plan ?? {}) },
      log: parsed.log ?? {},
      theme: parsed.theme ?? 'system',
    };
  } catch {
    return createEmptyState();
  }
}

/** Speichert den App-State. Fehler (z.B. voller Speicher) werden still geschluckt. */
export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Speicher nicht verfügbar — App funktioniert weiter, nur ohne Persistenz.
  }
}
