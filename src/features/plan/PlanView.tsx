import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { WEEKDAY_LABELS, todayWeekday } from '../../lib/date';
import { exerciseCountLabel, exerciseMetaParts } from '../../lib/workout';
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
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const today = todayWeekday();

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>Wochenplan</h1>
        <p className={page.subtitle}>
          Lege Workouts mit ihren Übungen pro Wochentag an. Ein Tag ohne Workout
          ist ein Ruhetag.
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
                {workouts.map((w) => {
                  const open = expanded.has(w.id);
                  return (
                    <div key={w.id} className={styles.item}>
                      <div className={styles.itemRow}>
                        <button
                          type="button"
                          className={styles.itemToggle}
                          onClick={() => toggle(w.id)}
                          aria-expanded={open}
                        >
                          <svg
                            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M6 9l6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className={styles.itemMain}>
                            <span className={styles.itemName}>{w.name}</span>
                            <span className={styles.itemSub}>
                              {exerciseCountLabel(w)}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => setEditor({ weekday, workout: w })}
                          aria-label={`${w.name} bearbeiten`}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M14.5 5.5l4 4M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {open && (
                        <div className={styles.panel}>
                          {w.exercises.length === 0 ? (
                            <p className={styles.panelEmpty}>
                              Noch keine Übungen — über „Bearbeiten" hinzufügen.
                            </p>
                          ) : (
                            <ul className={styles.exerciseList}>
                              {w.exercises.map((ex) => {
                                const meta = exerciseMetaParts(ex);
                                return (
                                  <li key={ex.id} className={styles.exerciseItem}>
                                    <span className={styles.exerciseName}>
                                      {ex.name}
                                    </span>
                                    {meta.length > 0 && (
                                      <span className={styles.exerciseMeta}>
                                        {meta.join(' · ')}
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

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
