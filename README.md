# Starter Kit — DDD / Hexagonal

> Monorepo Bun · TypeScript · React · MongoDB · Socket.IO

Base technique neutre, prête à l'emploi, à copier puis remplir. Aucune logique
métier : uniquement la structure, les building blocks et les templates.

## Prérequis

- [Bun](https://bun.sh) >= 1.3 (version épinglée dans `.bun-version`)
- [Docker](https://www.docker.com) + Docker Compose

## Démarrage rapide

```bash
# 1. Variables d'environnement
cp .env.example .env

# 2. Démarrer les bases de données
make up

# 3. Installer les dépendances
bun install

# 4. Créer les index MongoDB
make migrate

# 5. Démarrer le backend et le front (deux terminaux)
bun run dev:bun     # Socket.IO + API  → :3000
bun run dev:react   # Vite             → :5173
```

## Structure

```
apps/
  Bun/      ← runtime backend — @app/bun
    src/
      _domain-template/  ← template à copier pour un nouveau contexte
      index.ts           ← point d'entrée unique (Socket.IO + HTTP)
      mongo.ts           ← client MongoDB partagé
      migrate.ts         ← déclaration des index
  React/    ← runtime front — @app/react
    src/
      _domain-template/  ← template à copier pour un nouveau contexte
      App.tsx            ← shell applicatif
      socket.ts          ← connexion Socket.IO partagée
  Shared/   ← building blocks DDD — @app/shared
```

Aucun bounded context n'est fourni : le kit ne contient que les templates.
Chaque contexte est découpé en trois couches — `application/`, `domain/`, `infra/` —
détaillées dans le README de chaque `_domain-template`.

## Ajouter un bounded context

```bash
# backend
cp -r apps/Bun/src/_domain-template apps/Bun/src/mon-contexte

# front
cp -r apps/React/src/_domain-template apps/React/src/mon-contexte
```

Les templates sont des arborescences **vides** : les conventions de chaque couche
sont décrites dans leur `README.md`. Une fois le contexte écrit, le câbler dans
`apps/Bun/src/index.ts`.

## Commandes

| Commande         | Description                                         |
| ---------------- | --------------------------------------------------- |
| `make init`      | Copie `.env` et installe les dépendances            |
| `make up`        | Démarre MongoDB + Redis                             |
| `make down`      | Arrête les services                                 |
| `make restart`   | Redémarre les services                              |
| `make logs`      | Affiche les logs en continu                         |
| `make shell-db`  | Ouvre un shell mongosh                              |
| `make dev-bun`   | Lance le backend en watch                           |
| `make dev-react` | Lance le front (Vite)                               |
| `make app-build` | Construit les images Docker des applications        |
| `make app-up`    | Démarre les applications conteneurisées             |
| `make app-down`  | Arrête les applications conteneurisées              |
| `make test`      | Lance les tests                                     |
| `make lint`      | Lint + type check                                   |
| `make format`    | Formate le code                                     |
| `make migrate`   | Crée les index / applique les migrations de données |

En développement, `make up` ne démarre que les bases : les applications tournent en
local via `make dev-bun` / `make dev-react`, pour garder le rechargement à chaud. Les
services applicatifs sont derrière le profil Compose `app`, utilisé par `make app-up`
pour reproduire la production.

## Architecture

- **MongoDB** — données persistantes
- **Redis** — fourni par le compose, **non câblé** dans le code
- **Socket.IO** — communication temps réel client ↔ serveur
- **Un seul process Bun** héberge tous les bounded contexts : ce sont des
  librairies montées par `apps/Bun/src/index.ts`, pas des serveurs indépendants.

## Ce que le kit ne fournit pas

Ce sont des décisions de projet, volontairement laissées ouvertes. Chacune est à
trancher avant d'écrire le premier bounded context.

| Sujet                    | État                                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Framework HTTP**       | `src/index.ts` est un `node:http` brut qui ne sert que `/health`. Aucun routeur : à choisir (Hono, Elysia…) |
| **Validation d'entrées** | Aucune. Les payloads socket et HTTP sont hostiles : prévoir un schéma (Zod ou équivalent) dans les adapters |
| **Logger**               | `console.log`. Pas de logger structuré ni de corrélation de requêtes                                        |
| **Configuration**        | Seul `DATABASE_URL` est vérifié au démarrage. Les autres variables ont des defaults silencieux              |
| **Authentification**     | Aucune. Le handshake Socket.IO n'identifie personne                                                         |
| **Redis**                | Conteneur fourni, aucun client ni adapter. L'implémenter ou le retirer du compose, du `.env` et de la CI    |
| **Outbox**               | Documenté dans le README du template backend, non implémenté                                                |
| **Tests d'intégration**  | Seuls les building blocks de `Shared/` sont testés. Rien pour un repository réel                            |
| **CD**                   | La CI construit les images mais ne les pousse pas. Registre et cible de déploiement à définir               |

## Contraintes de version connues

- **`mongodb` reste en 6.x.** La 7.x embarque `bson` 7, qui appelle
  `v8.startupSnapshot.isBuildingSnapshot()` — non implémenté dans Bun 1.3. L'import du
  driver lève alors `ERR_NOT_IMPLEMENTED` au démarrage. Le typecheck ne détecte pas ce
  problème : il n'apparaît qu'à l'exécution. Ne pas laisser Dependabot passer en 7 sans
  vérifier que Bun a comblé le manque.
- **Le bundle backend garde ses dépendances externes** (`--packages external`) : inliner
  le driver MongoDB déclenche la même erreur. L'image runtime embarque donc
  `node_modules`.

## Renommer le kit

Le scope des packages est `@app`. Pour l'adapter à un projet :

```bash
grep -rl '@app/' --exclude-dir=node_modules . | xargs sed -i 's|@app/|@monprojet/|g'
```

Penser à `tsconfig.json` (`paths`) et `apps/React/vite.config.ts` (`resolve.alias`).
