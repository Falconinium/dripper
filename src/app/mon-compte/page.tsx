import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

import { signOut } from './actions';
import { ProfileForm } from './profile-form';

export const metadata: Metadata = { title: 'Mon compte' };

export default async function MonComptePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/connexion');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, role, bio')
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

      <section className="mt-12">
        <h2 className="font-serif text-2xl mb-4">Profil</h2>
        <dl className="mb-8 space-y-4 text-sm">
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Rôle" value={<span className="capitalize">{profile?.role ?? 'user'}</span>} />
        </dl>
        <ProfileForm
          initial={{
            username: profile?.username ?? null,
            display_name: profile?.display_name ?? null,
            bio: profile?.bio ?? null,
          }}
        />
      </section>

      <div className="mt-16 flex flex-wrap items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/mes-favoris">Mes favoris</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/mes-demandes">Mes demandes</Link>
        </Button>
        {profile?.role === 'admin' ? (
          <Button asChild variant="outline">
            <Link href="/admin">Accès admin</Link>
          </Button>
        ) : null}
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Se déconnecter
          </Button>
        </form>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="border-border flex flex-col gap-1 border-b pb-3">
      <dt className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{label}</dt>
      <dd className="text-base">{value}</dd>
    </div>
  );
}
