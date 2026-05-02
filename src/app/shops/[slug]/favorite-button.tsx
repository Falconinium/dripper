'use client';

import { Heart } from 'lucide-react';
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

  const label = !authed
    ? 'Se connecter pour ajouter aux favoris'
    : isFavorite
      ? 'Retirer des favoris'
      : 'Ajouter aux favoris';

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
      aria-label={label}
      className="border-border hover:bg-muted/40 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors disabled:opacity-60"
    >
      <Heart
        size={16}
        strokeWidth={1.8}
        fill={isFavorite ? 'currentColor' : 'none'}
        aria-hidden
      />
      <span className="hidden sm:inline">
        {!authed
          ? 'Se connecter'
          : isFavorite
            ? 'Dans mes favoris'
            : 'Ajouter aux favoris'}
      </span>
    </button>
  );
}
