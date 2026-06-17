import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { exerciseCountLabel, exerciseMetaParts } from '../../lib/workout';
import type { LogEntry, Workout } from '../../store/types';
import styles from './DailyView.module.css';

interface Props {
  workout: Workout;
  entry?: LogEntry;
  date: string;
}

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12.5l4.2 4.2L19 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SkipIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 12h12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export function DailyWorkoutCard({ workout, entry, date }: Props) {
  const { dispatch } = useApp();
  const status = entry?.status;
  const [noteOpen, setNoteOpen] = useState(Boolean(entry?.note));
  const [noteDraft, setNoteDraft] = useState(entry?.note ?? '');
  const [open, setOpen] = useState(false);
  const hasExercises = workout.exercises.length > 0;

  function setStatus(next: 'complete' | 'skipped') {
    dispatch({ type: 'SET_STATUS', date, workout, status: next });
  }

  function commitNote() {
    if (noteDraft === (entry?.note ?? '')) return;
    dispatch({ type: 'SET_NOTE', date, workout, note: noteDraft });
  }

  const cardClass = [
    styles.card,
    status === 'complete' && styles.cardComplete,
    status === 'skipped' && styles.cardSkipped,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass}>
      <div className={styles.top}>
        <div className={styles.headMain}>
          <div className={styles.name}>{workout.name}</div>
          <button
            type="button"
            className={styles.disclosure}
            onClick={() => hasExercises && setOpen((v) => !v)}
            aria-expanded={hasExercises ? open : undefined}
            disabled={!hasExercises}
          >
            {exerciseCountLabel(workout)}
            {hasExercises && (
              <svg
                className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
                width="16"
                height="16"
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
            )}
          </button>
        </div>
        {status === 'complete' && (
          <span className={`${styles.statusMark} ${styles.markComplete}`}>
            <CheckIcon />
          </span>
        )}
        {status === 'skipped' && (
          <span className={`${styles.statusMark} ${styles.markSkipped}`}>
            <SkipIcon />
          </span>
        )}
      </div>

      {open && hasExercises && (
        <ul className={styles.exerciseList}>
          {workout.exercises.map((ex) => {
            const meta = exerciseMetaParts(ex);
            return (
              <li key={ex.id} className={styles.exerciseItem}>
                <span className={styles.exerciseName}>{ex.name}</span>
                {meta.length > 0 && (
                  <span className={styles.exerciseMeta}>{meta.join(' · ')}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.action} ${status === 'complete' ? styles.actionDone : ''}`}
          onClick={() => setStatus('complete')}
          aria-pressed={status === 'complete'}
        >
          <CheckIcon />
          Erledigt
        </button>
        <button
          type="button"
          className={`${styles.action} ${status === 'skipped' ? styles.actionSkip : ''}`}
          onClick={() => setStatus('skipped')}
          aria-pressed={status === 'skipped'}
        >
          <SkipIcon />
          Nicht erledigt
        </button>
      </div>

      <div className={styles.noteRow}>
        {noteOpen ? (
          <textarea
            className={styles.noteArea}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            onBlur={commitNote}
            placeholder="Notiz – z. B. keine Zeit gehabt oder Rücken zwickt …"
            maxLength={500}
            autoFocus={!entry?.note}
          />
        ) : (
          <button
            type="button"
            className={styles.noteToggle}
            onClick={() => setNoteOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Notiz hinzufügen
          </button>
        )}
      </div>
    </div>
  );
}
