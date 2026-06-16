import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import {
  type AppState,
  type LogStatus,
  type ThemePref,
  type Workout,
} from './types';
import { loadState, saveState } from './storage';

type Action =
  | { type: 'ADD_WORKOUT'; weekday: number; workout: Workout }
  | { type: 'UPDATE_WORKOUT'; weekday: number; workout: Workout }
  | { type: 'DELETE_WORKOUT'; weekday: number; workoutId: string }
  | { type: 'SET_STATUS'; date: string; workout: Workout; status: LogStatus }
  | { type: 'SET_NOTE'; date: string; workout: Workout; note: string }
  | { type: 'SET_THEME'; theme: ThemePref };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_WORKOUT': {
      const list = state.plan[action.weekday] ?? [];
      return {
        ...state,
        plan: { ...state.plan, [action.weekday]: [...list, action.workout] },
      };
    }

    case 'UPDATE_WORKOUT': {
      const list = state.plan[action.weekday] ?? [];
      return {
        ...state,
        plan: {
          ...state.plan,
          [action.weekday]: list.map((w) =>
            w.id === action.workout.id ? action.workout : w,
          ),
        },
      };
    }

    case 'DELETE_WORKOUT': {
      const list = state.plan[action.weekday] ?? [];
      return {
        ...state,
        plan: {
          ...state.plan,
          [action.weekday]: list.filter((w) => w.id !== action.workoutId),
        },
      };
    }

    case 'SET_STATUS': {
      const day = state.log[action.date] ?? {};
      const existing = day[action.workout.id];

      // Erneutes Tippen auf den aktiven Status setzt den Eintrag zurück …
      if (existing && existing.status === action.status && !existing.note) {
        const nextDay = { ...day };
        delete nextDay[action.workout.id];
        return { ...state, log: { ...state.log, [action.date]: nextDay } };
      }

      return {
        ...state,
        log: {
          ...state.log,
          [action.date]: {
            ...day,
            [action.workout.id]: {
              status: action.status,
              note: existing?.note,
              workoutName: action.workout.name,
              updatedAt: new Date().toISOString(),
            },
          },
        },
      };
    }

    case 'SET_NOTE': {
      const day = state.log[action.date] ?? {};
      const existing = day[action.workout.id];
      const note = action.note.trim();

      // Notiz leeren ohne gesetzten Status → Eintrag entfernen.
      if (!note && !existing?.status) {
        const nextDay = { ...day };
        delete nextDay[action.workout.id];
        return { ...state, log: { ...state.log, [action.date]: nextDay } };
      }

      return {
        ...state,
        log: {
          ...state.log,
          [action.date]: {
            ...day,
            [action.workout.id]: {
              status: existing?.status ?? 'skipped',
              note: note || undefined,
              workoutName: action.workout.name,
              updatedAt: new Date().toISOString(),
            },
          },
        },
      };
    }

    case 'SET_THEME':
      return { ...state, theme: action.theme };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Auto-Persistenz bei jeder State-Änderung.
  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
