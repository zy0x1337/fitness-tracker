import {
  createEmptyState,
  STATE_VERSION,
  type AppState,
  type Exercise,
  type Workout,
  type WeeklyPlan,
} from './types';

const STORAGE_KEY = 'fitness-tracker-v1';

/** Altes Workout-Format (v1): Werte lagen direkt am Workout. */
interface LegacyWorkout {
  id: string;
  name: string;
  durationMin?: number;
  sets?: number;
  reps?: number;
  exercises?: Exercise[];
}

/**
 * Migriert ein evtl. altes Workout auf das neue Format mit Übungen.
 * Hatte das alte Workout Dauer/Sätze/Wdh., werden diese in eine erste
 * Übung (mit dem Workout-Namen) übernommen, damit nichts verloren geht.
 */
function migrateWorkout(w: LegacyWorkout): Workout {
  if (Array.isArray(w.exercises)) {
    return { id: w.id, name: w.name, exercises: w.exercises };
  }

  const hasLegacyMeta = w.durationMin || w.sets || w.reps;
  const exercises: Exercise[] = hasLegacyMeta
    ? [
        {
          id: crypto.randomUUID(),
          name: w.name,
          durationMin: w.durationMin,
          sets: w.sets,
          reps: w.reps,
        },
      ]
    : [];

  return { id: w.id, name: w.name, exercises };
}

function migratePlan(plan: Record<number, LegacyWorkout[]>): WeeklyPlan {
  const out: WeeklyPlan = {};
  for (const [day, list] of Object.entries(plan)) {
    out[Number(day)] = (list ?? []).map(migrateWorkout);
  }
  return out;
}

/** Lädt den App-State aus localStorage; bei Fehlern wird ein leerer Default geliefert. */
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();

    const parsed = JSON.parse(raw) as Partial<AppState> & {
      plan?: Record<number, LegacyWorkout[]>;
    };
    const empty = createEmptyState();

    // Defensiv mergen + Workouts migrieren, damit fehlende/alte Felder nicht crashen.
    return {
      version: STATE_VERSION,
      plan: { ...empty.plan, ...migratePlan(parsed.plan ?? {}) },
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
