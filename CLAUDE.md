# CLAUDE.md — Dripper

> Document de référence produit, design et technique du projet **Dripper**. À lire avant toute session de dev/design sur le projet. Conserver à la racine du repo.
>
> **Nom retenu : Dripper** — terme technique du café de spécialité (V60, Kalita, Chemex sont des drippers). International, précis, crédible pour la communauté specialty. À défaut de dispo `.com` : `dripper.fr`, `dripper.coffee`, `dripper.app`, `hellodripper.com`, `drippr.com`.

---

## 1. Vision & Mission

**Problème.** En France, la troisième vague du café progresse mais l'expérience utilisateur est fragmentée : Google Maps regorge de "coffee shops" dont beaucoup se concentrent sur le latte art, la déco Instagram ou le coworking, au détriment de ce qui compte : **la qualité de la tasse**. Les amateurs exigeants n'ont pas de source de confiance pour identifier les adresses vraiment sérieuses sur le grain — grain specialty, torréfaction fraîche, extraction maîtrisée, eau filtrée.

**Solution.** Une application web (PWA) qui référence, note et certifie les coffee shops français selon des critères **centrés sur la qualité du café**, pas sur l'ambiance. Une référence éditoriale + communautaire, comme **Raisin** pour le vin naturel, **Michelin** pour la gastronomie ou **Vivino** pour le vin grand public.

**Mission.** Élever le niveau d'exigence des amateurs français, donner de la visibilité aux vrais spécialistes, et créer une communauté autour du café de spécialité.

