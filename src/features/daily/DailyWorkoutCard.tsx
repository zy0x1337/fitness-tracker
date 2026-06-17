import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { exerciseMetaParts, workoutSummary } from '../../lib/workout';
import { IconCheck, IconChevron, IconNote, IconSkip } from '../../components/icons';
import { collapseVariants, tapScale } from '../../lib/motion';
import { Celebration } from './Celebration';
import type { LogEntry, Workout } from '../../store/types';
import styles from './DailyView.module.css';

interface Props {
  workout: Workout;
  entry?: LogEntry;
  date: string;
}

export function DailyWorkoutCard({ workout, entry, date }: Props) {
  const { dispatch } = useApp();
  const reduce = useReducedMotion();
  const status = entry?.status;
  const [noteOpen, setNoteOpen] = useState(Boolean(entry?.note));
  const [noteDraft, setNoteDraft] = useState(entry?.note ?? '');
  const [open, setOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const hasExercises = workout.exercises.length > 0;

  function setStatus(next: 'complete' | 'skipped') {
    // Feier nur beim NEU-Abschließen (nicht beim Zurücksetzen/erneuten Tippen).
    if (next === 'complete' && status !== 'complete') {
      setCelebrate(true);
      navigator.vibrate?.(12);
    }
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
      <AnimatePresence>
        {celebrate && <Celebration onComplete={() => setCelebrate(false)} />}
      </AnimatePresence>

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
            {workoutSummary(workout)}
            {hasExercises && (
              <IconChevron
                size={16}
                className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
              />
            )}
          </button>
        </div>
        {status === 'complete' && (
          <span className={`${styles.statusMark} ${styles.markComplete}`}>
            <IconCheck size={18} />
          </span>
        )}
        {status === 'skipped' && (
          <span className={`${styles.statusMark} ${styles.markSkipped}`}>
            <IconSkip size={18} />
          </span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && hasExercises && (
          <motion.ul
            className={styles.exerciseList}
            variants={collapseVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
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
          </motion.ul>
        )}
      </AnimatePresence>

      <div className={styles.actions}>
        <motion.button
          type="button"
          className={`${styles.action} ${status === 'complete' ? styles.actionDone : ''}`}
          onClick={() => setStatus('complete')}
          aria-pressed={status === 'complete'}
          whileTap={reduce ? undefined : tapScale}
        >
          <IconCheck size={18} />
          Erledigt
        </motion.button>
        <motion.button
          type="button"
          className={`${styles.action} ${status === 'skipped' ? styles.actionSkip : ''}`}
          onClick={() => setStatus('skipped')}
          aria-pressed={status === 'skipped'}
          whileTap={reduce ? undefined : tapScale}
        >
          <IconSkip size={18} />
          Nicht erledigt
        </motion.button>
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
            <IconNote size={16} />
            Notiz hinzufügen
          </button>
        )}
      </div>
    </div>
  );
}
