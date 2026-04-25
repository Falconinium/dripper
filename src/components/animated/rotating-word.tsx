'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

type Props = {
  words: string[];
  typeMs?: number;
  holdMs?: number;
  eraseMs?: number;
  className?: string;
};

export function RotatingWord({
  words,
  typeMs = 90,
  holdMs = 1400,
  eraseMs = 50,
  className,
}: Props) {
  const [wordIdx, setWordIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<'typing' | 'erasing'>('typing');
  const prefersReduced = useReducedMotion();

  const widest = words.reduce((a, b) => (a.length >= b.length ? a : b), '');
  const shown = prefersReduced ? words[wordIdx] : typed;

  useEffect(() => {
    if (prefersReduced) return;

    const target = words[wordIdx];

    if (phase === 'typing') {
      if (typed.length < target.length) {
        const id = setTimeout(
          () => setTyped(target.slice(0, typed.length + 1)),
          typeMs,
        );
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setPhase('erasing'), holdMs);
      return () => clearTimeout(id);
    }

    if (typed.length > 0) {
      const id = setTimeout(() => setTyped(typed.slice(0, -1)), eraseMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setWordIdx((n) => (n + 1) % words.length);
      setPhase('typing');
    }, 0);
    return () => clearTimeout(id);
  }, [typed, phase, wordIdx, words, typeMs, holdMs, eraseMs, prefersReduced]);

  return (
    <span
      className={`relative inline-grid align-baseline whitespace-nowrap ${className ?? ''}`}
      style={{ gridTemplateAreas: '"slot"' }}
    >
      <span aria-hidden className="invisible" style={{ gridArea: 'slot' }}>
        {widest}
      </span>
      <span
        style={{ gridArea: 'slot' }}
        className="relative italic"
      >
        {shown}
        {!prefersReduced ? (
          <motion.span
            aria-hidden
            className="bg-foreground ml-[0.05em] inline-block w-[2px] align-middle"
            style={{ height: '0.85em' }}
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}
      </span>
    </span>
  );
}
