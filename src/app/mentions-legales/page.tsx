import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Mentions légales' };

export default function Page() {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-8 text-xs tracking-[0.25em] uppercase">
        Informations légales
      </p>
      <h1 className="font-serif text-5xl leading-[1.05] font-normal tracking-tight md:text-6xl">
        Mentions légales
      </h1>

      <div className="mt-10 space-y-8 text-base leading-relaxed">
        <p>
          Conformément aux dispositions des articles 6-III et 19 de la loi
          n° 2004-575 du 21 juin 2004 pour la Confiance dans l’économie
          numérique (LCEN), il est précisé aux utilisateurs du site{' '}
          <strong>Dripper</strong> (ci-après «&nbsp;le Site&nbsp;») l’identité
          des différents intervenants dans le cadre de sa réalisation et
          de son suivi.
        </p>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">1. Éditeur du Site</h2>
          <p>
            Le Site{' '}
            <Link href="https://dripper-app.fr" className="underline underline-offset-4">
              dripper-app.fr
            </Link>{' '}
            est édité par&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li><strong>Nom commercial</strong> : Brisepierre</li>
            <li><strong>Exploitant</strong> : Quentin Brisepierre, entrepreneur individuel</li>
            <li>
              <strong>Forme juridique</strong> : Entreprise individuelle —
              régime de la micro-entreprise
            </li>
            <li>
              <strong>Siège de l’activité</strong> : 920 route de la Mollaz,
              74170 Saint-Gervais-les-Bains, France
            </li>
            <li><strong>SIRET</strong> : 843 595 067 00029</li>
            <li><strong>SIREN</strong> : 843 595 067</li>
            <li>
              <strong>Immatriculation</strong> : Registre National des
              Entreprises (RNE), tenu par l’INPI
            </li>
            <li><strong>Code APE</strong> : 6201Z — Programmation informatique</li>
            <li>
              <strong>TVA intracommunautaire</strong> : TVA non applicable,
              art.&nbsp;293&nbsp;B du CGI (franchise en base de TVA)
            </li>
            <li>
              <strong>E-mail</strong> :{' '}
              <Link
                href="mailto:quentin.brisepierre@protonmail.com"
                className="underline underline-offset-4"
              >
                quentin.brisepierre@protonmail.com
              </Link>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">2. Directeur de la publication</h2>
          <p>
            Le Directeur de la publication du Site est{' '}
            <strong>Quentin Brisepierre</strong>, en qualité d’entrepreneur
            individuel exploitant.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">3. Hébergement</h2>
          <p>Le Site est hébergé en Europe par&nbsp;:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Vercel Inc.</strong> — 340 S Lemon Ave #4133, Walnut,
              CA 91789, États-Unis —{' '}
              <Link href="https://vercel.com" className="underline underline-offset-4">
                vercel.com
              </Link>
            </li>
          </ul>
          <p>
            La base de données, l’authentification et le stockage des
            fichiers sont assurés par&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Supabase Inc.</strong> — 970 Toa Payoh North #07-04,
              Singapour 318992 —{' '}
              <Link href="https://supabase.com" className="underline underline-offset-4">
                supabase.com
              </Link>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">4. Propriété intellectuelle</h2>
          <p>
            L’ensemble des éléments constituant le Site (textes éditoriaux,
            logo, charte graphique, photographies, illustrations,
            identifiants, sélections, arborescence, bases de données) est
            la propriété exclusive de Brisepierre ou de ses partenaires, et
            est protégé par les lois en vigueur sur la propriété
            intellectuelle.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication,
            transmission ou dénaturation, totale ou partielle, du Site ou
            de son contenu, par quelque procédé que ce soit et sur quelque
            support que ce soit, est interdite sans l’autorisation écrite
            préalable de Brisepierre. Toute exploitation non autorisée
            constitue une contrefaçon sanctionnée par les articles
            L.&nbsp;335-2 et suivants du Code de la propriété
            intellectuelle.
          </p>
          <p>
            Les photographies des établissements référencés restent la
            propriété de leurs auteurs respectifs (torréfacteurs, coffee
            shops, utilisateurs contributeurs ou Brisepierre). Les marques
            et logos des coffee shops et torréfacteurs cités sont la
            propriété de leurs détenteurs respectifs et ne sont reproduits
            qu’à des fins d’information éditoriale.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">
            5. Signalement d’un contenu — Procédure LCEN
          </h2>
          <p>
            Conformément à l’article 6-I-5 de la LCEN, tout utilisateur
            peut signaler un contenu qu’il estime manifestement illicite
            (diffamation, atteinte au droit à l’image, contrefaçon, contenu
            haineux, etc.) en adressant une notification à&nbsp;:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>E-mail</strong> :{' '}
              <Link
                href="mailto:quentin.brisepierre@protonmail.com"
                className="underline underline-offset-4"
              >
                quentin.brisepierre@protonmail.com
              </Link>
            </li>
            <li>
              <strong>Objet</strong> : «&nbsp;Signalement de contenu
              illicite&nbsp;»
            </li>
          </ul>
          <p>
            La notification doit comporter&nbsp;: les coordonnées du
            notifiant, l’identification précise du contenu litigieux (URL),
            les motifs légaux de droit et de fait justifiant que le
            contenu doit être retiré, ainsi que la copie de la
            correspondance adressée à l’auteur du contenu litigieux
            (lorsque possible).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">
            6. Droit applicable — Juridiction compétente
          </h2>
          <p>
            Le présent site et ses mentions légales sont régis par le droit
            français. En cas de litige et à défaut de résolution amiable,
            les tribunaux français seront seuls compétents.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">7. Contact</h2>
          <p>
            Pour toute question relative aux présentes mentions légales :{' '}
            <Link
              href="mailto:quentin.brisepierre@protonmail.com"
              className="underline underline-offset-4"
            >
              quentin.brisepierre@protonmail.com
            </Link>
          </p>
        </section>
      </div>
    </article>
  );
}
