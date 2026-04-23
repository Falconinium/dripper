import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

import { approveClaim, rejectClaim } from '../actions';

export default async function AdminClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: claim } = await supabase
    .from('shop_claims')
    .select(
      'id, status, created_at, decided_at, rejection_reason, full_name, siret, role_in_company, pro_email, phone, domain_verification_email, domain_verified_at, domain_skipped, shops(slug, name, city, website, claimed_by), profiles!shop_claims_user_id_fkey(username, display_name), decided_by_profile:profiles!shop_claims_decided_by_fkey(username, display_name)',
    )
    .eq('id', id)
    .maybeSingle();

  if (!claim) notFound();
  const shop = claim.shops;
  const claimant = claim.profiles;

  const roleLabel =
    claim.role_in_company === 'owner'
      ? 'Propriétaire'
      : claim.role_in_company === 'manager'
        ? 'Gérant / Manager'
        : 'Autre';

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/admin/claims"
        className="text-muted-foreground text-xs underline underline-offset-4"
      >
        ← Revendications
      </Link>

      <div>
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
          Revendication
        </p>
        <h2 className="font-serif mt-2 text-3xl">
          {shop ? shop.name : '(shop supprimé)'}
        </h2>
        {shop?.city ? (
          <p className="text-muted-foreground text-sm">{shop.city}</p>
        ) : null}
      </div>

      <section>
        <h3 className="text-muted-foreground mb-3 text-xs tracking-[0.2em] uppercase">
          Statut
        </h3>
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <Row label="État" value={claim.status} />
          <Row
            label="Déposée le"
            value={new Date(claim.created_at).toLocaleString('fr-FR')}
          />
          <Row
            label="Vérification email"
            value={
              claim.domain_verified_at
                ? `Vérifié le ${new Date(claim.domain_verified_at).toLocaleDateString('fr-FR')}`
                : claim.domain_skipped
                  ? 'Vérification manuelle requise'
                  : 'En attente'
            }
          />
          {claim.decided_at ? (
            <Row
              label="Décidée le"
              value={new Date(claim.decided_at).toLocaleString('fr-FR')}
            />
          ) : null}
          {claim.rejection_reason ? (
            <Row label="Motif du refus" value={claim.rejection_reason} />
          ) : null}
        </dl>
      </section>

      <section>
        <h3 className="text-muted-foreground mb-3 text-xs tracking-[0.2em] uppercase">
          Demandeur
        </h3>
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <Row
            label="Compte"
            value={claimant?.display_name ?? claimant?.username ?? '—'}
          />
          <Row label="Nom complet" value={claim.full_name} />
          <Row label="Rôle" value={roleLabel} />
          <Row label="SIRET" value={claim.siret} />
          <Row label="Email pro" value={claim.pro_email} />
          <Row label="Téléphone" value={claim.phone} />
        </dl>
      </section>

      <section>
        <h3 className="text-muted-foreground mb-3 text-xs tracking-[0.2em] uppercase">
          Shop
        </h3>
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <Row
            label="Fiche"
            value={
              shop ? (
                <Link
                  href={`/shops/${shop.slug}`}
                  className="underline underline-offset-4"
                >
                  {shop.slug}
                </Link>
              ) : (
                '—'
              )
            }
          />
          <Row label="Site" value={shop?.website ?? '—'} />
          <Row
            label="Déjà revendiqué"
            value={shop?.claimed_by ? 'Oui' : 'Non'}
          />
        </dl>
      </section>

      {claim.status === 'pending' ? (
        <section className="border-border space-y-6 rounded-2xl border p-6">
          <h3 className="font-serif text-xl">Décision</h3>
          {shop?.claimed_by && shop.claimed_by !== null ? (
            <p className="text-muted-foreground text-sm">
              Ce shop est déjà revendiqué. Vérifiez avant d’approuver : cela
              remplacera le propriétaire actuel.
            </p>
          ) : null}

          <form action={approveClaim}>
            <input type="hidden" name="claim_id" value={claim.id} />
            <Button type="submit" size="lg">
              Approuver
            </Button>
          </form>

          <div className="border-border border-t pt-6">
            <form action={rejectClaim} className="space-y-3">
              <input type="hidden" name="claim_id" value={claim.id} />
              <label
                htmlFor="reason"
                className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
              >
                Motif du refus (optionnel)
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                className="border-input bg-background block w-full rounded-md border px-3 py-2 text-sm"
              />
              <Button type="submit" variant="outline">
                Refuser
              </Button>
            </form>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-border border-b pb-2">
      <dt className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm">{value}</dd>
    </div>
  );
}
