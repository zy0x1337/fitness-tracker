import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { WEEKDAY_LABELS, todayWeekday } from '../../lib/date';
import { workoutMetaParts } from '../../lib/workout';
import { WorkoutForm } from './WorkoutForm';
import type { Workout } from '../../store/types';
import styles from './PlanView.module.css';
import page from '../page.module.css';

interface EditorState {
  weekday: number;
  workout?: Workout;
}

export function PlanView() {
  const { state } = useApp();
  const [editor, setEditor] = useState<EditorState | null>(null);
  const today = todayWeekday();

  return (
    <div className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>Wochenplan</h1>
        <p className={page.subtitle}>
          Lege deine Workouts pro Wochentag an. Ein Tag ohne Workout ist ein
          Ruhetag.
        </p>
      </header>

      <div className={styles.days}>
        {WEEKDAY_LABELS.map((label, weekday) => {
          const workouts = state.plan[weekday] ?? [];
          return (
            <section key={weekday} className={styles.day}>
              <div className={styles.dayHead}>
                <span className={styles.today}>
                  <span className={styles.dayName}>{label}</span>
                  {weekday === today && (
                    <span className={styles.todayBadge}>Heute</span>
                  )}
                </span>
                {workouts.length > 0 && (
                  <span className={styles.count}>
                    {workouts.length}{' '}
                    {workouts.length === 1 ? 'Workout' : 'Workouts'}
                  </span>
                )}
              </div>

              <div className={styles.list}>
                {workouts.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    className={styles.item}
                    onClick={() => setEditor({ weekday, workout: w })}
                  >
                    <span className={styles.itemMain}>
                      <span className={styles.itemName}>{w.name}</span>
                      {workoutMetaParts(w).length > 0 && (
                        <span className={styles.duration}>
                          {workoutMetaParts(w).join(' · ')}
                        </span>
                      )}
                    </span>
                    <svg
                      className={styles.chevron}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ))}

                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => setEditor({ weekday })}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  Workout hinzufügen
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {editor && (
        <WorkoutForm
          weekday={editor.weekday}
          workout={editor.workout}
          onClose={() => setEditor(null)}
        />
      )}
    </div>
  );
}
