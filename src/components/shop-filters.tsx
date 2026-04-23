'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type Option = { key: string; label: string };

export type ShopFiltersProps = {
  citySlug?: string | null;
  selectionChecked: boolean;
  methods: Option[];
  options: Option[];
  selectedMethods: string[];
  selectedOptions: string[];
  resetHref: string;
};

function countActive(p: ShopFiltersProps): number {
  return (
    (p.selectionChecked ? 1 : 0) + p.selectedMethods.length + p.selectedOptions.length
  );
}

export function ShopFilters(props: ShopFiltersProps) {
  const active = countActive(props);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popOpen) return;
    const onClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setPopOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [popOpen]);

  return (
    <>
      {/* Desktop: compact pill bar */}
      <form className="mt-8 hidden md:block">
        {props.citySlug ? <input type="hidden" name="city" value={props.citySlug} /> : null}
        <div className="border-border bg-background flex items-center gap-2 rounded-full border p-1.5 pl-5 shadow-sm">
          <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            Filtres
          </span>
          <div className="bg-border h-6 w-px" />
          <PillCheckbox
            name="selection"
            value="1"
            label="Sélection"
            defaultChecked={props.selectionChecked}
            compact
          />
          <div className="bg-border h-6 w-px" />
          <div className="relative" ref={popRef}>
            <button
              type="button"
              onClick={() => setPopOpen((v) => !v)}
              className="hover:bg-muted/60 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors"
              aria-expanded={popOpen}
            >
              <FilterIcon />
              Méthodes & options
              {props.selectedMethods.length + props.selectedOptions.length > 0 ? (
                <span className="bg-foreground text-background rounded-full px-1.5 text-[10px] tabular-nums">
                  {props.selectedMethods.length + props.selectedOptions.length}
                </span>
              ) : null}
            </button>
            <div
              className={`border-border bg-background absolute top-full left-0 z-50 mt-2 w-96 rounded-2xl border p-5 shadow-lg ${
                popOpen ? '' : 'pointer-events-none invisible opacity-0'
              }`}
            >
              <div className="space-y-5">
                <section>
                  <Legend>Méthodes</Legend>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {props.methods.map((m) => (
                      <PillCheckbox
                        key={m.key}
                        name="method"
                        value={m.key}
                        label={m.label}
                        defaultChecked={props.selectedMethods.includes(m.key)}
                      />
                    ))}
                  </div>
                </section>
                <section>
                  <Legend>Options</Legend>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {props.options.map((o) => (
                      <PillCheckbox
                        key={o.key}
                        name="option"
                        value={o.key}
                        label={o.label}
                        defaultChecked={props.selectedOptions.includes(o.key)}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {active > 0 ? (
              <Link
                href={props.resetHref}
                className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4"
              >
                Réinitialiser
              </Link>
            ) : null}
            <button
              type="submit"
              className="bg-foreground text-background rounded-full px-5 py-2 text-sm transition-opacity hover:opacity-90"
            >
              Appliquer
            </button>
          </div>
        </div>
      </form>

      <ActiveChips {...props} />

      {/* Mobile: trigger + Sheet */}
      <div className="mt-6 flex items-center gap-3 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="border-border hover:bg-muted/40 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
            >
              <FilterIcon />
              Filtres
              {active > 0 ? (
                <span className="bg-foreground text-background rounded-full px-1.5 text-[10px] tabular-nums">
                  {active}
                </span>
              ) : null}
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
            <SheetHeader className="border-border border-b">
              <SheetTitle className="font-serif text-2xl">Filtres</SheetTitle>
            </SheetHeader>
            <form className="flex-1 overflow-y-auto px-4 py-6">
              {props.citySlug ? (
                <input type="hidden" name="city" value={props.citySlug} />
              ) : null}
              <FilterFields {...props} stacked />
              <SheetFooter className="mt-8 flex-row gap-3 px-0">
                <button
                  type="submit"
                  className="bg-foreground text-background flex-1 rounded-full px-5 py-3 text-sm"
                >
                  Appliquer
                </button>
                {active > 0 ? (
                  <SheetClose asChild>
                    <Link
                      href={props.resetHref}
                      className="border-border flex items-center justify-center rounded-full border px-5 py-3 text-sm"
                    >
                      Réinitialiser
                    </Link>
                  </SheetClose>
                ) : null}
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {active > 0 ? (
          <Link
            href={props.resetHref}
            className="text-muted-foreground text-sm underline underline-offset-4"
          >
            Réinitialiser
          </Link>
        ) : null}
      </div>
    </>
  );
}

function ActiveChips({
  selectionChecked,
  methods,
  options,
  selectedMethods,
  selectedOptions,
}: ShopFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const methodLabel = (key: string) =>
    methods.find((m) => m.key === key)?.label ?? key;
  const optionLabel = (key: string) =>
    options.find((o) => o.key === key)?.label ?? key;

  const hrefWithout = (paramName: string, value?: string) => {
    const next = new URLSearchParams(searchParams?.toString() ?? '');
    if (value === undefined) {
      next.delete(paramName);
    } else {
      const values = next.getAll(paramName).filter((v) => v !== value);
      next.delete(paramName);
      for (const v of values) next.append(paramName, v);
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const chips: { label: string; href: string }[] = [];
  if (selectionChecked) {
    chips.push({ label: 'Sélection Dripper', href: hrefWithout('selection') });
  }
  for (const m of selectedMethods) {
    chips.push({ label: methodLabel(m), href: hrefWithout('method', m) });
  }
  for (const o of selectedOptions) {
    chips.push({ label: optionLabel(o), href: hrefWithout('option', o) });
  }

  if (!chips.length) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase">
        Actifs
      </span>
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          className="border-border hover:bg-muted/40 group inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors"
          aria-label={`Retirer le filtre ${chip.label}`}
        >
          {chip.label}
          <span
            aria-hidden
            className="text-muted-foreground group-hover:text-foreground text-sm leading-none"
          >
            ×
          </span>
        </Link>
      ))}
    </div>
  );
}

