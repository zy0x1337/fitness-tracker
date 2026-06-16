import type { CSSProperties } from 'react';
import type { Category } from '../store/types';
import { categoryMeta } from '../lib/categories';
import styles from './Chip.module.css';

export function CategoryChip({ category }: { category: Category }) {
  const meta = categoryMeta(category);
  const style = { '--chip-color': `var(${meta.tokenName})` } as CSSProperties;

  return (
    <span className={styles.chip} style={style}>
      <span className={styles.dot} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
