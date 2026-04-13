# Card Game Engine

> Hub de jeux de cartes — monorepo Bun · DDD/Hexagonal · Socket.IO

## Prérequis

- [Bun](https://bun.sh) >= 1.1
- [Docker](https://www.docker.com) + Docker Compose

## Démarrage rapide

```bash
# 1. Variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 2. Démarrer les bases de données
make up

# 3. Installer les dépendances
bun install

# 4. Lancer les migrations
make migrate

# 5. Démarrer le serveur en dev
bun --filter @cardgame/server run dev
```

## Structure

```
apps/
  server/   ← Serveur Bun (Socket.IO)
  web/      ← Frontend React + TypeScript
shared/     ← Building blocks DDD (@cardgame/shared)
```

## Commandes

| Commande | Description |
|----------|-------------|
| `make up` | Démarre PostgreSQL + Redis |
| `make down` | Arrête les services |
| `make restart` | Redémarre les services |
| `make logs` | Affiche les logs en continu |
| `make shell-db` | Ouvre un shell psql |
| `make test` | Lance les tests |
| `make lint` | Lint + type check |
| `make format` | Formate le code |
| `make migrate` | Applique les migrations |

## Architecture

- **PostgreSQL** — données persistantes (définitions de jeux, joueurs, historique)
- **Redis** — état des parties en cours (volatile, pub/sub Socket.IO)
- **Socket.IO** — communication temps réel client ↔ serveur
