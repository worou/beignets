# Les Beignets de Mamie — site e-commerce

API **Symfony 7.4 + API Platform 4 + PostgreSQL 16** · Front **React 18 + TypeScript + Vite**.
Voir `PROMPT.md` pour le cahier des charges complet.

## Démarrage rapide (Docker)

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Site | http://localhost:5173 |
| API + documentation Swagger | http://localhost:8000/api |
| PostgreSQL | localhost:5433 (app / app_password, base `beignets`) |

Au premier démarrage, le conteneur API installe les dépendances Composer, génère les clés JWT, joue les migrations,
crée le catalogue (`app:seed`) et le compte admin.

**Espace admin** : http://localhost:5173/admin — `admin@beignetsdemamie.fr` / `Mamie2026!`
(à changer dans `docker-compose.yml` avant toute mise en ligne).
L’onglet **Comptes** de l’espace admin permet d’ajouter ou retirer des administrateurs et de changer son mot de passe. Voir [Administration](#administration).

## Sans Docker

```bash
# API (PHP 8.2+, Composer, PostgreSQL)
cd backend
composer install
# créer .env.local avec votre DATABASE_URL
php bin/console doctrine:database:create
php bin/console lexik:jwt:generate-keypair
php bin/console doctrine:migrations:migrate -n
php bin/console app:seed
php bin/console app:create-admin admin@beignetsdemamie.fr   # mot de passe demandé
symfony serve --port=8000      # ou : php -S localhost:8000 -t public

# Front (Node 18+)
cd frontend
npm install
npm run dev
```

## Administration

Console : http://localhost:5173/admin (connexion sur `/admin/connexion`).

| Onglet | Ce qu'on y fait |
|---|---|
| Commandes | Liste filtrable par statut, détail (articles, adresse, notes), changement de statut, contact WhatsApp du client |
| Produits & prix | Prix de chaque format, mise en vente d'un format ou d'un produit, mise en avant, textes (nom, accroche, description) |
| Messages | Messages du formulaire de contact, marqués « traités » |

**Authentification** : `POST /api/login_check` (`{"email", "password"}`) renvoie un JWT valable 8 h, à envoyer en
`Authorization: Bearer …`. Les mots de passe sont hachés par Symfony (`password_hashers: auto`, bcrypt/argon2).
De mauvais identifiants renvoient **401** ; une route admin appelée sans jeton valide renvoie aussi **401**,
et **403** si le compte n'a pas `ROLE_ADMIN`.

### Créer le premier compte admin

Avec Docker, le compte `ADMIN_EMAIL` / `ADMIN_PASSWORD` de `docker-compose.yml` est créé au premier démarrage
(`--if-not-exists` : un compte existant n'est jamais modifié). Ces valeurs sont destinées au développement : changez-les avant toute mise en ligne.

Sans Docker, ou pour ajouter un autre administrateur :

```bash
cd backend
php bin/console app:create-admin mamie@exemple.fr        # le mot de passe est demandé en saisie masquée
```

Le mot de passe doit faire au moins 10 caractères. Il peut aussi être passé en second argument,
mais il reste alors dans l'historique du terminal.

### Réinitialiser un mot de passe

La commande refuse de toucher un compte existant, sauf demande explicite :

```bash
php bin/console app:create-admin mamie@exemple.fr --reset-password
```

Avec Docker : `docker compose exec api php bin/console app:create-admin mamie@exemple.fr --reset-password`.

## Architecture

```
backend/
  src/Entity/      Category, Product, ProductVariant, Order, OrderItem, ContactMessage, User
  src/State/       OrderProcessor : recalcul des prix, référence BDM-AAMMJJ-XXXX
  src/Validator/   DeliverableOrder : zone IDF, date, disponibilité, minimum de commande
  src/Doctrine/    ActiveProductExtension : produits désactivés invisibles du public
  src/Service/     Pricing : frais de livraison et seuils (variables SHOP_* du .env)
  src/Command/     app:seed, app:create-admin
  src/Catalog/     Catalogue initial (prix des maquettes)
  migrations/      Schéma PostgreSQL
frontend/
  src/pages/       Accueil, Histoire, Produits, Fiche, Tarifs, Galerie, Contact, Panier, Commande, Admin
  src/context/     Panier (localStorage), Boutique (catalogue + config), Auth (JWT)
  public/images/   Visuels extraits des maquettes
```

### Endpoints principaux

| Méthode | Route | Accès |
|---|---|---|
| GET | `/api/products` (filtres `category.slug`, `kind`, `featured`, `slug`) | public |
| GET | `/api/categories`, `/api/shop-config` | public |
| POST | `/api/orders` | public (prix calculés côté serveur) |
| GET | `/api/orders/{uuid}` | public (UUID non devinable) |
| GET / PATCH | `/api/orders`, `/api/orders/{uuid}` | admin |
| PATCH | `/api/products/{id}`, `/api/product_variants/{id}` | admin |
| POST | `/api/contact_messages` | public |
| POST | `/api/login_check` | renvoie le JWT |
| GET / POST | `/api/admin/accounts` | admin (liste, ajout d’un administrateur) |
| DELETE | `/api/admin/accounts/{id}` | admin (impossible sur son propre compte) |
| POST | `/api/admin/password` | admin (change son propre mot de passe) |

## À personnaliser avant la mise en ligne
- Numéro WhatsApp (`SHOP_WHATSAPP_NUMBER`, repris de la maquette), e-mail, liens réseaux sociaux.
- Mentions légales (SIRET, hébergeur), `APP_SECRET`, `JWT_PASSPHRASE`, mots de passe.
- Photos : les visuels actuels sont recadrés depuis les maquettes (basse définition) ; remplacez-les par des photos HD dans `frontend/public/images/` en gardant les mêmes noms.
- Pistes suivantes : paiement en ligne (Stripe), e-mail de confirmation (Symfony Mailer), upload d'images depuis l'admin.

## Production (indicatif)
`npm run build` dans `frontend/` produit `dist/`, à servir sur le même domaine que l'API (`/api` → Symfony),
ou définir `VITE_API_URL` et `CORS_ALLOW_ORIGIN`. Côté API : `APP_ENV=prod`, `composer install --no-dev -o`.
