import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Recevez un lien de connexion par email. Pas de mot de passe à retenir.',
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
      <p className="text-muted-foreground mt-4 mb-10">Un lien dans votre boîte mail suffit.</p>
      <SignInForm />
    </main>
  );
}
