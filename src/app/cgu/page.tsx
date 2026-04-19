import type { Metadata } from 'next';

import { LegalPlaceholder } from '@/components/legal-placeholder';

export const metadata: Metadata = { title: 'Conditions générales d’utilisation' };

export default function Page() {
  return <LegalPlaceholder title="Conditions générales d’utilisation" />;
}
