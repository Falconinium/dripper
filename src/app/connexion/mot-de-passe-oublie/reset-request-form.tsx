'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { requestPasswordReset, type AuthState } from '../actions';

const initialState: AuthState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Envoi…' : 'Envoyer le lien'}
    </Button>
  );
}

export function ResetRequestForm() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  if (state.status === 'sent') {
    return (
      <div className="border-border bg-muted/40 rounded-md border p-6">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">Email envoyé</p>
        <p className="mt-3 text-lg leading-relaxed">
          Si un compte existe pour <strong>{state.email}</strong>, vous recevrez un lien de
          réinitialisation.
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
    </form>
  );
}
