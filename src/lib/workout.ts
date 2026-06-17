import type { Exercise, Workout } from '../store/types';

/**
 * Liefert die gesetzten Metadaten einer Übung als kurze Textbausteine
 * (Sätze, Wiederholungen, Dauer) — nur, was tatsächlich gesetzt ist.
 */
export function exerciseMetaParts(exercise: Exercise): string[] {
  const parts: string[] = [];
  if (exercise.sets) {
    parts.push(`${exercise.sets} ${exercise.sets === 1 ? 'Satz' : 'Sätze'}`);
  }
  if (exercise.reps) parts.push(`${exercise.reps} Wdh.`);
  if (exercise.durationMin) parts.push(`${exercise.durationMin} Min.`);
  return parts;
}

/** „3 Übungen" / „1 Übung" / „Keine Übungen". */
export function exerciseCountLabel(workout: Workout): string {
  const n = workout.exercises.length;
  if (n === 0) return 'Keine Übungen';
  return `${n} ${n === 1 ? 'Übung' : 'Übungen'}`;
}

/** Summe der Übungs-Dauern (0, wenn keine gesetzt). */
export function sumExerciseDuration(exercises: { durationMin?: number }[]): number {
  return exercises.reduce((sum, ex) => sum + (ex.durationMin ?? 0), 0);
}

/**
 * Gesamtdauer des Workouts in Minuten: manuelle Eingabe hat Vorrang,
 * sonst automatische Summe der Übungs-Dauern. undefined, wenn nichts vorliegt.
 */
export function workoutDuration(workout: Workout): number | undefined {
  if (workout.durationMin) return workout.durationMin;
  const sum = sumExerciseDuration(workout.exercises);
  return sum > 0 ? sum : undefined;
}

/**
 * Kurz-Zusammenfassung für die Übersicht, z. B. „3 Übungen · 45 Min.".
 */
export function workoutSummary(workout: Workout): string {
  const duration = workoutDuration(workout);
  if (workout.exercises.length === 0) {
    return duration ? `${duration} Min.` : exerciseCountLabel(workout);
  }
  const count = exerciseCountLabel(workout);
  return duration ? `${count} · ${duration} Min.` : count;
}
