'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth/require-admin';
import { sendClaimApproved, sendClaimRejected } from '@/lib/emails/send';
import { createClient } from '@/lib/supabase/server';

function trim(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : '';
}

export async function approveClaim(formData: FormData): Promise<void> {
  const { user } = await requireAdmin();
  const claimId = trim(formData.get('claim_id'));
  if (!claimId) redirect('/admin/claims');

  const supabase = await createClient();

  const { data: claim } = await supabase
    .from('shop_claims')
    .select('id, shop_id, user_id, status, pro_email, shops(name, slug)')
    .eq('id', claimId)
    .maybeSingle();

  if (!claim || claim.status !== 'pending') {
    redirect('/admin/claims');
  }

  // Mark the shop as claimed by this user, promote their role to 'owner'
  // (unless they're already admin/editor), then mark the claim approved.
  const { error: shopErr } = await supabase
    .from('shops')
    .update({ claimed_by: claim.user_id })
    .eq('id', claim.shop_id);
  if (shopErr) throw new Error(shopErr.message);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', claim.user_id)
    .maybeSingle();

  if (profile && profile.role === 'user') {
    await supabase
      .from('profiles')
      .update({ role: 'owner' })
      .eq('id', claim.user_id);
  }

  await supabase
    .from('shop_claims')
    .update({
      status: 'approved',
      decided_at: new Date().toISOString(),
      decided_by: user.id,
      rejection_reason: null,
    })
    .eq('id', claimId);

  if (claim.shops) {
    await sendClaimApproved({
      to: claim.pro_email,
      shopName: claim.shops.name,
      shopSlug: claim.shops.slug,
    });
  }

  revalidatePath('/admin/claims');
  revalidatePath('/mes-demandes');
  redirect('/admin/claims');
}

export async function rejectClaim(formData: FormData): Promise<void> {
  const { user } = await requireAdmin();
  const claimId = trim(formData.get('claim_id'));
  const reason = trim(formData.get('reason'));
  if (!claimId) redirect('/admin/claims');

  const supabase = await createClient();

  const { data: claim } = await supabase
    .from('shop_claims')
    .select('id, status, pro_email, shops(name)')
    .eq('id', claimId)
    .maybeSingle();

  if (!claim || claim.status !== 'pending') {
    redirect('/admin/claims');
  }

  await supabase
    .from('shop_claims')
    .update({
      status: 'rejected',
      decided_at: new Date().toISOString(),
      decided_by: user.id,
      rejection_reason: reason || null,
    })
    .eq('id', claimId);

  if (claim.shops) {
    await sendClaimRejected({
      to: claim.pro_email,
      shopName: claim.shops.name,
      reason: reason || null,
    });
  }

  revalidatePath('/admin/claims');
  revalidatePath('/mes-demandes');
  redirect('/admin/claims');
}
