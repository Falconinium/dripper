import type { Metadata } from 'next';
import Link from 'next/link';

import { requireShopOwner } from '@/lib/auth/require-owner';

import { OwnerForm } from './owner-form';

export const metadata: Metadata = { title: 'Gérer mon shop' };

export default async function ProShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { shop, isAdmin } = await requireShopOwner(slug);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 md:py-24">
      <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
        Espace propriétaire
      </p>
      <h1 className="font-serif mt-4 text-4xl leading-[1.05] md:text-5xl">
        Gérer <em className="italic">{shop.name}</em>
      </h1>
      <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed">
        Mettez à jour les informations publiques de votre shop. Les éléments
        plus sensibles (adresse, label Sélection, photos) restent gérés par
        l’équipe éditoriale —{' '}
        <Link
          href="mailto:contact@dripper.fr"
          className="underline underline-offset-4"
        >
          contactez-nous
        </Link>{' '}
        pour toute modification.
      </p>

      {isAdmin && shop.claimed_by && shop.claimed_by !== null ? (
        <p className="text-muted-foreground mt-4 text-xs">
          (Vue admin — shop revendiqué par un autre utilisateur.)
        </p>
      ) : null}

      <div className="mt-12">
        <OwnerForm
          slug={slug}
          initial={{
            description: shop.description,
            phone: shop.phone,
            website: shop.website,
            instagram: shop.instagram,
            espresso_machine: shop.espresso_machine,
            avg_flat_white_price: shop.avg_flat_white_price,
            methods: shop.methods,
            options: shop.options,
          }}
        />
      </div>

      <div className="mt-16 flex items-center gap-4 text-sm">
        <Link
          href={`/shops/${slug}`}
          className="text-muted-foreground underline underline-offset-4"
        >
          Voir la fiche publique →
        </Link>
      </div>
    </main>
  );
}
