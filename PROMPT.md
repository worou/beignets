# Prompt amélioré — Les Beignets de Mamie

**Rôle** : tu es développeur·se fullstack senior (Symfony / API Platform / React) et UI designer.

**Objectif** : réaliser le site e-commerce « Les Beignets de Mamie » (beignets africains faits maison, livraison Paris & Île-de-France), fidèle aux maquettes fournies, prêt à être lancé en local avec Docker.

## Stack imposée
- **API** : Symfony 7.3 + API Platform 4, Doctrine ORM 3, **PostgreSQL 16**, migrations Doctrine, authentification JWT (LexikJWT) pour l'administration.
- **Front** : React 18 + TypeScript + Vite + React Router, CSS maison (pas de framework UI), polices auto-hébergées.
- **Infra** : `docker compose up` lance base, API et front ; catalogue et compte admin créés automatiquement.

## Design (respecter les maquettes)
- Palette : vert feuille `#1E7B3A`, jaune soleil `#F2B230`, orange `#E8752A`, brun cacao `#4A2412`, crème `#FBF3E4`.
- Titres manuscrits « pinceau » (Kaushan Script), lettre de Mamie en écriture (Caveat), texte en Nunito.
- Éléments signature : bandeaux coups de pinceau colorés, post-it jaunes inclinés, cœurs, feuilles, frise wax/kente en pied de page, CTA WhatsApp omniprésent.
- Responsive mobile-first, accessible (contrastes, focus visibles, textes alternatifs, navigation clavier).

## Pages
Accueil (hero, réassurance, mots de Mamie, spécialités, buckets, avis, CTA) · Notre histoire · Produits (filtres catégorie/type, ajout rapide) · Fiche produit (choix du format, quantité) · Tarifs · Galerie (lightbox) · Contact (formulaire → API) · Panier · Commande · Confirmation · Mentions légales · Espace admin.

## Règles métier
- Produits à l'unité, **buckets** Solo (10) / Duo (20+3) / Family (50+5), buckets mixtes, sauces en supplément — prix des maquettes.
- Prix **toujours recalculés côté serveur** ; lignes de commande figées (nom, prix).
- Livraison uniquement codes postaux 75/77/78/91/92/93/94/95 ; 3,90 €, offerte dès 30 € ; minimum 10 € ; retrait gratuit.
- Date souhaitée ≤ 30 jours + créneau horaire. Paiement à la livraison ou au retrait.
- Commande alternative via WhatsApp (message pré-rempli avec le panier ou la commande).
- Admin : suivi des commandes et changement de statut, prix / mise en vente / mise en avant des produits, messages de contact.

## Livrables
Code complet backend + frontend, migrations, commande de seed, Docker Compose, README d'installation.
