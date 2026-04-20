import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminRoastersList() {
  const supabase = await createClient();
  const { data: roasters } = await supabase
    .from('roasters')
    .select('id, name, city, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Torréfacteurs</h2>
        <Link
          href="/admin/roasters/new"
          className="border-foreground hover:bg-foreground hover:text-background rounded-md border px-4 py-2 text-sm transition-colors"
        >
          Nouveau
        </Link>
      </div>

      {!roasters?.length ? (
        <p className="text-muted-foreground text-sm">Aucun torréfacteur.</p>
      ) : (
        <div className="border-border overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-left text-xs tracking-[0.15em] uppercase">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {roasters.map((r) => (
                <tr key={r.id} className="border-border border-t">
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.city ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/roasters/${r.id}`}
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
