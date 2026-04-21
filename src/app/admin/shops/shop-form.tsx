'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { ShopFormState } from './actions';
import { AddressAutocomplete } from './address-autocomplete';

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

export type ShopInitialValues = {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  phone?: string | null;
  website?: string | null;
  instagram?: string | null;
  espresso_machine?: string | null;
  avg_flat_white_price?: number | null;
  methods?: string[] | null;
  options?: string[] | null;
  is_selection?: boolean | null;
  status?: string | null;
  coords?: { lng: number; lat: number } | null;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Enregistrement…' : label}
    </Button>
  );
}

export function ShopForm({
  action,
  submitLabel,
  initial,
  mapboxToken,
}: {
  action: (prev: ShopFormState, fd: FormData) => Promise<ShopFormState>;
  submitLabel: string;
  initial?: ShopInitialValues;
  mapboxToken: string;
}) {
  const [state, formAction] = useActionState<ShopFormState, FormData>(action, { status: 'idle' });
  const methods = initial?.methods ?? [];
  const options = initial?.options ?? [];

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Nom *" name="name" defaultValue={initial?.name ?? ''} required />
        <Field
          label="Slug (optionnel, auto)"
          name="slug"
          defaultValue={initial?.slug ?? ''}
        />
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

      <AddressAutocomplete
        token={mapboxToken}
        defaultAddress={initial?.address ?? ''}
        defaultCity={initial?.city ?? ''}
        defaultPostalCode={initial?.postal_code ?? ''}
        defaultLng={initial?.coords?.lng?.toString() ?? ''}
        defaultLat={initial?.coords?.lat?.toString() ?? ''}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Téléphone" name="phone" defaultValue={initial?.phone ?? ''} />
        <Field label="Site web" name="website" defaultValue={initial?.website ?? ''} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Instagram" name="instagram" defaultValue={initial?.instagram ?? ''} />
        <Field
          label="Machine espresso"
          name="espresso_machine"
          defaultValue={initial?.espresso_machine ?? ''}
        />
      </div>

      <Field
        label="Prix moyen flat white (€)"
        name="avg_flat_white_price"
        type="number"
        step="0.1"
        defaultValue={initial?.avg_flat_white_price?.toString() ?? ''}
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Méthodes</legend>
        <div className="flex flex-wrap gap-3">
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

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Options</legend>
        <div className="flex flex-wrap gap-3">
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

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_selection"
            defaultChecked={initial?.is_selection ?? false}
            className="size-4"
          />
          Label Sélection
        </label>
        <label className="flex items-center gap-2 text-sm">
          Statut
          <select
            name="status"
            defaultValue={initial?.status ?? 'draft'}
            className="border-border bg-background rounded-md border px-3 py-1.5 text-sm"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="archived">Archivé</option>
          </select>
        </label>
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
