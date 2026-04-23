import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Refusée',
  cancelled: 'Annulée',
};

export default async function AdminClaimsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.status ?? 'pending';
  const supabase = await createClient();

  let query = supabase
    .from('shop_claims')
    .select(
      'id, status, created_at, full_name, pro_email, domain_verified_at, domain_skipped, shops(slug, name, city), profiles!shop_claims_user_id_fkey(username, display_name)',
    )
    .order('created_at', { ascending: false });

  if (filter !== 'all') {
    query = query.eq('status', filter);
  }

  const { data: claims } = await query;
  const items = claims ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-2xl">Revendications</h2>
        <nav className="flex gap-3 text-sm">
          <FilterLink current={filter} value="pending" label="En attente" />
          <FilterLink current={filter} value="approved" label="Approuvées" />
          <FilterLink current={filter} value="rejected" label="Refusées" />
          <FilterLink current={filter} value="all" label="Toutes" />
        </nav>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune demande.</p>
      ) : (
        <ul className="divide-border divide-y">
          {items.map((c) => {
            const shop = c.shops;
            const profile = c.profiles;
            if (!shop) return null;
            const verif = c.domain_verified_at
              ? 'Email vérifié'
              : c.domain_skipped
                ? 'Vérif manuelle'
                : 'Email non vérifié';
            return (
              <li key={c.id} className="py-4">
                <Link
                  href={`/admin/claims/${c.id}`}
                  className="hover:bg-muted/40 -mx-4 flex flex-col gap-2 rounded-md px-4 py-2 transition-colors md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-serif text-lg">{shop.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {shop.city ?? '—'} · demandé par{' '}
                      {profile?.display_name ?? profile?.username ?? '?'} (
                      {c.full_name}) · {c.pro_email}
                    </p>
                    <p className="text-muted-foreground mt-1 text-[11px]">
                      {new Date(c.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      · {verif}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterLink({
  current,
  value,
  label,
}: {
  current: string;
  value: string;
  label: string;
}) {
  const active = current === value;
  const href = value === 'pending' ? '/admin/claims' : `/admin/claims?status=${value}`;
  return (
    <Link
      href={href}
      className={
        active
          ? 'text-foreground underline underline-offset-4'
          : 'text-muted-foreground hover:text-foreground'
      }
    >
      {label}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  const tone =
    status === 'approved'
      ? 'border-emerald-600/40 text-emerald-800 dark:text-emerald-200'
      : status === 'rejected'
        ? 'border-destructive/40 text-destructive'
        : status === 'cancelled'
          ? 'border-border text-muted-foreground'
          : 'border-border text-foreground';
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase ${tone}`}
    >
      {label}
    </span>
  );
}
