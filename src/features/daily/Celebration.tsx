import { useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IconCheck } from '../../components/icons';
import { springPop } from '../../lib/motion';
import styles from './Celebration.module.css';

interface CelebrationProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

const COLORS = ['var(--success)', 'var(--accent)', 'var(--success)'];

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const distance = 46 + Math.random() * 34;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 6 + Math.random() * 6,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.06,
      duration: 0.6 + Math.random() * 0.35,
    };
  });
}

export function Celebration({ onComplete }: CelebrationProps) {
  const reduce = useReducedMotion();
  const particles = useMemo(() => (reduce ? [] : makeParticles(12)), [reduce]);

  // Selbst-Abbau nach Ablauf der Animation.
  useEffect(() => {
    const t = setTimeout(onComplete, reduce ? 600 : 950);
    return () => clearTimeout(t);
  }, [onComplete, reduce]);

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {!reduce && (
        <motion.span
          className={styles.ring}
          initial={{ opacity: 0.55, scale: 0.9 }}
          animate={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      )}

      <motion.span
        className={styles.badge}
        initial={{ scale: 0, rotate: -14, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={springPop}
      >
        <IconCheck size={26} />
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className={styles.particle}
            style={{ width: p.size, height: p.size, background: p.color }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
            transition={{ duration: p.duration, ease: 'easeOut', delay: p.delay }}
          />
        ))}
      </motion.span>
    </motion.div>
  );
}
