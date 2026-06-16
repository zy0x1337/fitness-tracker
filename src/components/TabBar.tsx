import type { ReactNode } from 'react';
import styles from './TabBar.module.css';

export type TabId = 'daily' | 'plan' | 'history';

interface TabDef {
  id: TabId;
  label: string;
  icon: ReactNode;
}

const TABS: TabDef[] = [
  {
    id: 'daily',
    label: 'Heute',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 7v5l3 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: 'plan',
    label: 'Wochenplan',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="3.5"
          y="5"
          width="17"
          height="15.5"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M3.5 9.5h17M8 3.5v3M16 3.5v3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'Verlauf',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12a8 8 0 1 0 2.5-5.8M4 4v3.5h3.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 8v4.2l2.8 1.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

interface TabBarProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className={styles.bar}>
      <div className={styles.inner}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
            onClick={() => onChange(tab.id)}
            aria-current={active === tab.id ? 'page' : undefined}
          >
            <span className={styles.icon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
