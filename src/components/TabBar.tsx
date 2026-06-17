import type { ComponentType, CSSProperties } from 'react';
import { IconHistory, IconPlan, IconToday, type IconProps } from './icons';
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
  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => t.id === active),
  );

  // Die Pille ist genau ein dauerhaft vorhandenes Element und gleitet rein per
  // CSS-Transform (translateX). Position ergibt sich deterministisch aus dem
  // aktiven Index und der gleichen Spaltenbreite — kein Layout-Projection,
  // kein Mount/Unmount, daher kein „eckiges" Aufblitzen (auch auf Mobile).
  const innerStyle = {
    '--tab-count': TABS.length,
    '--active-index': activeIndex,
  } as CSSProperties;

  return (
    <nav className={styles.bar}>
      <div className={styles.inner} style={innerStyle}>
        <span className={styles.pill} aria-hidden="true" />
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
