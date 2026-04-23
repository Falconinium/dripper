import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/server';

import { verifyDomainCode } from '../actions';

export const metadata: Metadata = { title: 'Vérifier l’email' };

export default async function VerifierPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ claim?: string; error?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const claimId = sp.claim ?? '';

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/connexion?next=/shops/${slug}/revendiquer/verifier`);

  const { data: claim } = await supabase
    .from('shop_claims')
    .select('id, user_id, status, domain_verification_email, domain_verified_at')
    .eq('id', claimId)
    .maybeSingle();

  if (!claim || claim.user_id !== user.id) notFound();
  if (claim.domain_verified_at) redirect('/mes-demandes?verified=1');

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-20 md:py-24">
      <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
        Vérification
      </p>
      <h1 className="font-serif mt-4 text-3xl leading-[1.1] md:text-4xl">
        Entrez le code reçu
      </h1>
      <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
        Un code à 6 chiffres a été envoyé à{' '}
        <strong>{claim.domain_verification_email}</strong>.
      </p>

      <form action={verifyDomainCode} className="mt-8 space-y-4">
        <input type="hidden" name="claim_id" value={claimId} />
        <input type="hidden" name="slug" value={slug} />
        <div>
          <Label htmlFor="code">Code à 6 chiffres</Label>
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            autoComplete="one-time-code"
            required
            className="mt-2 tracking-widest"
          />
        </div>
        {sp.error ? (
          <p className="text-destructive text-sm">Code invalide.</p>
        ) : null}
        <Button type="submit" size="lg">
          Vérifier
        </Button>
      </form>
    </main>
  );
}
