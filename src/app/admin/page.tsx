import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

export default async function AdminHome() {
  const supabase = await createClient();
  const { count } = await supabase.from('shops').select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link
          href="/admin/shops"
          className="border-border hover:bg-muted/40 rounded-md border p-6 transition-colors"
        >
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Shops</p>
          <p className="mt-2 font-serif text-4xl">{count ?? 0}</p>
          <p className="text-muted-foreground mt-2 text-sm">Référencés</p>
        </Link>
      </div>
    </div>
  );
}
