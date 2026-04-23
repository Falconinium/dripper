import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export function ClaimVerificationEmail({
  shopName,
  code,
}: {
  shopName: string;
  code: string;
}) {
  const previewText = `Votre code Dripper pour ${shopName} : ${code}`;
  return (
    <Html lang="fr">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Dripper</Heading>
          <Text style={p}>Bonjour,</Text>
          <Text style={p}>
            Voici votre code de vérification pour revendiquer <strong>{shopName}</strong>.
          </Text>
          <Section style={codeBox}>
            <Text style={codeText}>{code}</Text>
          </Section>
          <Text style={pMuted}>
            Ce code expire dans 30 minutes. Si vous n’êtes pas à l’origine de
            cette demande, ignorez simplement cet email.
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

const codeBox: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#F5F1EB',
  borderRadius: 6,
  padding: '20px 0',
  margin: '24px 0',
};

const codeText: React.CSSProperties = {
  fontFamily: "'Menlo', 'Courier New', monospace",
  fontSize: 30,
  letterSpacing: 8,
  fontWeight: 600,
  margin: 0,
};
