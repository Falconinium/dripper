import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte Dripper ou créez-en un.',
};

export default async function ConnexionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/mon-compte');
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-24">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">Connexion</p>
      <h1 className="font-serif text-4xl leading-[1.05] font-normal md:text-5xl">
        Bienvenue chez
        <br />
        <em className="italic">Dripper.</em>
      </h1>
      <p className="text-muted-foreground mt-4 mb-10">
        Connectez-vous ou créez votre compte en quelques secondes.
      </p>
      <SignInForm />
    </main>
  );
}
