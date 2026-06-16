import { useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { formatShortFromISO, isoDaysAgo, todayISO } from '../../lib/date';
import { EmptyState } from '../../components/EmptyState';
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

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12.5l4.2 4.2L19 7"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SkipIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M6 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

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
        <span className={styles.streakIcon}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 3c.5 3-1.5 4-2.8 5.5C9 10 8 11.5 8 13.5a4 4 0 0 0 8 .2c0-1.2-.4-2-.9-2.8.9.3 1.6 1 2 1.9.6 1.2.7 2.7.2 4-.9 2.4-3.3 4-5.9 4-3.3 0-6-2.5-6-5.8 0-2.4 1.3-4.2 2.8-5.8C10 7.3 12 6 13 3Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <div>
          <div className={styles.streakNum}>
            {streak} {streak === 1 ? 'Tag' : 'Tage'}
          </div>
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
        <div className={styles.days}>
          {dates.map((date) => {
            const entries = Object.values(state.log[date]);
            return (
              <section key={date} className={styles.day}>
                <h2 className={styles.dayDate}>{formatShortFromISO(date)}</h2>
                <div className={styles.entries}>
                  {entries.map((entry, i) => (
                    <HistoryEntry key={i} entry={entry} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
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
        {complete ? <CheckIcon /> : <SkipIcon />}
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
