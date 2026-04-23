'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updatePassword } from '../../connexion/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Mise à jour…' : 'Mettre à jour'}
    </Button>
  );
}

export function UpdatePasswordForm({ errorMessage }: { errorMessage: string | null }) {
  return (
    <form action={updatePassword} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input
          id="password"
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm">Confirmer</Label>
        <Input
          id="confirm"
          type="password"
          name="confirm"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {errorMessage ? <p className="text-destructive text-sm">{errorMessage}</p> : null}
      <SubmitButton />
    </form>
  );
}
