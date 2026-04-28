'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { updateOwnedShop, type OwnerUpdateState } from './actions';

const METHODS = [
  { key: 'espresso', label: 'Espresso' },
  { key: 'v60', label: 'V60' },
  { key: 'aeropress', label: 'Aeropress' },
  { key: 'chemex', label: 'Chemex' },
  { key: 'kalita', label: 'Kalita' },
  { key: 'cold_brew', label: 'Cold brew' },
];

const OPTIONS = [
  { key: 'decaf', label: 'Décaf' },
  { key: 'oat_milk', label: 'Lait d’avoine' },
  { key: 'soy_milk', label: 'Lait de soja' },
  { key: 'beans_to_go', label: 'Grains à emporter' },
  { key: 'wifi', label: 'Wifi' },
  { key: 'seating', label: 'Places assises' },
];

export type OwnerInitial = {
  description?: string | null;
  phone?: string | null;
  website?: string | null;
  instagram?: string | null;
  espresso_machine?: string | null;
  methods?: string[] | null;
  options?: string[] | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Enregistrement…' : 'Enregistrer'}
    </Button>
  );
}

export function OwnerForm({ slug, initial }: { slug: string; initial: OwnerInitial }) {
  const [state, action] = useActionState<OwnerUpdateState, FormData>(updateOwnedShop, {
    status: 'idle',
  });
  const methods = initial.methods ?? [];
  const options = initial.options ?? [];

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="slug" value={slug} />

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial.description ?? ''}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Téléphone" name="phone" defaultValue={initial.phone ?? ''} />
        <Field label="Site web" name="website" defaultValue={initial.website ?? ''} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Instagram"
          name="instagram"
          placeholder="@mon-shop"
          defaultValue={initial.instagram ?? ''}
        />
        <Field
          label="Machine espresso"
          name="espresso_machine"
          defaultValue={initial.espresso_machine ?? ''}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Méthodes</legend>
        <div className="flex flex-wrap gap-2">
          {METHODS.map((m) => (
            <CheckboxPill
              key={m.key}
              name="methods"
              value={m.key}
              label={m.label}
              defaultChecked={methods.includes(m.key)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Options</legend>
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <CheckboxPill
              key={o.key}
              name="options"
              value={o.key}
              label={o.label}
              defaultChecked={options.includes(o.key)}
            />
          ))}
        </div>
      </fieldset>

      <label className="text-muted-foreground flex items-start gap-3 text-xs leading-relaxed">
        <input
          type="checkbox"
          name="photo_rights"
          required
          className="border-input mt-0.5 h-4 w-4 shrink-0 rounded"
        />
        <span>
          Je certifie détenir les droits sur les photos ajoutées à cette fiche
          et j’accepte d’en céder les droits d’image à Dripper pour leur
          utilisation sur le site.
        </span>
      </label>

      {state.status === 'error' ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}
      {state.status === 'success' ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.message}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} {...rest} />
    </div>
  );
}

function CheckboxPill({
  name,
  value,
  label,
  defaultChecked,
}: {
  name: string;
  value: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="border-border hover:bg-muted/40 has-[:checked]:bg-foreground has-[:checked]:text-background cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="sr-only"
      />
      {label}
    </label>
  );
}
