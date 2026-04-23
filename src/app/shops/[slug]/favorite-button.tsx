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
      <CoffeeCupIcon filled={isFavorite} />
      <span className="hidden sm:inline">
        {!authed
          ? 'Se connecter pour enregistrer'
          : isFavorite
            ? 'Enregistré'
            : 'Enregistrer'}
      </span>
    </button>
  );
}

function CoffeeCupIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Z" />
      <path d="M16 11h2a2 2 0 0 1 0 4h-2" fill="none" />
      <path d="M8 3c0 1 1 1.5 1 2.5S8 7 8 8" fill="none" />
      <path d="M12 3c0 1 1 1.5 1 2.5S12 7 12 8" fill="none" />
    </svg>
  );
}
