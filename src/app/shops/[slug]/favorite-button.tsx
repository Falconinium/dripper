'use client';

import { useTransition } from 'react';

import { toggleFavorite } from './actions';

export function FavoriteButton({
  shopId,
  slug,
  isFavorite,
  authed,
}: {
  shopId: string;
  slug: string;
  isFavorite: boolean;
  authed: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await toggleFavorite(shopId, slug);
        })
      }
      disabled={isPending}
      aria-pressed={isFavorite}
      className="border-border hover:bg-muted/40 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors disabled:opacity-60"
    >
      <span aria-hidden>{isFavorite ? '♥' : '♡'}</span>
      {!authed
        ? 'Se connecter pour enregistrer'
        : isFavorite
          ? 'Enregistré'
          : 'Enregistrer'}
    </button>
  );
}
