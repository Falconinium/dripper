'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Props = {
  items: string[];
  speed?: number;
  mobileSpeed?: number;
  className?: string;
};

export function Marquee({ items, speed = 40, mobileSpeed = 200, className }: Props) {
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  const loop = [...items, ...items];
  const effectiveSpeed = isMobile ? mobileSpeed : speed;
  const duration = Math.max(10, items.length * (60 / effectiveSpeed) * 4);

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
        key={duration}
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
