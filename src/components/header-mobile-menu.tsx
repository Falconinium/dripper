'use client';

import Link from 'next/link';
import { useState } from 'react';

import { signOut } from '@/app/mon-compte/actions';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type NavLink = { href: string; label: string };

export function HeaderMobileMenu({
  links,
  accountHref,
  accountLabel,
  showFavorites,
  isLoggedIn,
  isAdmin,
}: {
  links: NavLink[];
  accountHref: string;
  accountLabel: string;
  showFavorites?: boolean;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Menu"
          className="hover:bg-muted/40 inline-flex size-9 items-center justify-center rounded-md transition-colors sm:hidden"
        >
          <MenuIcon />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 gap-0">
        <SheetHeader className="border-border border-b">
          <SheetTitle className="font-serif text-2xl">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="hover:bg-muted/40 rounded-md px-3 py-3 text-base transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-border my-2 border-t" />
          {showFavorites ? (
            <Link
              href="/mes-favoris"
              onClick={() => setOpen(false)}
              className="hover:bg-muted/40 rounded-md px-3 py-3 text-base transition-colors"
            >
              Mes favoris
            </Link>
          ) : null}
          <Link
            href={accountHref}
            onClick={() => setOpen(false)}
            className="hover:bg-muted/40 rounded-md px-3 py-3 text-base transition-colors"
          >
            {accountLabel}
          </Link>
          {isLoggedIn && isAdmin ? (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="hover:bg-muted/40 rounded-md px-3 py-3 text-base transition-colors"
            >
              Admin
            </Link>
          ) : null}
          {isLoggedIn ? (
            <form action={signOut}>
              <button
                type="submit"
                className="hover:bg-muted/40 w-full rounded-md px-3 py-3 text-left text-base transition-colors"
              >
                Se déconnecter
              </button>
            </form>
          ) : null}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
