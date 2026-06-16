import type { Category } from '../store/types';

export interface CategoryMeta {
  id: Category;
  label: string;
  /** gedämpfter Farbton als CSS-Custom-Property-Name (siehe theme.css) */
  tokenName: string;
}

// Gedämpfte, aufeinander abgestimmte Töne — keine grellen Vollfarben.
// Die konkreten Farbwerte liegen als Tokens in theme.css (Light + Dark).
export const CATEGORIES: CategoryMeta[] = [
  { id: 'push', label: 'Push', tokenName: '--cat-push' },
  { id: 'pull', label: 'Pull', tokenName: '--cat-pull' },
  { id: 'legs', label: 'Beine', tokenName: '--cat-legs' },
  { id: 'cardio', label: 'Cardio', tokenName: '--cat-cardio' },
  { id: 'core', label: 'Core', tokenName: '--cat-core' },
  { id: 'mobility', label: 'Mobility', tokenName: '--cat-mobility' },
  { id: 'custom', label: 'Sonstiges', tokenName: '--cat-custom' },
];

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function categoryMeta(id: Category): CategoryMeta {
  return BY_ID.get(id) ?? CATEGORIES[CATEGORIES.length - 1];
}
