import Link from 'next/link';

import { requireAdmin } from '@/lib/auth/require-admin';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="mb-10 flex items-baseline justify-between border-b pb-4">
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">Admin</p>
          <h1 className="font-serif text-3xl">Backoffice</h1>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin" className="hover:text-foreground text-muted-foreground">
            Accueil
          </Link>
          <Link href="/admin/shops" className="hover:text-foreground text-muted-foreground">
            Shops
          </Link>
          <Link href="/admin/roasters" className="hover:text-foreground text-muted-foreground">
            Torréfacteurs
          </Link>
          <Link href="/admin/claims" className="hover:text-foreground text-muted-foreground">
            Revendications
          </Link>
          <Link href="/admin/suggestions" className="hover:text-foreground text-muted-foreground">
            Propositions
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
