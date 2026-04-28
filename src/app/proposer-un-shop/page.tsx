import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { SuggestionForm } from './suggestion-form';

export const metadata: Metadata = { title: 'Proposer un shop' };

export default async function ProposeShopPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?next=/proposer-un-shop');

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">
        Communauté
      </p>
      <h1 className="font-serif text-5xl leading-[1.05] font-normal md:text-6xl">
        Proposer <em className="italic">un shop.</em>
      </h1>
      <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed">
        Une adresse manque à l’annuaire et mériterait d’être référencée ?
        Partagez-la avec nous. Toutes les propositions sont relues par
        l’équipe éditoriale avant d’être ajoutées.
      </p>
      <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
        Avant de soumettre, vérifiez que le shop coche les{' '}
        <Link
          href="/selection"
          className="text-foreground underline underline-offset-4"
        >
          critères Sélection
        </Link>{' '}
        : grain specialty, barista formé et mouture à la demande,
        transparence d’origine, espresso pur et eau filtrée.
      </p>

      <section className="mt-12">
        <SuggestionForm />
      </section>
    </main>
  );
}
