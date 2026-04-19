import type { Metadata } from 'next';

import Manifeste from './manifeste.mdx';

export const metadata: Metadata = {
  title: 'Manifeste',
  description:
    'Pourquoi Dripper existe. Notre vision du café de spécialité en France et ce qui nous différencie.',
};

export default function ManifestePage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-8 text-xs tracking-[0.25em] uppercase">Manifeste</p>
      <Manifeste />
    </article>
  );
}
