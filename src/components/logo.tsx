import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 ${className ?? ''}`}
      aria-label="Dripper — Accueil"
    >
      <svg viewBox="0 0 24 28" fill="none" aria-hidden="true" className="text-foreground h-6 w-5">
        <path
          d="M1 4 L23 4 L14 20 L10 20 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="26" r="1.25" fill="currentColor" />
      </svg>
      <span className="font-serif text-xl leading-none tracking-tight">Dripper</span>
    </Link>
  );
}
