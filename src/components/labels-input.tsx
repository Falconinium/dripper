'use client';

import { useId, useMemo, useRef, useState } from 'react';

import { LABEL_SUGGESTIONS, normalizeLabel } from '@/lib/shops/labels';

export function LabelsInput({
  name = 'labels',
  defaultValue = [],
}: {
  name?: string;
  defaultValue?: string[];
}) {
  const [tags, setTags] = useState<string[]>(() =>
    defaultValue.map(normalizeLabel).filter(Boolean),
  );
  const [draft, setDraft] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const draftNormalized = normalizeLabel(draft);

  const matches = useMemo(() => {
    if (!draftNormalized) return [];
    return LABEL_SUGGESTIONS.filter(
      (s) => s.includes(draftNormalized) && !tags.includes(s),
    ).slice(0, 6);
  }, [draftNormalized, tags]);

  function add(value: string) {
    const v = normalizeLabel(value);
    if (!v) return;
    if (tags.includes(v)) {
      setDraft('');
      return;
    }
    setTags((prev) => [...prev, v]);
    setDraft('');
    setOpen(false);
    inputRef.current?.focus();
  }

  function remove(value: string) {
    setTags((prev) => prev.filter((t) => t !== value));
  }

  return (
    <div className="space-y-2">
      {tags.map((t) => (
        <input key={t} type="hidden" name={name} value={t} />
      ))}

      <div className="border-input bg-background flex flex-wrap items-center gap-2 rounded-md border px-2 py-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="bg-foreground text-background inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
          >
            {t}
            <button
              type="button"
              onClick={() => remove(t)}
              aria-label={`Retirer ${t}`}
              className="hover:text-background/70"
            >
              ×
            </button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[140px]">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                if (draftNormalized) add(draftNormalized);
              } else if (e.key === 'Backspace' && !draft && tags.length) {
                setTags((prev) => prev.slice(0, -1));
              }
            }}
            placeholder={tags.length ? '' : 'Ex. bio, direct trade…'}
            className="w-full bg-transparent py-1 text-sm outline-none"
            role="combobox"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={open && matches.length > 0}
          />

          {open && matches.length > 0 ? (
            <ul
              id={listId}
              role="listbox"
              className="border-border bg-popover absolute top-full left-0 z-10 mt-1 w-full max-w-xs overflow-hidden rounded-md border shadow-md"
            >
              {matches.map((m) => (
                <li key={m} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => add(m)}
                    className="hover:bg-muted/60 w-full px-3 py-2 text-left text-sm"
                  >
                    {m}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Tape pour ajouter — Entrée valide. Suggestions : bio, direct trade,
        single origin, vegan…
      </p>
    </div>
  );
}
