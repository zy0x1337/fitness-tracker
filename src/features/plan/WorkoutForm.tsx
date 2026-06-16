import { useState, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { WEEKDAY_LABELS } from '../../lib/date';
import { useApp } from '../../store/AppContext';
import type { Workout } from '../../store/types';
import styles from './WorkoutForm.module.css';

interface WorkoutFormProps {
  weekday: number;
  /** vorhandenes Workout = Bearbeiten-Modus, sonst Anlegen */
  workout?: Workout;
  onClose: () => void;
}

function parsePositiveInt(value: string): number | undefined {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function WorkoutForm({ weekday, workout, onClose }: WorkoutFormProps) {
  const { dispatch } = useApp();
  const isEdit = Boolean(workout);

  const [name, setName] = useState(workout?.name ?? '');
  const [duration, setDuration] = useState(
    workout?.durationMin ? String(workout.durationMin) : '',
  );
  const [sets, setSets] = useState(workout?.sets ? String(workout.sets) : '');
  const [reps, setReps] = useState(workout?.reps ? String(workout.reps) : '');

  const trimmed = name.trim();
  const canSave = trimmed.length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSave) return;

    const next: Workout = {
      id: workout?.id ?? crypto.randomUUID(),
      name: trimmed,
      durationMin: parsePositiveInt(duration),
      sets: parsePositiveInt(sets),
      reps: parsePositiveInt(reps),
    };

    dispatch(
      isEdit
        ? { type: 'UPDATE_WORKOUT', weekday, workout: next }
        : { type: 'ADD_WORKOUT', weekday, workout: next },
    );
    onClose();
  }

  function handleDelete() {
    if (!workout) return;
    dispatch({ type: 'DELETE_WORKOUT', weekday, workoutId: workout.id });
    onClose();
  }

  return (
    <Modal
      title={isEdit ? 'Workout bearbeiten' : `Workout — ${WEEKDAY_LABELS[weekday]}`}
      onClose={onClose}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="wf-name">
            Name
          </label>
          <input
            id="wf-name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Oberkörper, Lauf, Beine …"
            autoFocus
            maxLength={60}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Details (optional)</span>
          <div className={styles.metaRow}>
            <div className={styles.control}>
              <input
                className={styles.controlInput}
                type="number"
                inputMode="numeric"
                min={1}
                max={600}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="45"
                aria-label="Dauer in Minuten"
              />
              <span className={styles.unit}>Min.</span>
            </div>

            <div className={styles.control}>
              <input
                className={styles.controlInput}
                type="number"
                inputMode="numeric"
                min={1}
                max={99}
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                placeholder="3"
                aria-label="Anzahl Sätze"
              />
              <span className={styles.unit}>Sätze</span>
            </div>

            <div className={styles.control}>
              <input
                className={styles.controlInput}
                type="number"
                inputMode="numeric"
                min={1}
                max={9999}
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="12"
                aria-label="Anzahl Wiederholungen"
              />
              <span className={styles.unit}>Wdh.</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="submit" variant="primary" disabled={!canSave}>
            {isEdit ? 'Speichern' : 'Hinzufügen'}
          </Button>
          {isEdit && (
            <Button type="button" variant="danger" onClick={handleDelete}>
              Löschen
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
