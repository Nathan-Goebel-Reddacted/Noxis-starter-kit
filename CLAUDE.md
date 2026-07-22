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

`apps/` contient exactement trois dossiers : **Bun** (backend), **React** (front),
**Shared** (building blocks). Dans `Bun/src` et `React/src`, un dossier par bounded context.

```
apps/
  Bun/src/
    _domain-template/   ← template à copier (seul contenu fourni)
    index.ts            ← point d'entrée unique, monte tous les contextes
    mongo.ts migrate.ts
  React/src/
    _domain-template/
    App.tsx socket.ts
  Shared/src/           ← AggregateRoot, ValueObject, DomainEvent, Repository, EventBus
```

Le kit ne livre **aucun** bounded context : `entity`, `component`, `system`, `gameplay`
et `hub` sont à créer par copie du template le moment venu.

Chaque bounded context (backend) :

```
<contexte>/
  application/  command/ query/ handler/
  domain/       model/ value-object/ event/ exception/ factory/ port/ service/
  infra/        mongodb/ event-bus/ web-socket/ api/
  container.ts  ← composition root
```

Côté React, `domain/` et `application/` sont identiques (sans `factory/`) ; seule
`infra/` change : `socket-client/ api/ store/ ui/`.

Règle de dépendance, non négociable : `infra → application → domain`.
`domain/` n'importe que `@app/shared`.

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

| Agrégat    | Rôle                                                                |
| ---------- | ------------------------------------------------------------------- |
| `Instance` | Aggregate Root d'une partie en cours — toute mutation passe par lui |
| `Player`   | Aggregate Root d'un joueur — possède ses zones, ses compteurs       |

### Entités

| Entité         | Rôle                                                 |
| -------------- | ---------------------------------------------------- |
| `Board`        | Organisation spatiale des zones et boutons           |
| `GameZone`     | Zone de jeu paramétrable (deck, main, cimetière...)  |
| `CardInstance` | Une carte en jeu (état mutable)                      |
| `Button`       | Action interactive sur le Board, déclenche un Script |

### Value Objects

| Value Object             | Rôle                                                  |
| ------------------------ | ----------------------------------------------------- |
| `CardDefinition`         | Template immuable d'une carte                         |
| `ScriptDefinition`       | Règle déclarative (trigger + condition + actions)     |
| `CounterSet` / `Counter` | Système de compteurs transversal (vie, mana, buff...) |
| `Condition`              | Prédicat composable (AND/OR/NOT + conditions métier)  |
| `Action`                 | Brique atomique d'un script (MOVE_CARD, TAP, DRAW...) |

### Interface transversale

- `Countable` — interface implémentée par Instance, Player, GameZone, CardInstance, Board, Button

---

## Décisions arrêtées

| Décision          | Choix                  | Impact                                                                    |
| ----------------- | ---------------------- | ------------------------------------------------------------------------- |
| Langage / Runtime | **TypeScript + Bun**   | Niveau 2 débloqué                                                         |
| Frontend          | **React + TypeScript** | —                                                                         |
| Communication     | **Socket.IO**          | Architecture event-driven, pas de REST pur                                |
| Base persistante  | **MongoDB**            | Document store — pas de migrations DDL, `make migrate` = création d'index |
| Base volatile     | **Redis**              | Parties en cours + pub/sub Socket.IO                                      |

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
