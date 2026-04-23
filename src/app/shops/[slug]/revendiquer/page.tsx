import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { extractDomainFromUrl } from '@/lib/claims/domain';
import { createClient } from '@/lib/supabase/server';

import { ClaimForm } from './claim-form';

export const metadata: Metadata = { title: 'Revendiquer ce shop' };

export default async function RevendiquerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?next=/shops/${slug}/revendiquer`);
  }

  const { data: shop } = await supabase
    .from('shops')
    .select('id, name, city, website, claimed_by')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!shop) notFound();

  if (shop.claimed_by) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-20">
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
          Revendication
        </p>
        <h1 className="font-serif mt-4 text-4xl md:text-5xl">
          <em className="italic">{shop.name}</em> est déjà revendiqué.
        </h1>
        <p className="text-muted-foreground mt-6 text-sm">
          Ce shop a déjà un propriétaire vérifié. Si vous pensez qu’il s’agit
          d’une erreur,{' '}
          <Link href="/mes-demandes" className="underline underline-offset-4">
            contactez-nous
          </Link>
          .
        </p>
      </main>
    );
  }

  // Existing pending claim by this user?
  const { data: existing } = await supabase
    .from('shop_claims')
    .select('id, status, domain_verified_at, domain_skipped')
    .eq('shop_id', shop.id)
    .eq('user_id', user.id)
    .in('status', ['pending', 'approved'])
    .maybeSingle();

  if (existing) {
    redirect('/mes-demandes');
  }

  const siteDomain = extractDomainFromUrl(shop.website);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-20 md:py-24">
      <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
        Revendication
      </p>
      <h1 className="font-serif mt-4 text-4xl leading-[1.05] md:text-5xl">
        Revendiquer <em className="italic">{shop.name}</em>
      </h1>
      <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
        Renseignez vos informations professionnelles. Une fois votre demande
        vérifiée, vous pourrez mettre à jour les informations du shop.
      </p>

      <div className="mt-10">
        <ClaimForm
          slug={slug}
          defaultEmail={user.email ?? ''}
          siteDomain={siteDomain}
        />
      </div>
    </main>
  );
}
