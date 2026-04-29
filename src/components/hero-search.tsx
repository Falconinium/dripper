'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

type City = { slug: string; name: string; count: number };
type Shop = { slug: string; name: string; city: string | null };

type Suggestion =
  | { kind: 'city'; slug: string; name: string; count: number }
  | { kind: 'shop'; slug: string; name: string; city: string | null };

const METHODS: { key: string; label: string }[] = [
  { key: 'espresso', label: 'Espresso' },
  { key: 'v60', label: 'V60' },
  { key: 'aeropress', label: 'Aeropress' },
  { key: 'chemex', label: 'Chemex' },
];

function deburr(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function HeroSearch({ cities, shops }: { cities: City[]; shops: Shop[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [methods, setMethods] = useState<string[]>([]);
  const [onlySelection, setOnlySelection] = useState(false);

  const q = deburr(query.trim());

  const matches = useMemo<Suggestion[]>(() => {
    if (!q) {
      return cities.slice(0, 6).map((c) => ({ kind: 'city', ...c }));
    }
    const cityMatches: Suggestion[] = cities
      .filter((c) => deburr(c.name).includes(q))
      .slice(0, 4)
      .map((c) => ({ kind: 'city', ...c }));
    const shopMatches: Suggestion[] = shops
      .filter((s) => deburr(s.name).includes(q))
      .slice(0, 4)
      .map((s) => ({ kind: 'shop', slug: s.slug, name: s.name, city: s.city }));
    return [...cityMatches, ...shopMatches];
  }, [q, cities, shops]);

  const buildShopsHref = (citySlug?: string) => {
    const params = new URLSearchParams();
    if (citySlug) params.set('city', citySlug);
    for (const m of methods) params.append('method', m);
    if (onlySelection) params.set('selection', '1');
    const qs = params.toString();
    return `/shops${qs ? `?${qs}` : ''}`;
  };

  const pick = (s: Suggestion) => {
    setOpen(false);
    if (s.kind === 'shop') {
      router.push(`/shops/${s.slug}`);
    } else {
      router.push(buildShopsHref(s.slug));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q) {
      const picked = matches[activeIndex] ?? matches[0];
      if (picked) {
        pick(picked);
        return;
      }
    }
    router.push(buildShopsHref());
  };

  const toggleMethod = (key: string) => {
    setMethods((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={onSubmit}
        className="border-border bg-background relative flex w-full items-center gap-2 rounded-full border p-2 shadow-sm"
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
            placeholder="Ville ou shop"
            className="placeholder:text-muted-foreground w-full bg-transparent px-4 py-2 text-base outline-none"
            role="combobox"
            aria-expanded={open}
            aria-controls="hero-options"
            aria-autocomplete="list"
          />
        </div>
        <Button type="submit" size="lg" className="rounded-full">
          Chercher
        </Button>

        {open && matches.length > 0 ? (
          <ul
            id="hero-options"
            role="listbox"
            className="border-border bg-background absolute top-full right-0 left-0 z-10 mt-2 max-h-80 overflow-auto rounded-md border shadow-lg"
          >
            {matches.map((s, i) => (
              <li
                key={`${s.kind}-${s.slug}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(s);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm ${
                  i === activeIndex ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="text-muted-foreground text-[10px] tracking-[0.15em] uppercase"
                    aria-hidden
                  >
                    {s.kind === 'city' ? 'Ville' : 'Shop'}
                  </span>
                  <span className="truncate">{s.name}</span>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {s.kind === 'city'
                    ? `${s.count} shop${s.count > 1 ? 's' : ''}`
                    : s.city}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={onlySelection}
          onClick={() => setOnlySelection((v) => !v)}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            onlySelection
              ? 'bg-foreground text-background border-foreground'
              : 'border-border hover:bg-muted/40'
          }`}
        >
          Sélection Dripper
        </button>
        <span className="bg-border h-4 w-px" aria-hidden />
        {METHODS.map((m) => {
          const active = methods.includes(m.key);
          const mobileHidden = m.key !== 'espresso' && m.key !== 'v60';
          return (
            <button
              key={m.key}
              type="button"
              aria-pressed={active}
              onClick={() => toggleMethod(m.key)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                mobileHidden ? 'hidden md:inline-flex' : ''
              } ${
                active
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
