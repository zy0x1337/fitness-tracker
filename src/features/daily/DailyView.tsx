import { useApp } from '../../store/AppContext';
import { formatLongDate, todayISO, todayWeekday } from '../../lib/date';
import { EmptyState } from '../../components/EmptyState';
import { DailyWorkoutCard } from './DailyWorkoutCard';
import styles from './DailyView.module.css';
import page from '../page.module.css';

export function DailyView({ onGoToPlan }: { onGoToPlan: () => void }) {
  const { state } = useApp();
  const weekday = todayWeekday();
  const date = todayISO();
  const workouts = state.plan[weekday] ?? [];
  const dayLog = state.log[date] ?? {};

  const doneCount = workouts.filter(
    (w) => dayLog[w.id]?.status === 'complete',
  ).length;

  return (
    <div className={page.page}>
      <header className={page.header}>
        <p className={page.eyebrow}>{formatLongDate(new Date())}</p>
        <h1 className={page.title}>Heute</h1>
        {workouts.length > 0 && (
          <div className={styles.summary}>
            <span className={styles.summaryDot} />
            {doneCount} von {workouts.length} erledigt
          </div>
        )}
      </header>

      {workouts.length === 0 ? (
        <EmptyState
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3a6 6 0 0 0-6 6c0 4 6 9 6 9s6-5 6-9a6 6 0 0 0-6-6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                opacity="0.5"
              />
              <circle cx="12" cy="9" r="1.6" fill="currentColor" opacity="0.5" />
            </svg>
          }
          title="Ruhetag"
          text="Für heute ist kein Workout geplant. Erhol dich gut — oder ergänze deinen Wochenplan."
        />
      ) : (
        <div className={styles.list}>
          {workouts.map((w) => (
            <DailyWorkoutCard
              key={w.id}
              workout={w}
              entry={dayLog[w.id]}
              date={date}
            />
          ))}
        </div>
      )}

      {workouts.length === 0 && (
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={onGoToPlan}
            className={page.eyebrow}
            style={{ background: 'none', textDecoration: 'underline' }}
          >
            Zum Wochenplan
          </button>
        </div>
      )}
    </div>
  );
}
