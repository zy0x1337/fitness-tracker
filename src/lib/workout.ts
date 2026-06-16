import type { Workout } from '../store/types';

/**
 * Liefert die gesetzten Metadaten eines Workouts als kurze Textbausteine
 * (Dauer, Sätze, Wiederholungen) — nur, was tatsächlich gesetzt ist.
 */
export function workoutMetaParts(workout: Workout): string[] {
  const parts: string[] = [];
  if (workout.durationMin) parts.push(`${workout.durationMin} Min.`);
  if (workout.sets) {
    parts.push(`${workout.sets} ${workout.sets === 1 ? 'Satz' : 'Sätze'}`);
  }
  if (workout.reps) parts.push(`${workout.reps} Wdh.`);
  return parts;
}
