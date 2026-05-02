'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useActionToast } from '@/lib/hooks/use-action-toast';

import { submitReview, type ReviewFormState } from './actions';

type ExistingReview = {
  experience_score: number | null;
  comment: string | null;
  drink_ordered: string | null;
} | null;

function SubmitButton({ existing }: { existing: ExistingReview }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Envoi…' : existing ? 'Mettre à jour' : 'Publier'}
    </Button>
  );
}

export function ReviewForm({
  shopId,
  slug,
  existing,
}: {
  shopId: string;
  slug: string;
  existing: ExistingReview;
}) {
  const action = submitReview.bind(null, shopId, slug);
  const [state, formAction] = useActionState<ReviewFormState, FormData>(action, { status: 'idle' });
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="experience_score">Expérience (1–10) *</Label>
        <Input
          id="experience_score"
          name="experience_score"
          type="number"
          min={1}
          max={10}
          required
          defaultValue={existing?.experience_score ?? ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="drink_ordered">Boisson commandée</Label>
        <Input
          id="drink_ordered"
          name="drink_ordered"
          defaultValue={existing?.drink_ordered ?? ''}
          placeholder="Flat white, V60 Éthiopie, espresso…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Commentaire</Label>
        <Textarea
          id="comment"
          name="comment"
          rows={4}
          defaultValue={existing?.comment ?? ''}
          placeholder="Ce que vous avez goûté, ressenti, à retenir."
        />
      </div>

      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}
      {state.status === 'success' && state.message ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.message}</p>
      ) : null}

      <SubmitButton existing={existing} />
    </form>
  );
}
