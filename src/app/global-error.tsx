'use client';

/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="fr">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
          padding: '4rem 1.5rem',
          maxWidth: '40rem',
          marginInline: 'auto',
        }}
      >
        <p
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            opacity: 0.6,
            marginBottom: '0.75rem',
          }}
        >
          Erreur critique
        </p>
        <h1 style={{ fontSize: '2.25rem', lineHeight: 1.1, margin: 0 }}>
          L&rsquo;application n&rsquo;a pas pu démarrer.
        </h1>
        <p style={{ marginTop: '1.5rem', lineHeight: 1.6, opacity: 0.7 }}>
          Veuillez recharger la page. Si le problème persiste, contactez-nous.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={reset}
            type="button"
            style={{
              border: '1px solid currentColor',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>
          <a href="/" style={{ alignSelf: 'center', opacity: 0.6 }}>
            Retour à l&rsquo;accueil
          </a>
        </div>
        {error.digest ? (
          <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', opacity: 0.5 }}>
            Réf. {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  );
}
