import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminShopsList() {
  const supabase = await createClient();
  const { data: shops } = await supabase
    .from('shops')
    .select('id, name, city, status, is_selection, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Shops</h2>
        <Link
          href="/admin/shops/new"
          className="border-foreground hover:bg-foreground hover:text-background rounded-md border px-4 py-2 text-sm transition-colors"
        >
          Nouveau
        </Link>
      </div>

      {!shops?.length ? (
        <p className="text-muted-foreground text-sm">Aucun shop. Créez-en un.</p>
      ) : (
        <div className="border-border overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-left text-xs tracking-[0.15em] uppercase">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Sélection</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <tr key={s.id} className="border-border border-t">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.city ?? '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.status}</td>
                  <td className="px-4 py-3">{s.is_selection ? '✓' : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/shops/${s.id}`}
                      className="hover:text-foreground text-muted-foreground"
                    >
                      Éditer →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
