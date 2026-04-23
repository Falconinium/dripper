import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

export function ClaimRejectedEmail({
  shopName,
  reason,
}: {
  shopName: string;
  reason: string | null;
}) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Votre demande pour {shopName} n’a pas été acceptée.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Dripper</Heading>
          <Text style={p}>Bonjour,</Text>
          <Text style={p}>
            Après examen, nous n’avons pas pu valider votre demande pour{' '}
            <strong>{shopName}</strong>.
          </Text>
          {reason ? (
            <Text style={quote}>
              <em>« {reason} »</em>
            </Text>
          ) : null}
          <Text style={p}>
            Vous pouvez déposer une nouvelle demande avec des éléments
            complémentaires, ou{' '}
            <a href="mailto:contact@dripper.fr" style={a}>
              nous écrire
            </a>{' '}
            pour en discuter.
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

const quote: React.CSSProperties = {
  ...p,
  borderLeft: '3px solid #EAE5DB',
  paddingLeft: 16,
  color: '#6B6B6B',
};

const a: React.CSSProperties = {
  color: '#0A0A0A',
  textDecoration: 'underline',
};
