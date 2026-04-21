'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

type City = { slug: string; name: string; count: number };

export function CitySearch({ cities }: { cities: City[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const normalized = query
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  const matches = useMemo(() => {
    if (!normalized) return cities.slice(0, 8);
    return cities
      .filter((c) => {
        const nn = c.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
        return nn.includes(normalized);
      })
      .slice(0, 8);
  }, [cities, normalized]);

  const go = (slug: string) => {
    setOpen(false);
    router.push(`/shops?city=${encodeURIComponent(slug)}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const picked = matches[activeIndex] ?? matches[0];
    if (picked) go(picked.slug);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border-border bg-background relative flex w-full max-w-xl items-center gap-2 rounded-full border p-2 shadow-sm"
    >
      <div className="flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
              setOpen(true);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          placeholder="Paris, Lyon, Marseille…"
          className="w-full bg-transparent px-4 py-2 text-base outline-none placeholder:text-muted-foreground"
          role="combobox"
          aria-expanded={open}
          aria-controls="city-options"
          aria-autocomplete="list"
        />
      </div>
      <Button type="submit" size="lg" className="rounded-full">
        Chercher
      </Button>

      {open && matches.length > 0 ? (
        <ul
          id="city-options"
          role="listbox"
          className="border-border bg-background absolute top-full left-0 right-0 z-10 mt-2 max-h-80 overflow-auto rounded-md border shadow-lg"
        >
          {matches.map((c, i) => (
            <li
              key={c.slug}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                go(c.slug);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex cursor-pointer items-center justify-between px-4 py-3 text-sm ${
                i === activeIndex ? 'bg-muted' : ''
              }`}
            >
              <span>{c.name}</span>
              <span className="text-muted-foreground text-xs">
                {c.count} shop{c.count > 1 ? 's' : ''}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
