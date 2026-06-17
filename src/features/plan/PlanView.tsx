import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { WEEKDAY_LABELS, todayWeekday } from '../../lib/date';
import { exerciseCountLabel, exerciseMetaParts } from '../../lib/workout';
import { IconChevron, IconEdit, IconPlus } from '../../components/icons';
import {
  collapseVariants,
  staggerContainer,
  staggerItem,
} from '../../lib/motion';
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

      <motion.div
        className={styles.days}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {WEEKDAY_LABELS.map((label, weekday) => {
          const workouts = state.plan[weekday] ?? [];
          return (
            <motion.section
              key={weekday}
              className={styles.day}
              variants={staggerItem}
            >
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
                          <IconChevron
                            size={18}
                            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
                          />
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
                          <IconEdit size={18} />
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            className={styles.panelWrap}
                            variants={collapseVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <div className={styles.panel}>
                              {w.exercises.length === 0 ? (
                                <p className={styles.panelEmpty}>
                                  Noch keine Übungen — über „Bearbeiten"
                                  hinzufügen.
                                </p>
                              ) : (
                                <ul className={styles.exerciseList}>
                                  {w.exercises.map((ex) => {
                                    const meta = exerciseMetaParts(ex);
                                    return (
                                      <li
                                        key={ex.id}
                                        className={styles.exerciseItem}
                                      >
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => setEditor({ weekday })}
                >
                  <IconPlus size={18} />
                  Workout hinzufügen
                </button>
              </div>
            </motion.section>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {editor && (
          <WorkoutForm
            key="editor"
            weekday={editor.weekday}
            workout={editor.workout}
            onClose={() => setEditor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
