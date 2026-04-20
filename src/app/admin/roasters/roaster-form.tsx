'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { RoasterFormState } from './actions';

export type RoasterInitialValues = {
  name?: string | null;
  slug?: string | null;
  city?: string | null;
  description?: string | null;
  website?: string | null;
  instagram?: string | null;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Enregistrement…' : label}
    </Button>
  );
}

export function RoasterForm({
  action,
  submitLabel,
  initial,
}: {
  action: (prev: RoasterFormState, fd: FormData) => Promise<RoasterFormState>;
  submitLabel: string;
  initial?: RoasterInitialValues;
}) {
  const [state, formAction] = useActionState<RoasterFormState, FormData>(action, {
    status: 'idle',
  });

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom *</Label>
          <Input id="name" name="name" required defaultValue={initial?.name ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (auto)</Label>
          <Input id="slug" name="slug" defaultValue={initial?.slug ?? ''} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ''}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" name="city" defaultValue={initial?.city ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input id="website" name="website" defaultValue={initial?.website ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" name="instagram" defaultValue={initial?.instagram ?? ''} />
        </div>
      </div>

      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}
      {state.status === 'success' && state.message ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.message}</p>
      ) : null}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
