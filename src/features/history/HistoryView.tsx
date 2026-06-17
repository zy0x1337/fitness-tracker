import { useMemo, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { formatShortFromISO, isoDaysAgo, todayISO } from '../../lib/date';
import { EmptyState } from '../../components/EmptyState';
import { IconCheck, IconFlame, IconSkip } from '../../components/icons';
import { springPop, staggerContainer, staggerItem } from '../../lib/motion';
import type { DailyLog, LogEntry } from '../../store/types';
import styles from './HistoryView.module.css';
import page from '../page.module.css';

/** Aufeinanderfolgende Tage (bis heute oder gestern) mit ≥1 erledigtem Workout. */
function computeStreak(log: DailyLog): number {
  const hasComplete = (iso: string) =>
    Object.values(log[iso] ?? {}).some((e) => e.status === 'complete');

  // Heute zählt nur, wenn schon erledigt; sonst ab gestern weiterzählen.
  let streak = 0;
  let offset = hasComplete(todayISO()) ? 0 : 1;
  // Falls weder heute noch gestern: kein laufender Streak.
  if (offset === 1 && !hasComplete(isoDaysAgo(1))) return 0;

  while (hasComplete(isoDaysAgo(offset))) {
    streak += 1;
    offset += 1;
  }
  return streak;
}

export function HistoryView() {
  const { state } = useApp();

  const dates = useMemo(
    () =>
      Object.keys(state.log)
        .filter((d) => Object.keys(state.log[d]).length > 0)
        .sort()
        .reverse(),
    [state.log],
  );

  const streak = useMemo(() => computeStreak(state.log), [state.log]);

  return (
    <div className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>Verlauf</h1>
        <p className={page.subtitle}>Dein Trainings-Tagebuch.</p>
      </header>

      <div className={styles.streak}>
        <span
          className={styles.streakRing}
          style={{ '--p': Math.min(streak, 7) * (100 / 7) } as CSSProperties}
        >
          <span className={styles.streakIcon}>
            <IconFlame size={28} />
          </span>
        </span>
        <div>
          <motion.div
            key={streak}
            className={styles.streakNum}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springPop}
          >
            {streak}
            <span className={styles.streakUnit}>
              {streak === 1 ? 'Tag' : 'Tage'}
            </span>
          </motion.div>
          <div className={styles.streakLabel}>
            {streak > 0 ? 'aktuelle Serie' : 'Noch keine Serie — leg heute los.'}
          </div>
        </div>
      </div>

      {dates.length === 0 ? (
        <EmptyState
          title="Noch keine Einträge"
          text="Sobald du Workouts als erledigt oder nicht erledigt markierst, erscheinen sie hier."
        />
      ) : (
        <motion.div
          className={styles.days}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {dates.map((date) => {
            const entries = Object.values(state.log[date]);
            return (
              <motion.section
                key={date}
                className={styles.day}
                variants={staggerItem}
              >
                <h2 className={styles.dayDate}>{formatShortFromISO(date)}</h2>
                <div className={styles.entries}>
                  {entries.map((entry, i) => (
                    <HistoryEntry key={i} entry={entry} />
                  ))}
                </div>
              </motion.section>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

function HistoryEntry({ entry }: { entry: LogEntry }) {
  const complete = entry.status === 'complete';
  return (
    <div className={styles.entry}>
      <span
        className={`${styles.mark} ${complete ? styles.markComplete : styles.markSkipped}`}
      >
        {complete ? <IconCheck size={15} /> : <IconSkip size={15} />}
      </span>
      <div className={styles.entryBody}>
        <div className={styles.entryName}>{entry.workoutName}</div>
        <div className={styles.entryStatus}>
          {complete ? 'Erledigt' : 'Nicht erledigt'}
        </div>
        {entry.note && <div className={styles.entryNote}>{entry.note}</div>}
      </div>
    </div>
  );
}
