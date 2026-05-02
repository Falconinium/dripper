'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-6 py-24">
      <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
        Erreur
      </p>
      <h1 className="font-serif text-4xl leading-[1.05] md:text-5xl">
        Quelque chose s&rsquo;est <em className="italic">cassé.</em>
      </h1>
      <p className="text-muted-foreground mt-6 max-w-prose leading-relaxed">
        Une erreur inattendue est survenue. Vous pouvez réessayer ou revenir à l&rsquo;accueil.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          type="button"
          className="border-border hover:bg-muted/40 inline-flex items-center rounded-full border px-4 py-2 text-sm transition-colors"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm underline-offset-4 hover:underline"
        >
          Retour à l&rsquo;accueil
        </Link>
      </div>
      {error.digest ? (
        <p className="text-muted-foreground mt-6 text-xs">Réf. {error.digest}</p>
      ) : null}
    </main>
  );
}
