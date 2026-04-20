'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';

import { linkShopRoasters } from '../actions';

type Roaster = { id: string; name: string; city: string | null };
type Initial = { roaster_id: string; is_primary: boolean };

export function RoasterLinkForm({
  shopId,
  slug,
  roasters,
  initial,
}: {
  shopId: string;
  slug: string;
  roasters: Roaster[];
  initial: Initial[];
}) {
  const initialIds = new Set(initial.map((i) => i.roaster_id));
  const initialPrimary = initial.find((i) => i.is_primary)?.roaster_id ?? '';

  const [selected, setSelected] = useState<Set<string>>(new Set(initialIds));
  const [primary, setPrimary] = useState<string>(initialPrimary);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (primary === id) setPrimary('');
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const submit = () => {
    const fd = new FormData();
    selected.forEach((id) => fd.append('roaster_id', id));
    if (primary) fd.set('primary_roaster_id', primary);
    startTransition(async () => {
      const res = await linkShopRoasters(shopId, slug, fd);
      setStatus(res.status);
      setMessage(res.message ?? (res.status === 'success' ? 'Liens enregistrés.' : null));
    });
  };

  return (
    <div className="space-y-4">
      {!roasters.length ? (
        <p className="text-muted-foreground text-sm">
          Aucun torréfacteur. Créez-en dans{' '}
          <Link className="underline underline-offset-4" href="/admin/roasters/new">
            Nouveau torréfacteur
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-border divide-y">
          {roasters.map((r) => {
            const checked = selected.has(r.id);
            return (
              <li key={r.id} className="flex items-center justify-between gap-4 py-3">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(r.id)}
                    className="size-4"
                  />
                  <span>
                    {r.name}
                    {r.city ? (
                      <span className="text-muted-foreground ml-2 text-xs">{r.city}</span>
                    ) : null}
                  </span>
                </label>
                {checked ? (
                  <label className="text-muted-foreground flex items-center gap-2 text-xs">
                    <input
                      type="radio"
                      name="primary"
                      checked={primary === r.id}
                      onChange={() => setPrimary(r.id)}
                      className="size-4"
                    />
                    Principal
                  </label>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={submit} disabled={isPending}>
          {isPending ? 'Enregistrement…' : 'Enregistrer les liens'}
        </Button>
        {status === 'success' && message ? (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">{message}</span>
        ) : null}
        {status === 'error' && message ? (
          <span className="text-destructive text-sm">{message}</span>
        ) : null}
      </div>
    </div>
  );
}