**Inspiration directe.** [Raisin](https://www.raisin.digital/fr/) (app vin naturel) : curation éditoriale + croissance communautaire + monétisation via abonnement des établissements. 500k+ téléchargements, 8000+ lieux, 49k+ vins référencés. Modèle validé.

---

## 2. Identité de marque

### 2.1 Nom retenu : **Dripper**

**Dripper** désigne le support à filtre du pour-over — V60 (Hario), Kalita Wave, Chemex, Origami. C'est l'outil fétiche de la 3ᵉ vague et le symbole de l'extraction maîtrisée. Le nom :

- **Parle immédiatement à la communauté specialty** (crédibilité technique instantanée).
- **International** : fonctionne FR, EN, IT, DE, ES sans adaptation.
- **7 lettres, 2 syllabes**, percutant, facile à mémoriser et à taper.
- **Brandable visuellement** : le dripper en V60 fait un logo évident (triangle / cône inversé).
- **Connotation gestuelle** : le drip = le rythme, la goutte, la précision — ça colle au positionnement éditorial.

**À vérifier sans délai :**
- Disponibilité `dripper.com`, `dripper.fr`, `dripper.coffee`, `dripper.app` sur [Namecheap](https://www.namecheap.com) / [afnic.fr](https://www.afnic.fr).
- Dépôt INPI classes 9 (logiciel/app) et 43 (services café) sur [data.inpi.fr](https://data.inpi.fr).
- Recherche de marques antérieures existantes (équipement café notamment : Hario, Kalita et autres utilisent "dripper" comme nom commun → il faut checker qu'aucune marque n'a été déposée avec "Dripper" seul comme marque).
- Handles : `@dripper`, `@dripper.app`, `@dripper.coffee`, `@drippr` sur Instagram/TikTok.

**Plans B si `dripper.com` bloqué :** `dripper.fr`, `dripper.coffee`, `dripper.app`, `getdripper.com`, `hellodripper.com`, `drippr.com` (orthographe raccourcie façon Flickr/Tumblr/Grindr).

### 2.2 Tagline (pistes)

- *"Dripper — le guide des cafés de spécialité."*
- *"Goutte à goutte, la référence du café français."*
- *"Là où le café est pris au sérieux."*
- *"Dripper. Chaque tasse a une origine."*
- *"Le guide des vrais cafés. Filtre ou pas."*

### 2.2.bis Logo / signe — pistes

- **Symbole V60 stylisé** : un triangle inversé (cône du dripper) + un point (goutte) → ultra reconnaissable, fonctionne à 16×16 px (favicon).
- **Wordmark serif** : "Dripper" en Instrument Serif italique, lettre "i" dont le point devient une goutte.
- **Monogramme "D"** avec l'intérieur de la lettre qui forme un cône / filtre.

### 2.3 Ton éditorial

Passionné mais accessible. Technique sans être snob. Opinionated — on prend position. Ton français littéraire (Fricote, Le Fooding) plutôt que marketing anglo-saxon.

### 2.4 Direction visuelle (verrouillée)

**Parti pris : monochrome éditorial — noir & blanc cassé, dark mode natif.**

- **Light mode** — fond blanc cassé chaud `#F5F1EB`, encre noire `#0A0A0A`, surfaces `#EAE5DB`, mute `#6B6B6B`.
- **Dark mode** — fond `#0F0E0C` (noir chaud légèrement brun), encre `#F5F1EB`, surfaces `#1A1915`, mute `#A09B92`.
- **Pas de couleur d'accent vive au MVP.** L'accent, c'est les photos (café, crema, barista). Le système reste sobre, presque papier-journal.
- **Typographie** : `Instrument Serif` (ou `GT Sectra`, `EB Garamond`) pour les titres — editorial, français, presque littéraire. `Inter` (ou `Söhne`) pour l'UI et les corps de texte.
- **Photo** : mate, naturelle, grain argentique, focus produit (tasse, grain, geste) > focus lieu/déco.
- **Ton visuel de référence** : Le Monde Magazine, Apartamento, Fricote, sites de torréfacteurs nordiques (April, Tim Wendelboe).

Voir `design-system.md` pour les tokens complets et `landing-dripper.html` pour l'aperçu interactif (à régénérer sous ce nouveau nom).

---

## 3. Utilisateurs cibles (personas)

### P1 — "L'amateur éclairé" (cœur de cible)
25–40 ans, urbain, voyage, suit 2–3 comptes Insta café. Moud ses grains à la maison. Cherche la meilleure tasse en déplacement. **Notre utilisateur principal.**

### P2 — "Le curieux motivé"
25–45 ans, aime le bon café mais ne connaît pas les codes. Cherche à progresser. Se fie à la curation. Source de croissance.

### P3 — "Le professionnel"
Barista, torréfacteur, gérant. Consulte pour veille concurrentielle et visibilité. **Cible B2B pour la monétisation.**

---

## 4. Différenciation — ce que l'app fait que les autres ne font pas

| Concurrent | Ce qu'ils font | Ce qui manque |
|---|---|---|
| Google Maps | Reviews grand public | Zéro filtre qualité café, mélange tout |
| Roasters App | Découverte mondiale | Pas de curation France, pas éditorial |
| European Coffee Trip | Curation manuelle Europe | Peu d'ancrage communauté FR |
| Cappuccin | Coffee passport gamifié | Pas de critères qualité transparents |

**Notre angle unique :**
1. **Double notation** : score **Tasse** (grain, extraction) séparé du score **Expérience** (lieu, service, déco). Personne ne le fait.
2. **Label "Sélection"** avec critères publics et auditables (voir §6). Transparence façon Raisin.
3. **Annuaire torréfacteurs** lié aux shops → 2e asset de contenu.
4. **Focus France** assumé : on ne dilue pas avec des shops de Berlin ou Melbourne.

---

## 5. Features

### 5.1 MVP (v1) — 3 features validées

1. **Carte + annuaire + fiche shop** avec score Tasse distinct du score Expérience.
2. **Comptes utilisateurs + carnet de dégustation** (Supabase Auth, favoris, historique, photos, notes).
3. **Blog / city guides SEO** par ville et arrondissement (structure CMS légère).

### 5.2 v1.5 — 3–6 mois après MVP

- Annuaire torréfacteurs + lien shop ↔ torréfacteur.
- Bouton "J'ai bu aussi" (social Raisin-like).
- Badges utilisateurs gamifiés ("10 torréfacteurs différents", "20 shops Selection visités").
- Newsletter hebdo (le shop du mois, interview torréfacteur).

### 5.3 v2 — 6–12 mois

- Dashboard pro pour coffee shops abonnés (stats, modération, upload menu dynamique).
- Section "événements" (cuppings, ateliers) avec billetterie.
- Filtres avancés : décaf de qualité, lait végétal de marque, grains à emporter, méthodes (V60, Aeropress, Chemex).
- App mobile native Expo avec partage de composants React (si PWA plafonne).

### 5.4 v3+ — long terme

- Marketplace grains (affiliation torréfacteurs).
- Certification pro payante pour baristas/shops.
- Extension UE (Belgique, Italie, Espagne) en gardant le focus francophone.

---

## 6. Label "Sélection" — Critères d'obtention

Un shop obtient le badge s'il coche **les 4 critères non-négociables** :

1. **Grains specialty** : score SCA 80+ attesté, ou sourcing exclusif auprès de torréfacteurs de spécialité reconnus (Belleville, Cafés Lomi, Hexagone, Coutume, L'Arbre à Café, La Cafétothèque, etc.).
2. **Barista formé + mouture à la demande** : personnel formé à l'extraction espresso, mouture fraîche pour chaque commande (pas de mouture stockée).
3. **Transparence origine** : affichage clair de l'origine, du producteur, de la date de torréfaction pour le café du jour.
4. **Espresso pur + eau filtrée** : l'espresso droit figure à la carte (pas uniquement des boissons lactées) et l'eau est filtrée (osmose inverse ou charbon).

**Process** : candidature par le shop OU nomination communautaire → visite ou audit vidéo → décision éditoriale. Le label expire tous les 12 mois (renouvellement).

**Transparence publique** : page dédiée sur le site listant critères + process. Indispensable pour la crédibilité.

---

## 7. Modèle économique

### 7.1 Revenu principal — Abonnement coffee shops (freemium B2B)

- **Gratuit** : fiche de base (nom, adresse, horaires, 1 photo).
- **Pro (≈19€/mois ou 190€/an)** : photos HD illimitées, menu dynamique, badge "Vérifié", stats de vues/clics, priorité sur la carte, réponse aux avis.
- **Selection (label)** : n'est PAS payant (éditorial). Mais les shops Selection sont mis en avant → incitation forte à passer Pro.
- **Objectif** : 100 shops abonnés Pro à 12 mois = **~22k€ ARR**. 500 shops à 24 mois = **~110k€ ARR**.

### 7.2 Revenus secondaires (à activer progressivement)

- **Affiliation torréfacteurs** : lien "acheter les grains" sur fiche shop, commission 5–15%.
- **Affiliation équipement café** : Amazon, torréfacteurs, MaxiCoffee.
- **Newsletter sponsorisée** : un encart sponso/semaine par un torréfacteur (plafonné pour ne pas diluer).
- **Billetterie événements** : commission 10–15% sur cuppings et ateliers.

### 7.3 Ce qu'on NE fait PAS

- Pas de pub display (dilue la marque premium).
- Pas de paiement pour obtenir le label Selection (intégrité éditoriale).

---

## 8. Stack technique

### 8.1 Frontend
- **Next.js 15** (App Router, React Server Components, Server Actions).
- **TypeScript** strict (`"strict": true`).
- **Tailwind CSS v4** + **shadcn/ui** (composants accessibles, copiés localement).
- **Radix UI** (sous-jacent shadcn).
- **Lucide React** (icônes).
- **next-intl** si besoin d'i18n plus tard (FR-only au MVP).
- **PWA** via `next-pwa` ou `@ducanh2912/next-pwa` — manifest + service worker + installable.

### 8.2 Backend / Data
- **Supabase** : PostgreSQL + Auth + Storage + Edge Functions + Realtime.
- **Row Level Security** activée sur toutes les tables.
- **PostGIS** activé pour la géolocalisation des shops (index GIST).
- **Supabase Storage** pour photos shops, avatars users, photos carnet.
- **Server Actions** Next.js pour les mutations simples, **Edge Functions** pour la logique lourde.

### 8.3 Cartographie
- **Mapbox GL JS** (meilleur rendu que Google Maps, coût maîtrisé, style custom).
- Alternative : **MapLibre** (open-source, gratuit) si budget serré.
- Géocoding via Mapbox Geocoding API ou `pelias/nominatim` pour moins cher.

### 8.4 Emails / Newsletter
- **Resend** (API moderne, DX excellente, ~0€ jusqu'à 3000 mails/mois).
- Templates : **React Email**.
- Newsletter : **Buttondown** ou **Beehiiv** (avec sponso native).

### 8.5 Paiements (v1.5+)
- **Stripe** pour abonnements Pro (Checkout + Billing Portal).
- **Stripe Connect** si on fait billetterie événements plus tard.

### 8.6 Analytics
- **Vercel Analytics** (trafic de base).
- **Plausible** ou **Umami** si on veut du simple et RGPD-friendly.

### 8.7 SEO & contenu
- **next-sitemap** pour génération auto.
- Données structurées `LocalBusiness` schema.org pour chaque shop (Google rich snippets).
- **MDX** pour le blog/city guides (ou **Sanity**/**Payload** si besoin de CMS collaboratif).

### 8.8 Observabilité
- **Sentry** (erreurs front + edge functions).
- **Axiom** ou Vercel Logs (logs).

### 8.9 Hébergement / DevOps
- **Vercel** (front + serverless).
- **Supabase Cloud** (DB + auth + storage).
- **GitHub** + **GitHub Actions** (CI : lint, typecheck, tests).
- **Preview deployments** sur chaque PR.

### 8.10 Tests
- **Vitest** (unit).
- **Playwright** (e2e sur les parcours critiques : auth, ajout favori, recherche carte).

---

## 9. Architecture — Structure du repo

```
/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Landing, À propos, Manifeste, Critères
│   ├── (app)/
│   │   ├── carte/                # Vue carte interactive
│   │   ├── shops/[slug]/         # Fiche shop
│   │   ├── torrefacteurs/[slug]/
│   │   ├── guides/[city]/        # City guides
│   │   ├── blog/[slug]/
│   │   └── mon-carnet/           # Espace perso
│   ├── admin/                    # Backoffice éditorial (protégé)
│   ├── pro/                      # Dashboard coffee shop abonné
│   ├── auth/
│   └── api/
│       └── webhooks/stripe/
├── components/
│   ├── ui/                       # shadcn/ui
│   ├── shop/
│   ├── map/
│   └── editorial/
├── lib/
│   ├── supabase/                 # client, server, middleware
│   ├── stripe/
│   ├── mapbox/
│   └── utils/
├── server/
│   └── actions/                  # Server Actions
├── types/
├── content/                      # MDX city guides + articles
├── public/
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── CLAUDE.md
```

---

## 10. Modèle de données (Supabase / Postgres)

### 10.1 Tables principales

```sql
-- Utilisateurs (complète auth.users)
profiles (
  id uuid PK -> auth.users(id),
  username text UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz
)

-- Torréfacteurs
roasters (
  id uuid PK,
  slug text UNIQUE,
  name text,
  city text,
  description text,
  website text,
  instagram text,
  photos jsonb,
  created_at timestamptz
)

-- Coffee shops
shops (
  id uuid PK,
  slug text UNIQUE,
  name text,
  description text,
  address text,
  city text,
  postal_code text,
  location geography(POINT, 4326),  -- PostGIS
  phone text,
  website text,
  instagram text,
  opening_hours jsonb,
  espresso_machine text,
  methods text[],                    -- ['espresso','v60','aeropress']
  options text[],                    -- ['decaf','oat_milk','beans_to_go']
  photos jsonb,                      -- [{url, alt, credit}]
  avg_flat_white_price numeric,
  status text DEFAULT 'draft',       -- draft|published|archived
  is_selection boolean DEFAULT false,
  selection_granted_at timestamptz,
  selection_expires_at timestamptz,
  subscription_tier text,            -- free|pro
  subscription_id text,              -- stripe sub id
  claimed_by uuid -> profiles(id),
  created_at timestamptz,
  updated_at timestamptz
)
CREATE INDEX shops_location_idx ON shops USING GIST (location);

-- Lien shop <-> torréfacteurs (un shop peut utiliser plusieurs torréfacteurs)
shop_roasters (
  shop_id uuid -> shops(id),
  roaster_id uuid -> roasters(id),
  is_primary boolean,
  PK (shop_id, roaster_id)
)

-- Reviews / notes utilisateur
reviews (
  id uuid PK,
  shop_id uuid -> shops(id),
  user_id uuid -> profiles(id),
  cup_score smallint CHECK (cup_score BETWEEN 1 AND 10),       -- score Tasse
  experience_score smallint CHECK (experience_score BETWEEN 1 AND 10),
  comment text,
  photos jsonb,
  visited_at date,
  drink_ordered text,
  created_at timestamptz,
  UNIQUE(shop_id, user_id)                                      -- 1 avis par user par shop
)

-- Carnet de dégustation (journal)
tasting_notes (
  id uuid PK,
  user_id uuid -> profiles(id),
  shop_id uuid -> shops(id),
  coffee_origin text,
  coffee_producer text,
  method text,
  notes text,
  rating smallint,
  photos jsonb,
  created_at timestamptz
)

-- "J'ai bu aussi" (engagement social léger)
drink_echoes (
  user_id uuid -> profiles(id),
  review_id uuid -> reviews(id),
  created_at timestamptz,
  PK (user_id, review_id)
)

-- Favoris
favorites (
  user_id uuid -> profiles(id),
  shop_id uuid -> shops(id),
  created_at timestamptz,
  PK (user_id, shop_id)
)

-- Articles blog / city guides
articles (
  id uuid PK,
  slug text UNIQUE,
  type text,                         -- 'guide'|'article'
  city text,                         -- pour les guides
  title text,
  excerpt text,
  body_mdx text,
  cover_url text,
  author_id uuid -> profiles(id),
  related_shops uuid[],
  published_at timestamptz,
  created_at timestamptz
)

-- Badges utilisateur (gamification v1.5)
badges (id, slug, name, description, icon, criteria jsonb)
user_badges (user_id, badge_id, earned_at)

-- Événements (v2)
events (id, title, shop_id, starts_at, ticket_url, ...)
```

### 10.2 RLS — Principes

- `profiles` : lecture publique (champs publics), écriture owner.
- `shops` : lecture publique si `status='published'`, écriture admin ou `claimed_by` si tier Pro.
- `reviews` : lecture publique, écriture par `auth.uid() = user_id`.
- `tasting_notes` : lecture uniquement owner (privé par défaut), toggle "public" plus tard.
- `favorites` : owner only.
- `articles` : lecture publique si `published_at IS NOT NULL`.

### 10.3 Fonctions SQL / RPC utiles

- `shops_near(lat, lng, radius_m, filters)` : RPC PostGIS retournant les shops dans un rayon, avec filtres composables.
- `shop_aggregate_scores(shop_id)` : retourne moyennes `cup_score` et `experience_score`, nb d'avis.
- Triggers : updated_at auto, MAJ agrégats à la création/edit de review.

---

## 11. Go-to-market & acquisition

### 11.1 Phase 1 — Seeding manuel (mois 1–3)
- **Toi** (ou un stagiaire passionné) visite 80–150 shops à Paris, Lyon, Bordeaux, Marseille, Lille, Nantes, Toulouse.
- Création manuelle des fiches de qualité (photos propres, descriptions soignées, critères vérifiés).
- **Objectif** : 150 fiches de qualité avant ouverture publique.

### 11.2 Phase 2 — SEO long-tail (mois 2–12)
- Guides "Meilleurs cafés de spécialité [ville/arrondissement]" → **ton principal moteur de trafic organique gratuit**.
- Schema.org `LocalBusiness` + photos optimisées.
- Backlinks via partenariats avec blogs food (Le Fooding, Fricote, Pain&Co).
- **Objectif** : ranker top 3 sur "specialty coffee [ville]" sous 9 mois.

### 11.3 Phase 3 — Communauté et presse (mois 3–6)
- Presse : Le Fooding, Fricote, Time Out, Télérama Sortir.
- Influenceurs café : comptes Insta et TikTok spécialisés.
- Soirée de lancement officielle (cupping + presse) dans un shop Selection.

### 11.4 Phase 4 — B2B outreach (mois 4+)
- Approcher shops Selection pour passer Pro → early adopters à prix réduit (6 mois à 9€ au lieu de 19€).
- Panel de torréfacteurs partenaires (les gros ambassadeurs : Lomi, Belleville, Coutume).

---

## 12. Roadmap 12 mois

| Mois | Milestone |
|---|---|
| 1 | Setup stack, design system, Supabase schema, auth, modèle shop, page d'accueil, manifeste, critères publics |
| 2 | Carte interactive, fiche shop, seeding 30 premiers shops Paris, premier city guide |
| 3 | Comptes users, favoris, reviews, carnet de dégustation, **MVP public "soft launch"** |
| 4 | Blog/city guides (5 villes), SEO solide, Sentry |
| 5 | Newsletter, badge Selection UI, 100 shops, presse |
| 6 | **Launch officiel**, soirée, relations presse, annuaire torréfacteurs |
| 7–8 | Stripe, dashboard Pro, premiers abonnements payants |
| 9–10 | Bouton "j'ai bu aussi", badges gamifiés, mobile PWA peaufinée |
| 11–12 | Affiliation torréfacteurs, 300 shops, 50 Pro payants, réflexion v2 |

---

## 13. Métriques de succès

**Nord star metric** : *nombre d'avis qualifiés (cup_score renseigné) par mois actif.*

**KPIs MVP (6 mois)**
- 150 shops publiés
- 1000 utilisateurs inscrits
- 300 avis avec score Tasse
- 10k visites organiques/mois
- 0 shop Pro payant (trop tôt)

**KPIs 12 mois**
- 400 shops publiés
- 10 000 utilisateurs inscrits
- 3 000 avis avec score Tasse
- 50 000 visites organiques/mois
- 50 shops Pro payants (~11k€ ARR)

**KPIs 24 mois**
- 800 shops publiés
- 50 000 utilisateurs
- 200+ shops Pro payants (~45k€ ARR)
- Extension 2 pays francophones (BE, CH)

---

## 14. Conventions de code (pour toute session Claude Code)

### 14.1 Général
- Langue du code : **anglais**. Langue du contenu/UI : **français**.
- TypeScript strict, pas de `any` sans justification commentée.
- Nommage fichiers : `kebab-case.tsx`, composants React : `PascalCase`.
- Routes App Router groupées avec `(group)` pour la lisibilité.

### 14.2 Next.js
- Préférer les **Server Components** par défaut. `"use client"` uniquement si interaction ou hook client nécessaire.
- **Server Actions** pour toutes les mutations simples. Pas de `/api/` route sauf webhooks et endpoints publics.
- **Cache & revalidation** : utiliser `unstable_cache`, tags, `revalidateTag()` après mutation.
- **Images** : toujours via `next/image`, formats AVIF/WebP.

### 14.3 Supabase
- Clients distincts : `createBrowserClient` (client), `createServerClient` (RSC/actions), `createServiceClient` (admin scripts, NEVER shipped to client).
- **RLS activée dès création** de chaque table. Jamais de `bypass RLS` en prod.
- Migrations via CLI Supabase, versionnées dans `/supabase/migrations`.
- Types générés auto : `supabase gen types typescript --project-id xxx > types/supabase.ts`.

### 14.4 UI
- Préférer **shadcn/ui** avant de créer un composant custom.
- Tailwind : classes dans l'ordre recommandé par le plugin Prettier.
- Pas de CSS inline, pas de `styled-components`.
- Mobile-first systématique.

### 14.5 Git
- Branches : `feat/…`, `fix/…`, `chore/…`.
- Commits conventionnels : `feat(shop): add cup_score aggregate`.
- PRs petites (<400 lignes idéalement), preview Vercel obligatoire avant merge.

### 14.6 Sécurité / secrets
- `.env.local` jamais commité.
- Secrets Vercel → env vars, jamais dans le code.
- Stripe webhook : vérifier la signature. Toujours.
- Rate limiting sur les endpoints sensibles (login, ajout review) via Upstash ou middleware.

---

## 15. Risques identifiés & mitigations

| Risque | Mitigation |
|---|---|
| Pas assez de shops couverts → app vide | Seeding manuel agressif avant ouverture publique |
| Qualité des reviews dégradée | Modération éditoriale + label Selection contrôlé en interne |
| Concurrence Roasters/Cappuccin qui se "francisent" | Creuser l'ancrage éditorial et communautaire français, pas juste l'annuaire |
| Pas de conversion B2B vers le Pro | Offrir la 1re année à -50% aux shops Selection + démontrer leads trackés |
| Dépendance Mapbox coût | Fallback MapLibre si usage explose |
| Légal : utiliser nom/photo d'un shop sans accord | Politique claire, droit de suppression sur demande, pas de reviews diffamatoires |

---

## 16. Décisions verrouillées (résumé)

- ✅ Plateforme MVP : **Web + PWA**
- ✅ Curation : **Hybride** (base communautaire + label "Sélection" éditorial)
- ✅ Monétisation prioritaire : **Abonnement coffee shops** (freemium B2B)
- ✅ Scope MVP : **France entière**
- ✅ Features MVP : **Carte+fiche+score, Carnet utilisateur, Blog/guides SEO**
- ✅ Critères Sélection : **4 critères non-négociables** (grain specialty, barista+mouture, transparence origine, espresso pur + eau filtrée)
- ✅ Stratégie GTM : **Seeding manuel + SEO long-tail**
- ✅ Nom : **Dripper** (sous réserve de disponibilité `.com`/`.fr` + absence de marque antérieure INPI)
- ✅ Direction visuelle : **monochrome noir & blanc cassé, dark mode natif, éditorial serif + sans-serif**
- ✅ Outreach / seeding shops : **manuel par le fondateur**

---

## 17. Prochaines actions immédiates

1. **Valider le nom** et réserver domaines + handles sociaux.
2. Créer le projet Next.js 15 + Supabase + Vercel (template officiel).
3. Définir le design system (shadcn + palette + typo).
4. Rédiger la page "Manifeste" et la page "Critères Selection" (contenu éditorial fondateur).
5. Construire le schéma Supabase v0 (tables du §10).

---

*Dernière mise à jour : 19 avril 2026.*