'use server';

import { headers } from 'next/headers';

import { createClient } from '@/lib/supabase/server';

export type SignInState = {
  status: 'idle' | 'sent' | 'error';
  message?: string;
  email?: string;
};

export async function signInWithMagicLink(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'Adresse email invalide.', email };
  }

  const supabase = await createClient();
  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
  const proto = headerList.get('x-forwarded-proto') ?? 'http';
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? `${proto}://${host}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { status: 'error', message: error.message, email };
  }

  return { status: 'sent', email };
}
