import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { formatLongDate, todayISO, todayWeekday } from '../../lib/date';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import { IconPlan, IconRest } from '../../components/icons';
import { staggerContainer, staggerItem } from '../../lib/motion';
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
          <div className={styles.progress}>
            <div className={styles.segments} aria-hidden="true">
              {workouts.map((w, i) => (
                <span
                  key={w.id}
                  className={`${styles.segment} ${
                    i < doneCount ? styles.segmentOn : ''
                  }`}
                />
              ))}
            </div>
            <span className={styles.progressLabel}>
              <b>{doneCount}</b>&nbsp;/&nbsp;{workouts.length} erledigt
            </span>
          </div>
        )}
      </header>

      {workouts.length === 0 ? (
        <>
          <EmptyState
            icon={<IconRest size={40} style={{ opacity: 0.55 }} />}
            title="Ruhetag"
            text="Für heute ist kein Workout geplant. Erhol dich gut — oder ergänze deinen Wochenplan."
          />
          <div className={styles.emptyAction}>
            <Button type="button" variant="primary" onClick={onGoToPlan}>
              <IconPlan size={18} />
              Zum Wochenplan
            </Button>
          </div>
        </>
      ) : (
        <motion.div
          className={styles.list}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {workouts.map((w) => (
            <motion.div key={w.id} variants={staggerItem}>
              <DailyWorkoutCard workout={w} entry={dayLog[w.id]} date={date} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
