import Link from 'next/link';

import { HeaderAccountMenu } from '@/components/header-account-menu';
import { HeaderMobileMenu } from '@/components/header-mobile-menu';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { createClient } from '@/lib/supabase/server';

const navLinks = [
  { href: '/selection', label: 'Sélection' },
  { href: '/guides', label: 'Guides' },
];

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    isAdmin = profile?.role === 'admin';
  }

  const accountHref = user ? '/mon-compte' : '/connexion';
  const accountLabel = user ? 'Mon compte' : 'Connexion';

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user ? (
              <li>
                <Link
                  href="/mes-favoris"
                  className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                >
                  Mes favoris
                </Link>
              </li>
            ) : null}
            <li>
              {user ? (
                <HeaderAccountMenu isAdmin={isAdmin} />
              ) : (
                <Link
                  href={accountHref}
                  className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                >
                  {accountLabel}
                </Link>
              )}
            </li>
          </ul>
          <ThemeToggle />
          <HeaderMobileMenu
            links={navLinks}
            accountHref={accountHref}
            accountLabel={accountLabel}
            showFavorites={!!user}
            isLoggedIn={!!user}
            isAdmin={isAdmin}
          />
        </nav>
      </div>
    </header>
  );
}
