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
