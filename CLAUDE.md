# Starter Kit — Card Game Engine (DDD/Hexagonal)

## Contexte du projet

Hub de jeux de cartes façon "Roblox pour cartes" :
- Les joueurs choisissent parmi des jeux existants
- Les créateurs peuvent définir leurs propres jeux de cartes
- Les joueurs peuvent créer des instances (parties) de ces jeux

**Équipe** : ~10 personnes · 1 an · projet étudiant (temps partiel)
**Architecture cible** : Clean Architecture + DDD + Hexagonal
**Technologies** : **Bun** (runtime backend + tooling) · **React + TypeScript** (frontend) · **Socket.IO** (communication temps réel)
**Statut** : en conception, pas encore de code

---

## Objectif du starter kit

Fournir une base technique neutre, prête à l'emploi, qui évite de repartir de zéro à chaque nouveau domaine ou service. Le kit doit être **copié-collé puis rempli**, pas modifié à la source.

Il y a deux niveaux, déblocables séquentiellement :

---

## Niveau 1 — Infrastructure universelle

> **Statut : en attente de la décision mono vs microservices**
> Langage connu (TypeScript/Bun) — reste bloqué sur l'architecture globale.

### À produire

- [ ] `docker-compose.yml` — services de base selon l'architecture retenue
  - Monolithe : db + cache + éventuellement broker
  - Microservices : un compose par service + compose global d'orchestration
- [ ] `Makefile` — cibles standards
  - `make up` / `make down` / `make restart`
  - `make test` / `make lint` / `make format`
  - `make logs` / `make shell`
  - `make migrate` (si applicable)
- [ ] `.env.example` — toutes les variables d'environnement avec valeurs neutres documentées
- [ ] `.gitignore` — adapté au langage choisi
- [ ] `README.md` — template minimal : description, prérequis, démarrage rapide
- [ ] Structure de CI (GitHub Actions ou autre)
  - Job lint + job test + job build
  - Déclenché sur PR et push main

### Note microservices
Si l'architecture retient les microservices, prévoir :
- Un dossier `infra/` à la racine contenant docker-compose global + scripts de démarrage
- Un template de service indépendant (son propre compose, son propre Makefile)

---

## Niveau 2 — Blank domain template

> **Statut : débloqué — langage arrêté (TypeScript/Bun)**
> Dépend du langage mais reste générique (sans logique métier).

### Structure de dossiers cible (à adapter au langage)

```
domain-template/
  Domain/
    Model/            ← Aggregates, Entities, Value Objects
    Repository/       ← Interfaces (ports) — PAS d'implémentation ici
    Service/          ← Domain services (logique qui ne rentre pas dans un agrégat)
    Event/            ← Domain events
    Exception/        ← Exceptions métier typées
    README.md         ← Conventions à respecter dans ce domaine
  Application/
    Command/          ← Commands + Handlers (écriture)
    Query/            ← Queries + Handlers (lecture)
    Port/             ← Interfaces vers l'extérieur (autre sens que Repository)
    README.md
  Infrastructure/
    Persistence/      ← Implémentation des Repository
    Messaging/        ← Bus d'événements, adapters
    README.md
  Interface/
    Http/             ← Controllers, DTOs entrants/sortants
    Cli/              ← Commandes CLI si besoin
    README.md
```

### Fichiers squelettes à inclure dans le template

Ces fichiers contiennent uniquement le contrat (interface/classe abstraite), jamais d'implémentation concrète :

- [ ] `AggregateRoot` — base commune à tous les agrégats, gère la liste des DomainEvents en attente
- [ ] `DomainEvent` — interface/classe de base pour tous les événements domaine
- [ ] `DomainException` — classe de base pour les exceptions métier
- [ ] `Repository<T>` — interface générique de repository (find, save, delete)
- [ ] `EventBus` — interface du bus d'événements (publish)
- [ ] `CommandBus` / `QueryBus` — interfaces des bus applicatifs (si CQRS retenu)

### Utilisation
```
cp -r domain-template/ src/Domains/NouveauDomaine/
# Remplir les dossiers, garder la structure
```

---

## Domaine métier de référence (Card Game Engine)

Le projet a déjà un modèle DDD documenté. Une fois le Niveau 2 prêt, voici les domaines à instancier :

### Agrégats principaux
| Agrégat | Rôle |
|---------|------|
| `Instance` | Aggregate Root d'une partie en cours — toute mutation passe par lui |
| `Player` | Aggregate Root d'un joueur — possède ses zones, ses compteurs |

### Entités
| Entité | Rôle |
|--------|------|
| `Board` | Organisation spatiale des zones et boutons |
| `GameZone` | Zone de jeu paramétrable (deck, main, cimetière...) |
| `CardInstance` | Une carte en jeu (état mutable) |
| `Button` | Action interactive sur le Board, déclenche un Script |

### Value Objects
| Value Object | Rôle |
|--------------|------|
| `CardDefinition` | Template immuable d'une carte |
| `ScriptDefinition` | Règle déclarative (trigger + condition + actions) |
| `CounterSet` / `Counter` | Système de compteurs transversal (vie, mana, buff...) |
| `Condition` | Prédicat composable (AND/OR/NOT + conditions métier) |
| `Action` | Brique atomique d'un script (MOVE_CARD, TAP, DRAW...) |

### Interface transversale
- `Countable` — interface implémentée par Instance, Player, GameZone, CardInstance, Board, Button

---

## Décisions arrêtées

| Décision | Choix | Impact |
|----------|-------|--------|
| Langage / Runtime | **TypeScript + Bun** | Niveau 2 débloqué |
| Frontend | **React + TypeScript** | — |
| Communication | **Socket.IO** | Architecture event-driven, pas de REST pur |

## Questions ouvertes bloquantes pour le kit

Ces décisions impactent directement la structure du starter kit :

1. **Mono vs Microservices / architecture serveur** — détermine la structure docker-compose, les instances de serveur et les bases de données
   - Option envisagée : monorepo Bun workspaces (instance racine + sous-instances par domaine) — **non confirmée**
2. **CQRS strict ou non** — détermine si CommandBus/QueryBus sont dans le template de base

---

## Ce que le starter kit NE contient PAS

- Aucune logique métier (même générique)
- Aucune implémentation concrète d'infrastructure (le template montre les interfaces, pas les adapters)
- Aucun framework présupposé dans le Niveau 2 — les interfaces sont en pseudo-code ou en langage pur, sans annotation de framework
