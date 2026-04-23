import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

export function ClaimReceivedEmail({
  shopName,
  needsVerification,
}: {
  shopName: string;
  needsVerification: boolean;
}) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Votre demande pour {shopName} a bien été reçue.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Dripper</Heading>
          <Text style={p}>Bonjour,</Text>
          <Text style={p}>
            Nous avons bien reçu votre demande de revendication pour{' '}
            <strong>{shopName}</strong>. Merci.
          </Text>
          {needsVerification ? (
            <Text style={p}>
              Un second email vient de vous être envoyé avec un code de
              vérification à 6 chiffres. Saisissez-le pour finaliser votre
              demande.
            </Text>
          ) : (
            <Text style={p}>
              Votre adresse email n’étant pas rattachée au domaine du shop,
              notre équipe va examiner votre dossier manuellement. Vous
              recevrez un email dès qu’une décision sera prise — en général
              sous 48h ouvrées.
            </Text>
          )}
          <Text style={pMuted}>
            Vous pouvez suivre l’état de votre demande à tout moment depuis
            votre espace « Mes demandes ».
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: '#F5F1EB',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
  color: '#0A0A0A',
};

const container: React.CSSProperties = {
  maxWidth: 520,
  margin: '40px auto',
  padding: '40px 32px',
  backgroundColor: '#FFFFFF',
  borderRadius: 8,
};

const h1: React.CSSProperties = {
  fontFamily: "'Times New Roman', serif",
  fontSize: 28,
  fontWeight: 400,
  fontStyle: 'italic',
  margin: '0 0 24px',
};

const p: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.55,
  margin: '0 0 16px',
};

const pMuted: React.CSSProperties = {
  ...p,
  color: '#6B6B6B',
  fontSize: 13,
};
