'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export type AuthState = {
  status: 'idle' | 'sent' | 'error' | 'confirm';
  mode?: 'signin' | 'signup' | 'reset';
  message?: string;
  email?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function getOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
  const proto = headerList.get('x-forwarded-proto') ?? 'http';
  return process.env.NEXT_PUBLIC_APP_URL ?? `${proto}://${host}`;
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!EMAIL_RE.test(email)) {
    return { status: 'error', mode: 'signin', message: 'Adresse email invalide.', email };
  }
  if (!password) {
    return { status: 'error', mode: 'signin', message: 'Mot de passe requis.', email };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msg =
      error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : error.message === 'Email not confirmed'
          ? 'Confirmez votre email avant de vous connecter.'
          : error.message;
    return { status: 'error', mode: 'signin', message: msg, email };
  }

  redirect('/mon-compte');
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (!EMAIL_RE.test(email)) {
    return { status: 'error', mode: 'signup', message: 'Adresse email invalide.', email };
  }
  if (password.length < 8) {
    return {
      status: 'error',
      mode: 'signup',
      message: 'Le mot de passe doit faire au moins 8 caractères.',
      email,
    };
  }
  if (password !== confirm) {
    return {
      status: 'error',
      mode: 'signup',
      message: 'Les mots de passe ne correspondent pas.',
      email,
    };
  }

  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    return { status: 'error', mode: 'signup', message: error.message, email };
  }

  return { status: 'confirm', mode: 'signup', email };
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { status: 'error', mode: 'reset', message: 'Adresse email invalide.', email };
  }

  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/update-password`,
  });

  if (error) {
    return { status: 'error', mode: 'reset', message: error.message, email };
  }

  return { status: 'sent', mode: 'reset', email };
}

export async function updatePassword(formData: FormData): Promise<void> {
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (password.length < 8) {
    redirect('/auth/update-password?error=short');
  }
  if (password !== confirm) {
    redirect('/auth/update-password?error=mismatch');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/auth/update-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/mon-compte?password_updated=1');
}
