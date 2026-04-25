'use client';

import { motion, useReducedMotion } from 'motion/react';

type Props = {
  items: string[];
  speed?: number;
  className?: string;
};

export function Marquee({ items, speed = 40, className }: Props) {
  const prefersReduced = useReducedMotion();
  const loop = [...items, ...items];
  const duration = Math.max(20, items.length * (60 / speed) * 4);

  if (prefersReduced) {
    return (
      <div className={`overflow-hidden ${className ?? ''}`}>
        <div className="flex gap-10 px-6">
          {items.map((it, i) => (
            <span
              key={`${it}-${i}`}
              className="text-muted-foreground font-serif text-2xl whitespace-nowrap md:text-3xl"
            >
              {it}
              <span aria-hidden className="text-muted-foreground/40 ml-10">
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className ?? ''}`}
      style={{
        maskImage:
          'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {loop.map((it, i) => (
          <span
            key={`${it}-${i}`}
            className="text-muted-foreground font-serif text-2xl whitespace-nowrap md:text-3xl"
          >
            {it}
            <span aria-hidden className="text-muted-foreground/40 ml-10">
              ·
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
