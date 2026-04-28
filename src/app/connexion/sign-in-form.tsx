'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signIn, signUp, type AuthState } from './actions';

const initialState: AuthState = { status: 'idle' };

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function SignInForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [signInState, signInAction] = useActionState(signIn, initialState);
  const [signUpState, signUpAction] = useActionState(signUp, initialState);

  if (signUpState.status === 'confirm' && mode === 'signup') {
    return (
      <div className="border-border bg-muted/40 rounded-md border p-6">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">Email envoyé</p>
        <p className="mt-3 text-lg leading-relaxed">
          Vérifiez <strong>{signUpState.email}</strong>. Cliquez sur le lien de confirmation pour
          activer votre compte.
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          Pas reçu ? Pensez aux spams. Vous pouvez aussi recommencer avec une autre adresse.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border-border flex gap-1 border-b">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`flex-1 py-3 text-sm tracking-wide uppercase transition-colors ${
            mode === 'signin'
              ? 'border-foreground -mb-px border-b-2'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 py-3 text-sm tracking-wide uppercase transition-colors ${
            mode === 'signup'
              ? 'border-foreground -mb-px border-b-2'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Inscription
        </button>
      </div>

      {mode === 'signin' ? (
        <form action={signInAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email-signin">Email</Label>
            <Input
              id="email-signin"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.fr"
              defaultValue={signInState.email ?? ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="password-signin">Mot de passe</Label>
              <Link
                href="/connexion/mot-de-passe-oublie"
                className="text-muted-foreground hover:text-foreground text-xs underline"
              >
                Oublié ?
              </Link>
            </div>
            <Input
              id="password-signin"
              type="password"
              name="password"
              required
              autoComplete="current-password"
            />
          </div>
          {signInState.status === 'error' && signInState.message ? (
            <p className="text-destructive text-sm">{signInState.message}</p>
          ) : null}
          <SubmitButton label="Se connecter" pendingLabel="Connexion…" />
        </form>
      ) : (
        <form action={signUpAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email-signup">Email</Label>
            <Input
              id="email-signup"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.fr"
              defaultValue={signUpState.email ?? ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password-signup">Mot de passe</Label>
            <Input
              id="password-signup"
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-signup">Confirmer le mot de passe</Label>
            <Input
              id="confirm-signup"
              type="password"
              name="confirm"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <label className="text-muted-foreground flex items-start gap-3 text-xs leading-relaxed">
            <input
              type="checkbox"
              name="terms"
              required
              className="border-input accent-foreground mt-0.5 h-4 w-4 shrink-0 rounded"
            />
            <span>
              J’accepte les{' '}
              <Link href="/cgu" target="_blank" className="text-foreground underline underline-offset-4">
                conditions générales d’utilisation
              </Link>{' '}
              et la{' '}
              <Link
                href="/confidentialite"
                target="_blank"
                className="text-foreground underline underline-offset-4"
              >
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          {signUpState.status === 'error' && signUpState.message ? (
            <p className="text-destructive text-sm">{signUpState.message}</p>
          ) : null}
          <SubmitButton label="Créer mon compte" pendingLabel="Création…" />
          <p className="text-muted-foreground text-xs leading-relaxed">
            Au moins 8 caractères. Un email de confirmation vous sera envoyé.
          </p>
        </form>
      )}
    </div>
  );
}
