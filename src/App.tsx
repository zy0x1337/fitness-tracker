import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './store/AppContext';
import { TabBar, type TabId } from './components/TabBar';
import {
  IconMonitor,
  IconMoon,
  IconSun,
  LogoMark,
} from './components/icons';
import { tabVariants } from './lib/motion';
import { DailyView } from './features/daily/DailyView';
import { PlanView } from './features/plan/PlanView';
import { HistoryView } from './features/history/HistoryView';
import type { ThemePref } from './store/types';
import styles from './App.module.css';

const THEME_ORDER: ThemePref[] = ['light', 'dark', 'system'];

const THEME_ICON: Record<ThemePref, ReactNode> = {
  light: <IconSun />,
  dark: <IconMoon />,
  system: <IconMonitor />,
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
            <LogoMark size={22} />
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

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {tab === 'daily' && <DailyView onGoToPlan={() => setTab('plan')} />}
            {tab === 'plan' && <PlanView />}
            {tab === 'history' && <HistoryView />}
          </motion.div>
        </AnimatePresence>
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
