import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { IconHistory, IconPlan, IconToday, type IconProps } from './icons';
import { springSoft } from '../lib/motion';
import styles from './TabBar.module.css';

export type TabId = 'daily' | 'plan' | 'history';

interface TabDef {
  id: TabId;
  label: string;
  Icon: ComponentType<IconProps>;
}

const TABS: TabDef[] = [
  { id: 'daily', label: 'Heute', Icon: IconToday },
  { id: 'plan', label: 'Wochenplan', Icon: IconPlan },
  { id: 'history', label: 'Verlauf', Icon: IconHistory },
];

interface TabBarProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className={styles.bar}>
      <div className={styles.inner}>
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
              onClick={() => onChange(id)}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className={styles.pill}
                  transition={springSoft}
                />
              )}
              <span className={styles.icon}>
                <Icon size={22} />
              </span>
              <span className={styles.label}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
