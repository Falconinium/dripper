import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Politique de confidentialité' };

const MAIL = 'quentin.brisepierre@protonmail.com';

export default function Page() {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-8 text-xs tracking-[0.25em] uppercase">
        Informations légales
      </p>
      <h1 className="font-serif text-5xl leading-[1.05] font-normal tracking-tight md:text-6xl">
        Politique de confidentialité
      </h1>

      <div className="mt-10 space-y-8 text-base leading-relaxed">
        <p>
          La présente politique de confidentialité décrit la manière dont{' '}
          <strong>Brisepierre</strong>, entreprise individuelle exploitée
          par Quentin Brisepierre (ci-après «&nbsp;Dripper&nbsp;»,
          «&nbsp;nous&nbsp;», «&nbsp;notre&nbsp;»), collecte, utilise et
          protège les données à caractère personnel des utilisateurs du
          site et de l’application web <strong>Dripper</strong> (ci-après
          «&nbsp;le Service&nbsp;») accessible à l’adresse{' '}
          <Link href="https://dripper-app.fr" className="underline underline-offset-4">
            dripper-app.fr
          </Link>
          .
        </p>
        <p>
          Elle est conforme au Règlement (UE) 2016/679 du 27 avril 2016
          (<strong>RGPD</strong>) et à la loi n°&nbsp;78-17 du
          6&nbsp;janvier 1978 modifiée, dite «&nbsp;Informatique et
          Libertés&nbsp;».
        </p>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">1. Responsable du traitement</h2>
          <p>Le responsable du traitement des données à caractère personnel est&nbsp;:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Brisepierre</strong>, entreprise individuelle exploitée
              par Quentin Brisepierre sous le régime de la micro-entreprise,
              dont le siège d’activité est situé au 920 route de la Mollaz,
              74170 Saint-Gervais-les-Bains (France), immatriculée au
              Registre National des Entreprises (RNE) sous le numéro SIREN
              843&nbsp;595&nbsp;067 (SIRET 843&nbsp;595&nbsp;067&nbsp;00029).
            </li>
            <li>
              <strong>Contact</strong> :{' '}
              <Link href={`mailto:${MAIL}`} className="underline underline-offset-4">
                {MAIL}
              </Link>
            </li>
          </ul>
          <p>
            Compte tenu de la nature et du volume des traitements mis en
            œuvre au stade MVP, la désignation d’un Délégué à la protection
            des données (DPO) n’est pas obligatoire. Un point de contact
            dédié est toutefois mis à disposition à l’adresse{' '}
            <strong>{MAIL}</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">2. Données que nous collectons</h2>

          <h3 className="font-serif text-lg">
            2.1. Données que vous nous fournissez directement
          </h3>
          <LegalTable
            head={['Catégorie', 'Données', 'Finalité']}
            rows={[
              [
                'Compte utilisateur',
                'adresse e-mail, mot de passe (haché), nom d’utilisateur, nom affiché, avatar, bio',
                'Création et gestion du compte, authentification',
              ],
              [
                'Contenus publiés',
                'avis (note Tasse, note Expérience, commentaire, photos), carnet de dégustation, favoris',
                'Fonctionnement du Service, enrichissement éditorial',
              ],
              [
                'Communications',
                'contenu des e-mails échangés avec notre équipe',
                'Support utilisateur, relation contractuelle',
              ],
              [
                'Compte professionnel (shops Pro)',
                'nom du gérant, e-mail, coordonnées bancaires (via Stripe), informations sur l’établissement',
                'Facturation, gestion de l’abonnement',
              ],
            ]}
          />

          <h3 className="font-serif text-lg">2.2. Données collectées automatiquement</h3>
          <LegalTable
            head={['Catégorie', 'Données', 'Finalité']}
            rows={[
              [
                'Journal technique',
                'adresse IP, user-agent, horodatage, pages consultées',
                'Sécurité, prévention des abus, diagnostic technique',
              ],
              [
                'Mesure d’audience',
                'identifiant anonyme de session, pages vues, événements d’interaction',
                'Statistiques d’audience agrégées',
              ],
              [
                'Géolocalisation approximative',
                '(avec votre consentement) position GPS au moment de la recherche',
                'Afficher les shops à proximité sur la carte',
              ],
            ]}
          />

          <p>
            Nous <strong>ne collectons pas</strong> de données sensibles au
            sens de l’article 9 du RGPD (opinions, santé, orientation
            sexuelle, etc.).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">
            3. Finalités et bases légales des traitements
          </h2>
          <LegalTable
            head={['Finalité', 'Base légale (RGPD)']}
            rows={[
              ['Fourniture du Service (compte, carte, avis, carnet)', 'Exécution du contrat (art. 6-1-b)'],
              [
                'Traitement des abonnements Pro et facturation',
                'Exécution du contrat + obligation légale comptable (art. 6-1-b et c)',
              ],
              ['Envoi de la newsletter', 'Consentement (art. 6-1-a) — révocable à tout moment'],
              [
                'Mesure d’audience et amélioration du Service',
                'Intérêt légitime (art. 6-1-f) ou consentement selon la solution technique',
              ],
              ['Lutte contre la fraude et modération des contenus', 'Intérêt légitime (art. 6-1-f)'],
              [
                'Respect d’obligations légales (conservation comptable, réquisitions judiciaires)',
                'Obligation légale (art. 6-1-c)',
              ],
            ]}
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">4. Destinataires des données</h2>
          <p>
            Vos données sont exclusivement destinées aux personnes habilitées
            au sein de Dripper et à nos <strong>sous-traitants</strong>{' '}
            strictement nécessaires à la fourniture du Service&nbsp;:
          </p>
          <LegalTable
            head={['Sous-traitant', 'Rôle', 'Localisation']}
            rows={[
              ['Vercel Inc.', 'Hébergement de l’application', 'États-Unis (clauses contractuelles types)'],
              [
                'Supabase Inc.',
                'Base de données, authentification, stockage',
                'UE (région Francfort) par défaut',
              ],
              ['Mapbox, Inc.', 'Fourniture de la cartographie', 'États-Unis (clauses contractuelles types)'],
              [
                'Resend, Inc.',
                'Envoi des e-mails transactionnels et newsletter',
                'États-Unis (clauses contractuelles types)',
              ],
              ['Plausible Analytics (ou équivalent)', 'Mesure d’audience anonyme', 'UE (Allemagne)'],
            ]}
          />
          <p>
            Nous ne vendons, ne louons et ne cédons <strong>jamais</strong>{' '}
            vos données à des tiers à des fins commerciales. Des données
            peuvent être communiquées aux autorités compétentes sur
            réquisition légale.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">5. Transferts hors Union européenne</h2>
          <p>
            Certains sous-traitants sont établis hors Union européenne
            (notamment aux États-Unis). Ces transferts sont encadrés
            par&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              les <strong>Clauses Contractuelles Types</strong> (CCT)
              adoptées par la Commission européenne (décision 2021/914) ;
            </li>
            <li>
              les mesures techniques complémentaires (chiffrement en transit
              et au repos, pseudonymisation le cas échéant) ;
            </li>
            <li>
              le cas échéant, le <strong>Data Privacy Framework</strong>{' '}
              pour les prestataires américains certifiés.
            </li>
          </ul>
          <p>
            Vous pouvez obtenir copie des garanties sur demande à{' '}
            <strong>{MAIL}</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">6. Durées de conservation</h2>
          <LegalTable
            head={['Donnée', 'Durée de conservation']}
            rows={[
              ['Compte utilisateur actif', 'Tant que le compte est actif + 1 an après dernière connexion'],
              ['Compte supprimé', 'Suppression sous 30 jours, sauvegardes purgées sous 90 jours'],
              [
                'Avis et contenus publiés',
                'Conservés même après suppression du compte, anonymisés (le contenu éditorial est rattaché à un utilisateur anonymisé)',
              ],
              [
                'Données de facturation (Pro)',
                '10 ans (obligation comptable, art. L. 123-22 C. com.)',
              ],
              ['Journaux techniques', '12 mois maximum'],
              ['Newsletter', 'Jusqu’au retrait du consentement, puis suppression sous 30 jours'],
              ['Cookies / mesure d’audience', '13 mois maximum'],
            ]}
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">7. Vos droits</h2>
          <p>
            Conformément aux articles 15 à 22 du RGPD, vous disposez des
            droits suivants&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li><strong>Droit d’accès</strong> à vos données (art. 15) ;</li>
            <li><strong>Droit de rectification</strong> de données inexactes (art. 16) ;</li>
            <li><strong>Droit à l’effacement</strong> («&nbsp;droit à l’oubli&nbsp;») (art. 17) ;</li>
            <li><strong>Droit à la limitation</strong> du traitement (art. 18) ;</li>
            <li><strong>Droit à la portabilité</strong> de vos données (art. 20) ;</li>
            <li><strong>Droit d’opposition</strong> au traitement (art. 21) ;</li>
            <li>
              <strong>Droit de définir des directives</strong> relatives au
              sort de vos données après votre décès (art. 85 loi Informatique
              et Libertés) ;
            </li>
            <li>
              <strong>Droit de retirer votre consentement</strong> à tout
              moment pour les traitements qui en dépendent.
            </li>
          </ul>

          <h3 className="font-serif text-lg">Comment exercer vos droits ?</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Depuis votre espace personnel vous pouvez modifier votre
              profil ou supprimer votre compte.
            </li>
            <li>
              Par e-mail à{' '}
              <Link href={`mailto:${MAIL}`} className="underline underline-offset-4">
                {MAIL}
              </Link>
              , en précisant votre demande et en joignant un justificatif
              d’identité en cas de doute raisonnable.
            </li>
          </ul>
          <p>
            Nous répondons à toute demande dans un délai d’<strong>un mois</strong>{' '}
            maximum (prolongeable de deux mois en cas de demande complexe).
          </p>

          <h3 className="font-serif text-lg">Réclamation auprès de la CNIL</h3>
          <p>
            Si vous estimez, après nous avoir contactés, que vos droits ne
            sont pas respectés, vous pouvez adresser une réclamation à la{' '}
            <strong>
              Commission Nationale de l’Informatique et des Libertés (CNIL)
            </strong>{' '}
            :
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>3 Place de Fontenoy — TSA 80715 — 75334 PARIS CEDEX 07</li>
            <li>
              <Link href="https://www.cnil.fr" className="underline underline-offset-4">
                www.cnil.fr
              </Link>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">8. Cookies et traceurs</h2>
          <p>Le Service utilise des cookies et technologies similaires pour&nbsp;:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Cookies strictement nécessaires</strong> (session,
              authentification, CSRF)&nbsp;: exemptés de consentement,
              indispensables au fonctionnement du Service.
            </li>
            <li>
              <strong>Cookies de mesure d’audience</strong>&nbsp;:
              uniquement si notre solution le requiert. Nous privilégions
              des solutions privacy-first (Plausible ou équivalent) qui ne
              nécessitent pas de consentement en France, sous réserve de la
              configuration CNIL.
            </li>
            <li>
              <strong>Cookies de préférences</strong>&nbsp;: stockage du
              thème (clair/sombre), langue, ville favorite.
            </li>
          </ul>
          <p>
            Un bandeau de consentement permet, le cas échéant, d’accepter,
            refuser ou personnaliser vos préférences. Vous pouvez modifier
            vos choix à tout moment via le lien «&nbsp;Gérer mes
            cookies&nbsp;» en pied de page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">9. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles
            adaptées pour protéger vos données&nbsp;: chiffrement TLS 1.3 en
            transit, chiffrement au repos, hachage des mots de passe
            (bcrypt/argon2), authentification à double facteur sur les outils
            d’administration, principe du moindre privilège, journalisation
            des accès, sauvegardes régulières.
          </p>
          <p>
            En cas de violation de données susceptible d’engendrer un risque
            pour vos droits et libertés, vous serez notifié dans les
            meilleurs délais conformément à l’article 34 du RGPD.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">10. Mineurs</h2>
          <p>
            Le Service est destiné à un public majeur (+18 ans), en
            particulier en raison de la dimension communautaire et
            éditoriale. Nous ne collectons pas sciemment de données
            concernant des mineurs. Si vous avez connaissance de la collecte
            involontaire de telles données, merci de nous contacter à{' '}
            <strong>{MAIL}</strong> pour suppression immédiate.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">11. Modifications</h2>
          <p>
            La présente politique de confidentialité peut être modifiée à
            tout moment pour refléter des évolutions légales, techniques ou
            fonctionnelles. La version applicable est celle en ligne à la
            date de votre utilisation du Service. Les modifications
            substantielles vous seront notifiées par e-mail ou bandeau dans
            l’application au moins 15 jours avant leur entrée en vigueur.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">12. Contact</h2>
          <p>Pour toute question relative à la protection de vos données personnelles&nbsp;:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>E-mail</strong> :{' '}
              <Link href={`mailto:${MAIL}`} className="underline underline-offset-4">
                {MAIL}
              </Link>
            </li>
            <li>
              <strong>Courrier</strong> : Brisepierre —
              «&nbsp;Service Confidentialité&nbsp;» — 920 route de la
              Mollaz, 74170 Saint-Gervais-les-Bains, France
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}

function LegalTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="border-border overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="text-foreground px-3 py-2 text-left text-xs tracking-[0.12em] uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-border border-t align-top">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
