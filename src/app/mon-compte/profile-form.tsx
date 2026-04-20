'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { updateProfile, type ProfileFormState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" disabled={pending}>
      {pending ? 'Enregistrement…' : 'Enregistrer'}
    </Button>
  );
}

export function ProfileForm({
  initial,
}: {
  initial: {
    username: string | null;
    display_name: string | null;
    bio: string | null;
  };
}) {
  const [state, formAction] = useActionState<ProfileFormState, FormData>(updateProfile, {
    status: 'idle',
  });

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nom d’usage *</Label>
        <Input
          id="username"
          name="username"
          required
          defaultValue={initial.username ?? ''}
          minLength={3}
          maxLength={30}
          autoComplete="username"
        />
        <p className="text-muted-foreground text-xs">Lettres, chiffres, . _ - (minuscules).</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="display_name">Nom affiché</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={initial.display_name ?? ''}
          maxLength={80}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={initial.bio ?? ''}
          maxLength={280}
        />
      </div>
      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}
      {state.status === 'success' && state.message ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.message}</p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
