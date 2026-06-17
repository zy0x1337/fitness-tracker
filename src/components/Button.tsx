import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { tapScale } from '../lib/motion';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
  > {
  variant?: Variant;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const reduce = useReducedMotion();
  const classes = [
    styles.btn,
    styles[variant],
    size === 'sm' && styles.sm,
    fullWidth && styles.full,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      className={classes}
      whileTap={reduce ? undefined : tapScale}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
