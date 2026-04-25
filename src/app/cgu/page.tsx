import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Conditions générales d’utilisation' };

const MAIL = 'quentin.brisepierre@protonmail.com';

export default function Page() {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-8 text-xs tracking-[0.25em] uppercase">
        Informations légales
      </p>
      <h1 className="font-serif text-4xl leading-[1.05] font-normal tracking-tight md:text-5xl">
        Conditions Générales d’Utilisation
      </h1>

      <div className="mt-10 space-y-8 text-base leading-relaxed">
        <p>
          Les présentes Conditions Générales d’Utilisation
          (ci-après «&nbsp;<strong>CGU</strong>&nbsp;») régissent
          l’utilisation du site et de l’application web{' '}
          <strong>Dripper</strong> (ci-après «&nbsp;le <strong>Service</strong>&nbsp;»),
          édités par <strong>Brisepierre</strong>, entreprise individuelle
          exploitée par Quentin Brisepierre sous le régime de la
          micro-entreprise, dont le siège d’activité est situé au 920 route
          de la Mollaz, 74170 Saint-Gervais-les-Bains (France), immatriculée
          au Registre National des Entreprises sous le SIREN
          843&nbsp;595&nbsp;067 (SIRET 843&nbsp;595&nbsp;067&nbsp;00029),
          bénéficiant de la franchise en base de TVA (art.&nbsp;293&nbsp;B
          du CGI) — ci-après «&nbsp;<strong>Dripper</strong>&nbsp;».
        </p>
        <p>
          L’accès au Service implique l’acceptation sans réserve des
          présentes CGU.
        </p>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">1. Objet du Service</h2>
          <p>
            Dripper est une plateforme éditoriale et communautaire dédiée
            au <strong>café de spécialité en France</strong>. Elle
            propose&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              un <strong>annuaire et une carte interactive</strong> des
              coffee shops et torréfacteurs ;
            </li>
            <li>
              un système de <strong>notation en double score</strong>{' '}
              (note Tasse / note Expérience) et d’<strong>avis</strong>{' '}
              publiés par les utilisateurs inscrits ;
            </li>
            <li>
              un <strong>label «&nbsp;Sélection&nbsp;»</strong> attribué
              éditorialement sur la base de critères publics ;
            </li>
            <li>
              un <strong>carnet de dégustation</strong> personnel pour les
              utilisateurs inscrits ;
            </li>
            <li>
              des <strong>guides éditoriaux</strong> par ville et des
              contenus de blog ;
            </li>
            <li>
              un <strong>espace «&nbsp;gérant&nbsp;»</strong> à destination
              des établissements référencés, leur permettant de revendiquer
              leur fiche et d’en enrichir le contenu (photos, description,
              méthodes).
            </li>
          </ul>
          <p>
            À la date des présentes, <strong>l’intégralité du Service est
            gratuite</strong>, pour les utilisateurs comme pour les
            établissements. L’introduction de fonctionnalités ou d’offres
            payantes pourra donner lieu à une mise à jour des présentes
            CGU, notifiée dans les conditions prévues au §2.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">2. Acceptation et modification des CGU</h2>
          <p>
            L’utilisation du Service emporte acceptation pleine et entière
            des CGU en vigueur. Dripper se réserve le droit de modifier les
            CGU à tout moment. Les utilisateurs sont informés par bandeau
            et/ou e-mail au moins <strong>15&nbsp;jours</strong> avant
            l’entrée en vigueur des modifications substantielles.
            L’utilisation du Service postérieure à cette notification vaut
            acceptation des nouvelles CGU.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">3. Accès au Service</h2>

          <h3 className="font-serif text-lg">3.1. Conditions d’accès</h3>
          <p>L’accès au Service est&nbsp;:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              ouvert à toute personne physique <strong>majeure</strong>{' '}
              (18&nbsp;ans révolus) ;
            </li>
            <li>
              ouvert à toute personne morale régulièrement constituée pour
              les comptes gérant ;
            </li>
            <li>
              <strong>entièrement gratuit</strong> — aucune fonctionnalité
              n’est soumise à paiement.
            </li>
          </ul>

          <h3 className="font-serif text-lg">3.2. Création de compte</h3>
          <p>
            Un compte utilisateur nécessite la fourniture d’une adresse
            e-mail valide, d’un mot de passe et d’un nom d’utilisateur
            unique. L’utilisateur s’engage à fournir des informations
            exactes et à les maintenir à jour. Chaque utilisateur est
            responsable de la confidentialité de ses identifiants et de
            toute activité effectuée depuis son compte.
          </p>

          <h3 className="font-serif text-lg">3.3. Disponibilité</h3>
          <p>
            Dripper s’efforce d’assurer une disponibilité du Service
            24h/24 et 7j/7, sans garantie de continuité. Des interruptions
            peuvent survenir pour maintenance, mise à jour, cas de force
            majeure ou défaillance d’un prestataire tiers (hébergeur,
            cartographie, paiement). La responsabilité de Dripper ne peut
            être engagée à ce titre.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">4. Règles d’usage et contenus utilisateurs</h2>

          <h3 className="font-serif text-lg">4.1. Contenus publiés par les utilisateurs</h3>
          <p>
            Les utilisateurs peuvent publier des contenus (avis, photos,
            carnet de dégustation, commentaires). En publiant un contenu,
            l’utilisateur&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>garantit</strong> être l’auteur du contenu et
              disposer de tous les droits nécessaires (notamment droit à
              l’image pour les personnes photographiées) ;
            </li>
            <li>
              <strong>concède</strong> à Dripper une licence mondiale,
              non-exclusive, gratuite, transférable et sous-licenciable
              d’utilisation, de reproduction, d’adaptation, de traduction
              et de publication du contenu, pour les besoins du Service et
              sa promotion, pour la durée de protection légale du droit
              d’auteur ;
            </li>
            <li>
              <strong>garantit</strong> Dripper contre tout recours de
              tiers lié au contenu publié.
            </li>
          </ul>

          <h3 className="font-serif text-lg">4.2. Contenus interdits</h3>
          <p>Il est strictement interdit de publier du contenu&nbsp;:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              diffamatoire, injurieux, dénigrant ou constitutif de
              concurrence déloyale ;
            </li>
            <li>
              contraire aux bonnes mœurs, à l’ordre public, à la dignité
              humaine ;
            </li>
            <li>
              portant atteinte aux droits d’autrui (propriété
              intellectuelle, vie privée, droit à l’image) ;
            </li>
            <li>
              à caractère raciste, sexiste, homophobe, discriminatoire ou
              incitant à la haine ;
            </li>
            <li>
              à caractère publicitaire, commercial, spam, ou visant à
              rediriger les utilisateurs hors du Service sans rapport
              éditorial ;
            </li>
            <li>contenant des données personnelles de tiers sans leur accord ;</li>
            <li>
              reposant sur de fausses expériences (avis rédigés sans avoir
              visité l’établissement, avis rémunérés, faux comptes).
            </li>
          </ul>

          <h3 className="font-serif text-lg">4.3. Sincérité des avis</h3>
          <p>
            Conformément à la norme NF ISO 20488 et aux articles
            L.&nbsp;111-7-2 et D.&nbsp;111-16 du Code de la consommation,
            seuls les avis d’utilisateurs ayant{' '}
            <strong>réellement visité l’établissement</strong> sont
            autorisés. Dripper se réserve le droit de vérifier, modérer,
            refuser ou supprimer tout avis qui ne respecterait pas ce
            principe. Les modalités de contrôle sont précisées sur la page
            «&nbsp;Comment nous modérons les avis&nbsp;».
          </p>

          <h3 className="font-serif text-lg">4.4. Modération</h3>
          <p>
            Dripper exerce une modération <strong>a posteriori</strong> et
            peut, à tout moment et sans préavis&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              retirer, masquer ou modifier un contenu non conforme aux
              présentes CGU ;
            </li>
            <li>
              suspendre ou supprimer un compte en cas de manquement grave
              ou répété ;
            </li>
            <li>
              conserver des copies techniques des contenus supprimés aux
              fins légales.
            </li>
          </ul>
          <p>
            Un utilisateur dont le compte est suspendu ou supprimé peut
            contester cette décision à l’adresse{' '}
            <Link href={`mailto:${MAIL}`} className="underline underline-offset-4">
              {MAIL}
            </Link>{' '}
            dans un délai de 30&nbsp;jours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">5. Label «&nbsp;Sélection&nbsp;»</h2>
          <p>
            Le label «&nbsp;<strong>Sélection</strong>&nbsp;» est attribué
            par l’équipe éditoriale de Dripper, de façon{' '}
            <strong>discrétionnaire et non payante</strong>, sur la base
            des critères publiés sur la page dédiée (grain specialty,
            barista formé et mouture à la demande, transparence de
            l’origine, espresso pur et eau filtrée).
          </p>
          <p>
            L’attribution, le maintien, le retrait ou le renouvellement du
            label ne constituent pas une obligation contractuelle et ne
            peuvent donner lieu à aucune réclamation indemnitaire. Les
            établissements peuvent à tout moment demander un audit ou une
            révision à{' '}
            <Link href={`mailto:${MAIL}`} className="underline underline-offset-4">
              {MAIL}
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">6. Propriété intellectuelle</h2>
          <p>
            Tous les éléments du Service (code, charte graphique, logo,
            textes éditoriaux, bases de données, sélections, guides,
            iconographie signée Dripper) sont protégés par le droit
            d’auteur, le droit des marques et le droit sui generis des
            bases de données. Toute reproduction, extraction, réutilisation
            ou diffusion non autorisée est interdite et constitue une
            contrefaçon sanctionnée par les articles L.&nbsp;335-2 et
            suivants et L.&nbsp;342-1 et suivants du Code de la propriété
            intellectuelle.
          </p>
          <p>
            Les marques, logos et photographies des coffee shops,
            torréfacteurs et marques tierces restent la propriété exclusive
            de leurs détenteurs respectifs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">7. Responsabilité</h2>

          <h3 className="font-serif text-lg">7.1. Responsabilité de Dripper</h3>
          <p>
            Dripper est soumis à une{' '}
            <strong>obligation de moyens</strong>. Sa responsabilité ne
            peut être engagée&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>en cas d’indisponibilité temporaire du Service ;</li>
            <li>
              en cas de contenu publié par un utilisateur tiers (Dripper
              est hébergeur au sens de la LCEN pour ce qui concerne les
              contenus utilisateurs) ;
            </li>
            <li>
              en cas de dommage indirect (perte de chance, perte de
              clientèle, préjudice d’image) ;
            </li>
            <li>
              en cas de force majeure telle que définie par l’article 1218
              du Code civil.
            </li>
          </ul>
          <p>
            Le Service étant fourni à titre gratuit, la responsabilité de
            Dripper est, dans toute la mesure permise par la loi, limitée
            aux dommages directs, prévisibles et certains, résultant d’une
            faute qui lui serait imputable.
          </p>

          <h3 className="font-serif text-lg">7.2. Responsabilité de l’utilisateur</h3>
          <p>L’utilisateur est seul responsable&nbsp;:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>de l’exactitude des informations qu’il fournit ;</li>
            <li>des contenus qu’il publie ;</li>
            <li>de la préservation de la confidentialité de ses identifiants ;</li>
            <li>du respect des droits des tiers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">8. Signalement d’un contenu illicite</h2>
          <p>
            Conformément à l’article 6-I-5 de la LCEN, toute personne peut
            signaler un contenu qu’elle estime manifestement illicite à{' '}
            <Link href={`mailto:${MAIL}`} className="underline underline-offset-4">
              {MAIL}
            </Link>
            . Les modalités de notification sont précisées dans les{' '}
            <Link href="/mentions-legales" className="underline underline-offset-4">
              Mentions légales
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">9. Données personnelles</h2>
          <p>
            Le traitement des données personnelles est décrit dans la{' '}
            <Link href="/confidentialite" className="underline underline-offset-4">
              Politique de confidentialité
            </Link>
            , qui fait partie intégrante des présentes CGU.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">10. Suspension et résiliation par Dripper</h2>
          <p>
            Dripper peut suspendre ou résilier l’accès d’un utilisateur,
            avec ou sans préavis, en cas de&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>violation des présentes CGU ;</li>
            <li>comportement frauduleux, abusif ou contraire à la loi ;</li>
            <li>atteinte à la sécurité ou à la réputation du Service ;</li>
            <li>demande d’une autorité compétente.</li>
          </ul>
          <p>
            L’utilisateur peut également supprimer son compte à tout moment
            depuis les paramètres ou à{' '}
            <Link href={`mailto:${MAIL}`} className="underline underline-offset-4">
              {MAIL}
            </Link>
            . La suppression entraîne l’anonymisation des contenus publiés
            conformément à la Politique de confidentialité.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">11. Règlement amiable et litiges</h2>

          <h3 className="font-serif text-lg">11.1. Résolution amiable préalable</h3>
          <p>
            En cas de différend lié à l’utilisation du Service,
            l’utilisateur est invité à contacter préalablement Dripper à
            l’adresse{' '}
            <Link href={`mailto:${MAIL}`} className="underline underline-offset-4">
              {MAIL}
            </Link>{' '}
            afin de rechercher une solution amiable.
          </p>

          <h3 className="font-serif text-lg">11.2. Droit applicable — Juridiction</h3>
          <p>
            Les présentes CGU sont régies par le <strong>droit français</strong>.
            À défaut de résolution amiable, les tribunaux français seront
            seuls compétents, dans les conditions prévues par les
            dispositions légales en vigueur.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">12. Dispositions diverses</h2>
          <p>
            <strong>12.1. Nullité partielle.</strong> Si l’une des
            stipulations des CGU est déclarée nulle, cette nullité
            n’affecte pas les autres stipulations qui demeurent
            applicables.
          </p>
          <p>
            <strong>12.2. Non-renonciation.</strong> Le fait pour Dripper
            de ne pas se prévaloir à un moment donné d’une stipulation des
            CGU ne peut être interprété comme une renonciation à s’en
            prévaloir ultérieurement.
          </p>
          <p>
            <strong>12.3. Intégralité.</strong> Les présentes CGU,
            ensemble avec les Mentions légales et la Politique de
            confidentialité, expriment l’intégralité de l’accord entre
            l’utilisateur et Dripper.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">13. Contact</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Questions générales</strong> :{' '}
              <Link href={`mailto:${MAIL}`} className="underline underline-offset-4">
                {MAIL}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
