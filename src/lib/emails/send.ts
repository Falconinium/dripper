import 'server-only';

import { APP_URL, EMAIL_FROM, resend } from './resend';
import { ClaimApprovedEmail } from './templates/claim-approved';
import { ClaimReceivedEmail } from './templates/claim-received';
import { ClaimRejectedEmail } from './templates/claim-rejected';
import { ClaimVerificationEmail } from './templates/claim-verification';

async function send(params: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  if (!resend) {
    console.warn(
      `[emails] RESEND_API_KEY missing — skipping send to ${params.to} ("${params.subject}")`,
    );
    return;
  }
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: params.to,
    subject: params.subject,
    react: params.react,
  });
  if (error) {
    console.error('[emails] send failed', error);
  }
}

export async function sendClaimReceived(args: {
  to: string;
  shopName: string;
  needsVerification: boolean;
}) {
  await send({
    to: args.to,
    subject: `Votre demande pour ${args.shopName} a bien été reçue`,
    react: ClaimReceivedEmail({
      shopName: args.shopName,
      needsVerification: args.needsVerification,
    }),
  });
}

export async function sendClaimVerification(args: {
  to: string;
  shopName: string;
  code: string;
}) {
  await send({
    to: args.to,
    subject: `Votre code Dripper pour ${args.shopName}`,
    react: ClaimVerificationEmail({ shopName: args.shopName, code: args.code }),
  });
}

export async function sendClaimApproved(args: {
  to: string;
  shopName: string;
  shopSlug: string;
}) {
  await send({
    to: args.to,
    subject: `Votre revendication pour ${args.shopName} a été approuvée`,
    react: ClaimApprovedEmail({
      shopName: args.shopName,
      manageUrl: `${APP_URL}/pro/shops/${args.shopSlug}`,
    }),
  });
}

export async function sendClaimRejected(args: {
  to: string;
  shopName: string;
  reason: string | null;
}) {
  await send({
    to: args.to,
    subject: `Votre demande pour ${args.shopName}`,
    react: ClaimRejectedEmail({ shopName: args.shopName, reason: args.reason }),
  });
}
