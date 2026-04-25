'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

type Props = {
  words: string[];
  intervalMs?: number;
  className?: string;
};

export function RotatingWord({ words, intervalMs = 2400, className }: Props) {
  const [i, setI] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs, prefersReduced]);

  const widest = words.reduce((a, b) => (a.length >= b.length ? a : b), '');

  return (
    <span
      className={`relative inline-grid align-baseline ${className ?? ''}`}
      style={{ gridTemplateAreas: '"slot"' }}
    >
      <span aria-hidden className="invisible" style={{ gridArea: 'slot' }}>
        {widest}
      </span>
      <span style={{ gridArea: 'slot' }} className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.em
            key={words[i]}
            className="absolute inset-0 italic"
            initial={prefersReduced ? false : { opacity: 0, y: '0.3em' }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: '-0.3em' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {words[i]}
          </motion.em>
        </AnimatePresence>
      </span>
    </span>
  );
}
