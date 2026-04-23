import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

import { cancelClaim } from '../shops/[slug]/revendiquer/actions';

export const metadata: Metadata = { title: 'Mes demandes' };

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Refusée',
  cancelled: 'Annulée',
};

export default async function MesDemandesPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?next=/mes-demandes');

  const { data: claims } = await supabase
    .from('shop_claims')
    .select(
      'id, status, domain_verified_at, domain_skipped, rejection_reason, created_at, pro_email, shops(slug, name, city)',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const items = claims ?? [];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 md:py-24">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">
        Mes demandes
      </p>
      <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
        Mes <em className="italic">revendications</em>.
      </h1>

      {sp.verified ? (
        <p className="mt-8 rounded-md border border-emerald-600/30 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100">
          Email vérifié. Votre demande est maintenant prête pour validation
          administrative.
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-sm">
          Aucune demande pour le moment.
        </p>
      ) : (
        <ul className="mt-12 space-y-6">
          {items.map((c) => {
            const shop = c.shops;
            if (!shop) return null;
            const verif = c.domain_verified_at
              ? 'Email vérifié'
              : c.domain_skipped
                ? 'Vérification manuelle'
                : 'Email non vérifié';
            return (
              <li
                key={c.id}
                className="border-border flex flex-col gap-3 border-b pb-6 last:border-0 md:flex-row md:items-start md:justify-between"
              >
                <div className="min-w-0">
                  <Link
                    href={`/shops/${shop.slug}`}
                    className="font-serif text-xl underline-offset-4 hover:underline"
                  >
                    {shop.name}
                  </Link>
                  {shop.city ? (
                    <p className="text-muted-foreground text-sm">{shop.city}</p>
                  ) : null}
                  <p className="text-muted-foreground mt-2 text-xs">
                    {new Date(c.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    · {verif}
                  </p>
                  {c.status === 'rejected' && c.rejection_reason ? (
                    <p className="text-destructive mt-2 text-xs">
                      Motif : {c.rejection_reason}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={c.status} />
                  {c.status === 'pending' && !c.domain_verified_at &&
                  !c.domain_skipped ? (
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={`/shops/${shop.slug}/revendiquer/verifier?claim=${c.id}`}
                      >
                        Saisir le code
                      </Link>
                    </Button>
                  ) : null}
                  {c.status === 'approved' ? (
                    <Button asChild size="sm">
                      <Link href={`/pro/shops/${shop.slug}`}>Gérer</Link>
                    </Button>
                  ) : null}
                  {c.status === 'pending' ? (
                    <form action={cancelClaim}>
                      <input type="hidden" name="claim_id" value={c.id} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground"
                      >
                        Annuler
                      </Button>
                    </form>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
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
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase ${tone}`}
    >
      {label}
    </span>
  );
}
