import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

export default async function AdminHome() {
  const supabase = await createClient();
  const [{ count: shopsCount }, { count: pendingClaims }, { count: suggestionsCount }] =
    await Promise.all([
      supabase.from('shops').select('*', { count: 'exact', head: true }),
      supabase
        .from('shop_claims')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase.from('shop_suggestions').select('*', { count: 'exact', head: true }),
    ]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link
          href="/admin/shops"
          className="border-border hover:bg-muted/40 rounded-md border p-6 transition-colors"
        >
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Shops</p>
          <p className="mt-2 font-serif text-4xl">{shopsCount ?? 0}</p>
          <p className="text-muted-foreground mt-2 text-sm">Référencés</p>
        </Link>
        <Link
          href="/admin/claims"
          className="border-border hover:bg-muted/40 rounded-md border p-6 transition-colors"
        >
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            Revendications
          </p>
          <p className="mt-2 font-serif text-4xl">{pendingClaims ?? 0}</p>
          <p className="text-muted-foreground mt-2 text-sm">En attente</p>
        </Link>
        <Link
          href="/admin/suggestions"
          className="border-border hover:bg-muted/40 rounded-md border p-6 transition-colors"
        >
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            Propositions
          </p>
          <p className="mt-2 font-serif text-4xl">{suggestionsCount ?? 0}</p>
          <p className="text-muted-foreground mt-2 text-sm">À examiner</p>
        </Link>
      </div>
    </div>
  );
}
