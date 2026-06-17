import type { Transition, Variants } from 'framer-motion';

/** Gemeinsame Easing-Kurve (passt zum CSS-Token --ease). */
export const EASE = [0.22, 0.61, 0.36, 1] as const;

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
};

export const springPop: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 20,
};

/** Tab-Inhalt: sanftes Ein-/Ausblenden mit leichtem Y-Shift. */
export const tabVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: EASE } },
};

/** Container, der seine Kinder gestaffelt einblendet. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE } },
};

/** Auf-/Zuklappen (Höhe + Opacity) für Dropdown-Panels. */
export const collapseVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: { height: { duration: 0.26, ease: EASE }, opacity: { duration: 0.2 } },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { height: { duration: 0.22, ease: EASE }, opacity: { duration: 0.14 } },
  },
};

/** Tap-Feedback. */
export const tapScale = { scale: 0.97 };
