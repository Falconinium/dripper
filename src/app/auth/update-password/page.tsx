import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { UpdatePasswordForm } from './update-password-form';

export const metadata: Metadata = {
  title: 'Nouveau mot de passe',
};

const ERROR_MESSAGES: Record<string, string> = {
  short: 'Le mot de passe doit faire au moins 8 caractères.',
  mismatch: 'Les mots de passe ne correspondent pas.',
};

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/connexion/mot-de-passe-oublie');
  }

  const errorMessage = params.error
    ? (ERROR_MESSAGES[params.error] ?? decodeURIComponent(params.error))
    : null;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-24">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">
        Nouveau mot de passe
      </p>
      <h1 className="font-serif text-4xl leading-[1.05] font-normal md:text-5xl">
        Choisissez un
        <br />
        <em className="italic">nouveau mot de passe.</em>
      </h1>
      <p className="text-muted-foreground mt-4 mb-10">Au moins 8 caractères.</p>
      <UpdatePasswordForm errorMessage={errorMessage} />
    </main>
  );
}
