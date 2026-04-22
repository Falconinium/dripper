'use client';

import Link from 'next/link';
import { useState } from 'react';

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
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: inline pill bar */}
      <form className="mt-8 hidden md:block">
        {props.citySlug ? <input type="hidden" name="city" value={props.citySlug} /> : null}
        <FilterFields {...props} />
        <div className="mt-5 flex items-center gap-4">
          <button
            type="submit"
            className="bg-foreground text-background rounded-full px-5 py-2 text-sm transition-opacity hover:opacity-90"
          >
            Appliquer
          </button>
          {active > 0 ? (
            <Link
              href={props.resetHref}
              className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
            >
              Tout réinitialiser
            </Link>
          ) : null}
        </div>
      </form>

      {/* Mobile: trigger + Sheet */}
      <div className="mt-6 flex items-center gap-3 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
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
}: {
  name: string;
  value: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="border-border hover:bg-muted/40 has-[:checked]:bg-foreground has-[:checked]:text-background has-[:checked]:border-foreground cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors">
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
