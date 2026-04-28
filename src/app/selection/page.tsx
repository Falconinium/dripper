import type { Metadata } from 'next';

import Selection from './selection.mdx';

export const metadata: Metadata = {
  title: 'Critères Sélection',
  description:
    'Les quatre critères publics pour obtenir le label Sélection Dripper. Transparence totale, aucun shop ne peut acheter ce label.',
};

export default function SelectionCriteresPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-8 text-xs tracking-[0.25em] uppercase">
        Critères · Label Sélection
      </p>
      <Selection />
    </article>
  );
}
