import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

import { signOut } from './actions';

export const metadata: Metadata = { title: 'Mon compte' };

export default async function MonComptePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/connexion');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, role')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">Mon compte</p>
      <h1 className="font-serif text-5xl leading-[1.05] font-normal md:text-6xl">
        Bonjour
        {profile?.display_name ? (
          <>
            ,<br />
            <em className="italic">{profile.display_name}.</em>
          </>
        ) : (
          '.'
        )}
      </h1>

      <dl className="mt-12 space-y-6 text-sm">
        <div className="border-border flex flex-col gap-1 border-b pb-6">
          <dt className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Email</dt>
          <dd className="text-base">{user.email}</dd>
        </div>
        <div className="border-border flex flex-col gap-1 border-b pb-6">
          <dt className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Nom d’usage</dt>
          <dd className="text-base">{profile?.username ?? '—'}</dd>
        </div>
        <div className="border-border flex flex-col gap-1 border-b pb-6">
          <dt className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Rôle</dt>
          <dd className="text-base capitalize">{profile?.role ?? 'user'}</dd>
        </div>
      </dl>

      <form action={signOut} className="mt-12">
        <Button type="submit" variant="outline">
          Se déconnecter
        </Button>
      </form>
    </main>
  );
}
