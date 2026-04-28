'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { submitSuggestion, type SuggestionState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? 'Envoi…' : 'Envoyer la proposition'}
    </Button>
  );
}

export function SuggestionForm() {
  const [state, formAction] = useActionState<SuggestionState, FormData>(
    submitSuggestion,
    { status: 'idle' },
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du shop *</Label>
        <Input id="name" name="name" required minLength={2} maxLength={120} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">Ville *</Label>
          <Input id="city" name="city" required maxLength={80} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" name="address" maxLength={200} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://…"
            maxLength={200}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            placeholder="@compte ou URL"
            maxLength={120}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Pourquoi cette adresse ?</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={5}
          maxLength={1500}
          placeholder="Quels grains, quel torréfacteur, qualité de l’extraction, formation des baristas, eau filtrée… Tout détail nous aide à évaluer."
        />
        <p className="text-muted-foreground text-xs">
          Plus de détails = meilleure évaluation. Précisez si possible le
          torréfacteur, les méthodes proposées (V60, espresso pur, etc.) et
          ce qui rend cette adresse remarquable.
        </p>
      </div>

      <label className="text-muted-foreground flex items-start gap-3 text-xs leading-relaxed">
        <input
          type="checkbox"
          name="terms"
          required
          className="border-input mt-0.5 h-4 w-4 shrink-0 rounded"
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

      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}
      {state.status === 'success' && state.message ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
