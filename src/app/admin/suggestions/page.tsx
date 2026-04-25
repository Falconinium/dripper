import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

import { deleteSuggestion } from './actions';

export default async function AdminSuggestionsPage() {
  const supabase = await createClient();

  const { data: suggestions } = await supabase
    .from('shop_suggestions')
    .select(
      'id, name, address, city, website, instagram, notes, created_at, profiles!shop_suggestions_submitted_by_fkey(username, display_name)',
    )
    .order('created_at', { ascending: false });

  const items = suggestions ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-2xl">Propositions de shops</h2>
        <p className="text-muted-foreground text-sm">
          {items.length} proposition{items.length > 1 ? 's' : ''}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Aucune proposition pour le moment.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((s) => {
            const author =
              s.profiles?.display_name ?? s.profiles?.username ?? '—';
            return (
              <li
                key={s.id}
                className="border-border space-y-3 rounded-md border p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif text-xl">{s.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {s.city ?? '—'}
                      {s.address ? ` · ${s.address}` : ''} · proposé par{' '}
                      {author} ·{' '}
                      {new Date(s.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <form action={deleteSuggestion}>
                    <input type="hidden" name="id" value={s.id} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="border-destructive/40 text-destructive hover:bg-destructive/5"
                    >
                      Supprimer
                    </Button>
                  </form>
                </div>

                {(s.website || s.instagram) && (
                  <div className="text-sm">
                    {s.website ? (
                      <a
                        href={s.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mr-4 underline underline-offset-4"
                      >
                        Site web ↗
                      </a>
                    ) : null}
                    {s.instagram ? (
                      <span className="text-muted-foreground">
                        Instagram : {s.instagram}
                      </span>
                    ) : null}
                  </div>
                )}

                {s.notes ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {s.notes}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
