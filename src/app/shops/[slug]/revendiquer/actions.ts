'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  emailMatchesDomain,
  extractDomainFromUrl,
  generateVerificationCode,
} from '@/lib/claims/domain';
import { sendClaimVerification } from '@/lib/emails/send';
import { createClient } from '@/lib/supabase/server';

export type ClaimFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; next: string };

function trim(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : '';
}

export async function submitClaim(
  prev: ClaimFormState,
  fd: FormData,
): Promise<ClaimFormState> {
  const slug = trim(fd.get('slug'));
  if (!slug) return { status: 'error', message: 'Shop introuvable.' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: 'error', message: 'Connectez-vous pour revendiquer.' };
  }

  const { data: shop } = await supabase
    .from('shops')
    .select('id, name, website, claimed_by')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (!shop) return { status: 'error', message: 'Shop introuvable.' };
  if (shop.claimed_by && shop.claimed_by !== user.id) {
    return { status: 'error', message: 'Ce shop a déjà un propriétaire vérifié.' };
  }

  const full_name = trim(fd.get('full_name'));
  const siret = trim(fd.get('siret')).replace(/\s+/g, '');
  const role_in_company = trim(fd.get('role_in_company'));
  const pro_email = trim(fd.get('pro_email')).toLowerCase();
  const phone = trim(fd.get('phone'));

  if (!full_name || !siret || !role_in_company || !pro_email || !phone) {
    return { status: 'error', message: 'Tous les champs sont obligatoires.' };
  }
  if (!/^\d{14}$/.test(siret)) {
    return { status: 'error', message: 'SIRET invalide (14 chiffres).' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pro_email)) {
    return { status: 'error', message: 'Email invalide.' };
  }

  const siteDomain = extractDomainFromUrl(shop.website);
  const emailMatchesSite = siteDomain
    ? emailMatchesDomain(pro_email, siteDomain)
    : false;
  // Code verification runs only when the pro_email is on the shop's own
  // domain. Otherwise admin validates manually (domain_skipped=true).
  const needsDomainVerif = emailMatchesSite;
  const code = needsDomainVerif ? generateVerificationCode() : null;

  // Upsert-ish: cancel any prior rejected claim is already allowed by the
  // unique index (it only blocks active states). Insert a new pending one.
  const { data: inserted, error } = await supabase
    .from('shop_claims')
    .insert({
      shop_id: shop.id,
      user_id: user.id,
      full_name,
      siret,
      role_in_company,
      pro_email,
      phone,
      domain_verification_email: needsDomainVerif ? pro_email : null,
      domain_verification_code: code,
      domain_skipped: !needsDomainVerif,
    })
    .select('id')
    .single();

  if (error) {
    const msg = error.message.includes('shop_claims_unique_active')
      ? 'Vous avez déjà une demande en cours pour ce shop.'
      : error.message;
    return { status: 'error', message: msg };
  }

  if (needsDomainVerif && code) {
    await sendClaimVerification({
      to: pro_email,
      shopName: shop.name,
      code,
    });
    redirect(`/shops/${slug}/revendiquer/verifier?claim=${inserted.id}`);
  }

  redirect('/mes-demandes');
}

export async function verifyDomainCode(formData: FormData): Promise<void> {
  const claimId = trim(formData.get('claim_id'));
  const code = trim(formData.get('code'));
  const slug = trim(formData.get('slug'));
  if (!claimId || !code) redirect('/mes-demandes');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const { data: claim } = await supabase
    .from('shop_claims')
    .select('id, user_id, status, domain_verification_code, domain_verified_at')
    .eq('id', claimId)
    .maybeSingle();

  if (!claim || claim.user_id !== user.id || claim.status !== 'pending') {
    redirect('/mes-demandes');
  }
  if (claim.domain_verification_code !== code) {
    redirect(`/shops/${slug}/revendiquer/verifier?claim=${claimId}&error=1`);
  }

  await supabase
    .from('shop_claims')
    .update({ domain_verified_at: new Date().toISOString() })
    .eq('id', claimId);

  revalidatePath('/mes-demandes');
  redirect('/mes-demandes?verified=1');
}

export async function cancelClaim(formData: FormData): Promise<void> {
  const claimId = trim(formData.get('claim_id'));
  if (!claimId) redirect('/mes-demandes');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  await supabase
    .from('shop_claims')
    .update({ status: 'cancelled' })
    .eq('id', claimId)
    .eq('user_id', user.id)
    .eq('status', 'pending');

  revalidatePath('/mes-demandes');
  redirect('/mes-demandes');
}
