'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signInWithMagicLink, type SignInState } from './actions';

const initialState: SignInState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Envoi…' : 'Recevoir le lien'}
    </Button>
  );
}

export function SignInForm() {
  const [state, formAction] = useActionState(signInWithMagicLink, initialState);

  if (state.status === 'sent') {
    return (
      <div className="border-border bg-muted/40 rounded-md border p-6">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">Lien envoyé</p>
        <p className="mt-3 text-lg leading-relaxed">
          Vérifiez <strong>{state.email}</strong>. Le lien de connexion est valable une heure.
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          Pas reçu ? Pensez aux spams, puis réessayez.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.fr"
          defaultValue={state.email ?? ''}
        />
      </div>
      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}
      <SubmitButton />
      <p className="text-muted-foreground text-xs leading-relaxed">
        Pas de mot de passe. Nous envoyons un lien unique par email, valable une heure.
      </p>
    </form>
  );
}