function FilterFields({
  selectionChecked,
  methods,
  options,
  selectedMethods,
  selectedOptions,
  stacked,
}: ShopFiltersProps & { stacked?: boolean }) {
  return (
    <div className={stacked ? 'space-y-8' : 'space-y-6'}>
      <section>
        <Legend>Label</Legend>
        <div className="mt-3">
          <PillCheckbox
            name="selection"
            value="1"
            label="Sélection Dripper"
            defaultChecked={selectionChecked}
          />
        </div>
      </section>

      <section>
        <Legend>Méthodes</Legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {methods.map((m) => (
            <PillCheckbox
              key={m.key}
              name="method"
              value={m.key}
              label={m.label}
              defaultChecked={selectedMethods.includes(m.key)}
            />
          ))}
        </div>
      </section>

      <section>
        <Legend>Options</Legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((o) => (
            <PillCheckbox
              key={o.key}
              name="option"
              value={o.key}
              label={o.label}
              defaultChecked={selectedOptions.includes(o.key)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function Legend({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase">{children}</p>
  );
}

function PillCheckbox({
  name,
  value,
  label,
  defaultChecked,
  compact,
}: {
  name: string;
  value: string;
  label: string;
  defaultChecked?: boolean;
  compact?: boolean;
}) {
  return (
    <label
      className={`border-border hover:bg-muted/40 has-[:checked]:bg-foreground has-[:checked]:text-background has-[:checked]:border-foreground cursor-pointer rounded-full border text-sm transition-colors ${
        compact ? 'px-3 py-1' : 'px-4 py-1.5'
      }`}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="sr-only"
      />
      {label}
    </label>
  );
}

function FilterIcon() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  );
}
