import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

export function SuggestionAdminEmail({
  shopName,
  city,
  address,
  website,
  instagram,
  notes,
  submittedBy,
  manageUrl,
}: {
  shopName: string;
  city: string | null;
  address: string | null;
  website: string | null;
  instagram: string | null;
  notes: string | null;
  submittedBy: string;
  manageUrl: string;
}) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Nouvelle proposition de shop : {shopName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Dripper · admin</Heading>
          <Text style={p}>
            Nouvelle proposition de coffee shop reçue.
          </Text>

          <Text style={pLabel}>Nom</Text>
          <Text style={p}>{shopName}</Text>

          {city ? (
            <>
              <Text style={pLabel}>Ville</Text>
              <Text style={p}>{city}</Text>
            </>
          ) : null}

          {address ? (
            <>
              <Text style={pLabel}>Adresse</Text>
              <Text style={p}>{address}</Text>
            </>
          ) : null}

          {website ? (
            <>
              <Text style={pLabel}>Site web</Text>
              <Text style={p}>{website}</Text>
            </>
          ) : null}

          {instagram ? (
            <>
              <Text style={pLabel}>Instagram</Text>
              <Text style={p}>{instagram}</Text>
            </>
          ) : null}

          {notes ? (
            <>
              <Text style={pLabel}>Justification</Text>
              <Text style={p}>{notes}</Text>
            </>
          ) : null}

          <Text style={pLabel}>Soumis par</Text>
          <Text style={p}>{submittedBy}</Text>

          <Text style={pMuted}>
            Voir toutes les propositions :{' '}
            <a href={manageUrl} style={a}>
              {manageUrl}
            </a>
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
  margin: '0 0 12px',
};

const pLabel: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#6B6B6B',
  margin: '16px 0 4px',
};

const pMuted: React.CSSProperties = {
  ...p,
  color: '#6B6B6B',
  fontSize: 13,
  marginTop: 24,
};

const a: React.CSSProperties = {
  color: '#0A0A0A',
  textDecoration: 'underline',
};
