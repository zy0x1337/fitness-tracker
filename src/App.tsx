import { useEffect, useState, type ReactNode } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { TabBar, type TabId } from './components/TabBar';
import { DailyView } from './features/daily/DailyView';
import { PlanView } from './features/plan/PlanView';
import { HistoryView } from './features/history/HistoryView';
import type { ThemePref } from './store/types';
import styles from './App.module.css';

const THEME_ORDER: ThemePref[] = ['light', 'dark', 'system'];

const THEME_ICON: Record<ThemePref, ReactNode> = {
  light: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  dark: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 13.5A8 8 0 0 1 10.5 4 7 7 0 1 0 20 13.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
  system: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4.5"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 20h7M12 16.5V20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const THEME_LABEL: Record<ThemePref, string> = {
  light: 'Hell',
  dark: 'Dunkel',
  system: 'System',
};

function Shell() {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState<TabId>('daily');

  // Theme auf das Dokument anwenden.
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  function cycleTheme() {
    const idx = THEME_ORDER.indexOf(state.theme);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    dispatch({ type: 'SET_THEME', theme: next });
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <span className={styles.brand}>
          <span className={styles.logo}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 9v6M7 7.5v9M20 9v6M17 7.5v9M7 12h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          Trainingsplan
        </span>
        <button
          type="button"
          className={styles.themeBtn}
          onClick={cycleTheme}
          aria-label={`Theme: ${THEME_LABEL[state.theme]} — wechseln`}
          title={`Theme: ${THEME_LABEL[state.theme]}`}
        >
          {THEME_ICON[state.theme]}
        </button>
      </header>

      <main className={styles.content} key={tab}>
        {tab === 'daily' && <DailyView onGoToPlan={() => setTab('plan')} />}
        {tab === 'plan' && <PlanView />}
        {tab === 'history' && <HistoryView />}
      </main>

      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
