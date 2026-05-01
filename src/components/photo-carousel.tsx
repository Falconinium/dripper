'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

type Photo = { url: string; alt?: string };

export function PhotoCarousel({
  photos,
  name,
  priority,
}: {
  photos: Photo[];
  name: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const count = photos.length;
  const go = useCallback(
    (i: number) => {
      if (!count) return;
      const next = (i + count) % count;
      setIndex(next);
      trackRef.current?.scrollTo({
        left: trackRef.current.clientWidth * next,
        behavior: 'smooth',
      });
    },
    [count],
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (!w) return;
      const i = Math.round(el.scrollLeft / w);
      setIndex(i);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  if (!count) return null;

  return (
    <div
      className="relative mt-12 w-full overflow-hidden rounded-md"
      role="region"
      aria-roledescription="carousel"
      aria-label={`Photos de ${name}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          go(index + 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          go(index - 1);
        }
      }}
      tabIndex={0}
    >
      <div
        ref={trackRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          if (start === null) return;
          const end = e.changedTouches[0]?.clientX ?? start;
          const delta = end - start;
          if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
          touchStartX.current = null;
        }}
      >
        {photos.map((p, i) => (
          <div
            key={p.url}
            className="relative aspect-[16/9] w-full shrink-0 snap-center overflow-hidden bg-black"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
          >
            <Image
              src={p.url}
              alt=""
              aria-hidden
              fill
              className="hidden object-cover scale-110 blur-2xl opacity-60 md:block"
              sizes="(min-width: 1024px) 64rem, 100vw"
              priority={i === 0 ? Boolean(priority) : false}
              loading={priority && i === 0 ? 'eager' : 'lazy'}
            />
            <Image
              src={p.url}
              alt={p.alt ?? name}
              fill
              className="object-cover md:object-contain"
              sizes="(min-width: 1024px) 64rem, 100vw"
              priority={i === 0 ? Boolean(priority) : false}
              fetchPriority={priority && i === 0 ? 'high' : 'auto'}
              loading={priority && i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Photo précédente"
            onClick={() => go(index - 1)}
            className="bg-background/80 hover:bg-background border-border absolute top-1/2 left-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur transition-colors md:flex"
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            aria-label="Photo suivante"
            onClick={() => go(index + 1)}
            className="bg-background/80 hover:bg-background border-border absolute top-1/2 right-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur transition-colors md:flex"
          >
            <span aria-hidden>›</span>
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Aller à la photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'bg-background w-5' : 'bg-background/60 w-1.5'
                }`}
              />
            ))}
          </div>

          <div className="bg-background/80 border-border text-foreground absolute top-3 right-3 rounded-full border px-2 py-0.5 text-xs tabular-nums backdrop-blur">
            {index + 1} / {count}
          </div>
        </>
      ) : null}
    </div>
  );
}
