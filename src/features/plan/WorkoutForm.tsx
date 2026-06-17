import { useState, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { IconClose, IconPlus } from '../../components/icons';
import { WEEKDAY_LABELS } from '../../lib/date';
import { useApp } from '../../store/AppContext';
import type { Exercise, Workout } from '../../store/types';
import styles from './WorkoutForm.module.css';

interface WorkoutFormProps {
  weekday: number;
  /** vorhandenes Workout = Bearbeiten-Modus, sonst Anlegen */
  workout?: Workout;
  onClose: () => void;
}

interface DraftExercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  duration: string;
}

function parsePositiveInt(value: string): number | undefined {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function toDraft(ex: Exercise): DraftExercise {
  return {
    id: ex.id,
    name: ex.name,
    sets: ex.sets ? String(ex.sets) : '',
    reps: ex.reps ? String(ex.reps) : '',
    duration: ex.durationMin ? String(ex.durationMin) : '',
  };
}

function emptyDraft(): DraftExercise {
  return { id: crypto.randomUUID(), name: '', sets: '', reps: '', duration: '' };
}

export function WorkoutForm({ weekday, workout, onClose }: WorkoutFormProps) {
  const { dispatch } = useApp();
  const isEdit = Boolean(workout);

  const [name, setName] = useState(workout?.name ?? '');
  const [exercises, setExercises] = useState<DraftExercise[]>(
    workout?.exercises.length ? workout.exercises.map(toDraft) : [emptyDraft()],
  );

  const trimmed = name.trim();
  const canSave = trimmed.length > 0;

  function updateExercise(id: string, patch: Partial<DraftExercise>) {
    setExercises((list) =>
      list.map((ex) => (ex.id === id ? { ...ex, ...patch } : ex)),
    );
  }

  function removeExercise(id: string) {
    setExercises((list) => list.filter((ex) => ex.id !== id));
  }

  function addExercise() {
    setExercises((list) => [...list, emptyDraft()]);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSave) return;

    // Nur Übungen mit Namen übernehmen.
    const cleaned: Exercise[] = exercises
      .map((ex) => ({ ...ex, name: ex.name.trim() }))
      .filter((ex) => ex.name.length > 0)
      .map((ex) => ({
        id: ex.id,
        name: ex.name,
        sets: parsePositiveInt(ex.sets),
        reps: parsePositiveInt(ex.reps),
        durationMin: parsePositiveInt(ex.duration),
      }));

    const next: Workout = {
      id: workout?.id ?? crypto.randomUUID(),
      name: trimmed,
      exercises: cleaned,
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
            Workout-Name
          </label>
          <input
            id="wf-name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Push, Oberkörper, Beine …"
            autoFocus
            maxLength={60}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Übungen</span>
          <div className={styles.exercises}>
            {exercises.map((ex, idx) => (
              <div key={ex.id} className={styles.exercise}>
                <div className={styles.exerciseHead}>
                  <input
                    className={styles.input}
                    value={ex.name}
                    onChange={(e) =>
                      updateExercise(ex.id, { name: e.target.value })
                    }
                    placeholder={`Übung ${idx + 1} — z. B. Bankdrücken`}
                    maxLength={60}
                    aria-label={`Name Übung ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeExercise(ex.id)}
                    aria-label="Übung entfernen"
                  >
                    <IconClose size={18} />
                  </button>
                </div>

                <div className={styles.metaRow}>
                  <div className={styles.control}>
                    <input
                      className={styles.controlInput}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={99}
                      value={ex.sets}
                      onChange={(e) =>
                        updateExercise(ex.id, { sets: e.target.value })
                      }
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
                      value={ex.reps}
                      onChange={(e) =>
                        updateExercise(ex.id, { reps: e.target.value })
                      }
                      placeholder="12"
                      aria-label="Anzahl Wiederholungen"
                    />
                    <span className={styles.unit}>Wdh.</span>
                  </div>

                  <div className={styles.control}>
                    <input
                      className={styles.controlInput}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={600}
                      value={ex.duration}
                      onChange={(e) =>
                        updateExercise(ex.id, { duration: e.target.value })
                      }
                      placeholder="45"
                      aria-label="Dauer in Minuten"
                    />
                    <span className={styles.unit}>Min.</span>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className={styles.addExercise}
              onClick={addExercise}
            >
              <IconPlus size={18} />
              Übung hinzufügen
            </button>
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
