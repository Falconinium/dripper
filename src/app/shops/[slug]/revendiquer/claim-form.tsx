'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { submitClaim, type ClaimFormState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? 'Envoi…' : 'Envoyer la demande'}
    </Button>
  );
}

export function ClaimForm({
  slug,
  defaultEmail,
  siteDomain,
}: {
  slug: string;
  defaultEmail: string;
  siteDomain: string | null;
}) {
  const [state, action] = useActionState<ClaimFormState, FormData>(submitClaim, {
    status: 'idle',
  });

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="slug" value={slug} />

      <Field
        label="Nom et prénom *"
        name="full_name"
        autoComplete="name"
        required
      />
      <Field
        label="SIRET *"
        name="siret"
        pattern="\d{14}"
        inputMode="numeric"
        placeholder="14 chiffres"
        required
      />

      <div>
        <Label htmlFor="role_in_company">Rôle dans l’entreprise *</Label>
        <select
          id="role_in_company"
          name="role_in_company"
          required
          defaultValue=""
          className="border-input bg-background mt-2 w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Sélectionner…
          </option>
          <option value="owner">Propriétaire</option>
          <option value="manager">Gérant / Manager</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <Field
        label={
          siteDomain
            ? `Email professionnel * (idéalement @${siteDomain})`
            : 'Email professionnel *'
        }
        name="pro_email"
        type="email"
        autoComplete="email"
        defaultValue={defaultEmail}
        required
      />
      <Field
        label="Téléphone *"
        name="phone"
        type="tel"
        autoComplete="tel"
        required
      />

      {siteDomain ? (
        <p className="text-muted-foreground text-xs">
          Nous enverrons un code à 6 chiffres à l’email indiqué pour vérifier le
          domaine <strong>{siteDomain}</strong>. Si l’email n’appartient pas à ce
          domaine, un administrateur validera votre demande manuellement.
        </p>
      ) : (
        <p className="text-muted-foreground text-xs">
          Ce shop n’a pas de site web enregistré : un administrateur validera
          votre demande manuellement.
        </p>
      )}

      {state.status === 'error' ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  name,
  ...rest
}: {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} className="mt-2" {...rest} />
    </div>
  );
}
