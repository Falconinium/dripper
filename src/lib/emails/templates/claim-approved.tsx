import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

export function ClaimApprovedEmail({
  shopName,
  manageUrl,
}: {
  shopName: string;
  manageUrl: string;
}) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Votre revendication pour {shopName} a été approuvée.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Dripper</Heading>
          <Text style={p}>Bonne nouvelle,</Text>
          <Text style={p}>
            Votre revendication pour <strong>{shopName}</strong> a été approuvée.
            Vous pouvez maintenant gérer les informations publiques de votre shop.
          </Text>
          <Button href={manageUrl} style={btn}>
            Accéder à mon shop
          </Button>
          <Text style={pMuted}>
            Une question ? Répondez simplement à cet email.
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
  marginTop: 24,
};

const btn: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#0A0A0A',
  color: '#F5F1EB',
  padding: '12px 20px',
  borderRadius: 999,
  fontSize: 14,
  textDecoration: 'none',
  margin: '16px 0 8px',
};
