import { useState, type CSSProperties, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { CATEGORIES } from '../../lib/categories';
import { WEEKDAY_LABELS } from '../../lib/date';
import { useApp } from '../../store/AppContext';
import type { Category, Workout } from '../../store/types';
import styles from './WorkoutForm.module.css';

interface WorkoutFormProps {
  weekday: number;
  /** vorhandenes Workout = Bearbeiten-Modus, sonst Anlegen */
  workout?: Workout;
  onClose: () => void;
}

export function WorkoutForm({ weekday, workout, onClose }: WorkoutFormProps) {
  const { dispatch } = useApp();
  const isEdit = Boolean(workout);

  const [name, setName] = useState(workout?.name ?? '');
  const [category, setCategory] = useState<Category>(
    workout?.category ?? 'push',
  );
  const [duration, setDuration] = useState(
    workout?.durationMin ? String(workout.durationMin) : '',
  );

  const trimmed = name.trim();
  const canSave = trimmed.length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSave) return;

    const parsedDuration = parseInt(duration, 10);
    const next: Workout = {
      id: workout?.id ?? crypto.randomUUID(),
      name: trimmed,
      category,
      durationMin:
        Number.isFinite(parsedDuration) && parsedDuration > 0
          ? parsedDuration
          : undefined,
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
          <span className={styles.label}>Kategorie</span>
          <div className={styles.cats}>
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              const style = { '--dot': `var(${c.tokenName})` } as CSSProperties;
              return (
                <button
                  key={c.id}
                  type="button"
                  style={style}
                  className={`${styles.catBtn} ${active ? styles.catActive : ''}`}
                  onClick={() => setCategory(c.id)}
                  aria-pressed={active}
                >
                  <span className={styles.catDot} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="wf-duration">
            Dauer (optional)
          </label>
          <div className={styles.durationRow}>
            <input
              id="wf-duration"
              className={styles.input}
              type="number"
              inputMode="numeric"
              min={1}
              max={600}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="45"
            />
            <span className={styles.unit}>Minuten</span>
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
