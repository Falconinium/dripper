import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { ResetRequestForm } from './reset-request-form';

export const metadata: Metadata = {
  title: 'Mot de passe oublié',
  description: 'Réinitialisez votre mot de passe Dripper par email.',
};

export default async function MotDePasseOubliePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/mon-compte');
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-24">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">
        Mot de passe oublié
      </p>
      <h1 className="font-serif text-4xl leading-[1.05] font-normal md:text-5xl">
        Réinitialiser
        <br />
        <em className="italic">mon mot de passe.</em>
      </h1>
      <p className="text-muted-foreground mt-4 mb-10">
        Entrez votre email, nous vous enverrons un lien pour en choisir un nouveau.
      </p>
      <ResetRequestForm />
      <p className="text-muted-foreground mt-8 text-sm">
        <Link href="/connexion" className="underline">
          Retour à la connexion
        </Link>
      </p>
    </main>
  );
}
