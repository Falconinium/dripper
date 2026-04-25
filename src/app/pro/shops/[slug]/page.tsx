import type { Metadata } from 'next';
import Link from 'next/link';

import { requireShopOwner } from '@/lib/auth/require-owner';

import { OwnerForm } from './owner-form';
import { OwnerPhotoManager } from './photo-manager';

type Photo = { url: string; path: string; alt?: string };

export const metadata: Metadata = { title: 'Gérer mon shop' };

export default async function ProShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { shop, isAdmin } = await requireShopOwner(slug);

  const photos: Photo[] = Array.isArray(shop.photos)
    ? (shop.photos as Photo[]).filter(
        (p) => p && typeof p.url === 'string' && typeof p.path === 'string',
      )
    : [];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 md:py-24">
      <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
        Espace propriétaire
      </p>
      <h1 className="font-serif mt-4 text-4xl leading-[1.05] md:text-5xl">
        Gérer <em className="italic">{shop.name}</em>
      </h1>
      <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed">
        Gérez vos photos et les informations publiques de votre shop.
        L’adresse et le label Sélection restent sous contrôle éditorial —{' '}
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

      <section className="mt-12">
        <h2 className="font-serif mb-4 text-2xl">Photos</h2>
        <p className="text-muted-foreground mb-4 max-w-xl text-sm leading-relaxed">
          La première photo sert de couverture sur la fiche et dans les
          listes. Survolez une image pour la retirer ou la passer en
          couverture.
        </p>
        <div className="border-border bg-muted/40 mb-6 max-w-xl rounded-md border p-4 text-sm leading-relaxed">
          <p className="text-foreground text-xs tracking-[0.2em] uppercase">
            Format recommandé
          </p>
          <p className="text-muted-foreground mt-2">
            Privilégiez des photos en{' '}
            <strong className="text-foreground">paysage (ratio 16:9)</strong>,
            d’une largeur minimale de{' '}
            <strong className="text-foreground">1600&nbsp;px</strong>
            {' '}et d’un poids inférieur à 8&nbsp;Mo. Les formats portrait ou carré
            s’affichent sur fond flouté sur desktop, mais seront recadrés
            sur mobile et dans les listes.
          </p>
        </div>
        <OwnerPhotoManager slug={slug} photos={photos} />
      </section>

      <section className="mt-16">
        <h2 className="font-serif mb-4 text-2xl">Informations</h2>
        <OwnerForm
          slug={slug}
          initial={{
            description: shop.description,
            phone: shop.phone,
            website: shop.website,
            instagram: shop.instagram,
            espresso_machine: shop.espresso_machine,
            methods: shop.methods,
            options: shop.options,
          }}
        />
      </section>

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
