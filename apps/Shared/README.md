# Shared

Building blocks DDD **agnostiques du métier**, partagés par tous les bounded contexts
(`apps/Bun/src/*` et `apps/React/src/*`).

## Règle d'or

Ce package ne contient **aucune** logique métier et **aucune** dépendance à une techno
(pas de MongoDB, pas de client temps réel, pas de React). Uniquement des contrats et
des classes de base. Si un besoin ne concerne qu'un seul contexte, il n'a rien à faire
ici.

## Contenu

| Export                | Type             | Rôle                                                                                                 |
| --------------------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| `AggregateRoot`       | classe abstraite | Base des agrégats — accumule les domain events via `raise()`, les restitue via `flushDomainEvents()` |
| `ValueObject<TProps>` | classe abstraite | Base des value objects — props gelées, égalité par valeur                                            |
| `DomainEvent`         | interface        | Contrat d'un événement domaine (`eventId`, `eventName`, `occurredAt`)                                |
| `DomainException`     | classe abstraite | Base des exceptions métier typées                                                                    |
| `Repository<T, TId>`  | interface        | Port de persistance générique (`findById` / `save` / `delete`)                                       |
| `EventBus`            | interface        | Port de publication d'événements (`publish`)                                                         |

## Usage

Deux formes d'import, toutes deux aliasées — jamais de chemin relatif
(`../../Shared`) depuis un bounded context.

```ts
import { AggregateRoot, ValueObject, type DomainEvent } from '@app/shared';

import { DomainException } from '@app/shared/domain/DomainException';
import type { EventBus } from '@app/shared/application/EventBus';
```

### Où l'alias est déclaré

| Fichier                     | Rôle                                                                   |
| --------------------------- | ---------------------------------------------------------------------- |
| `tsconfig.json` (racine)    | `paths` — résolution pour TypeScript et les IDE                        |
| `apps/Shared/package.json`  | `exports` — résolution runtime par Bun (via le lien workspace)         |
| `apps/React/vite.config.ts` | `resolve.alias` — résolution par Vite + HMR sur les édits de `Shared/` |

Les trois doivent rester synchronisés : ajouter un dossier dans `src/` implique de
vérifier qu'il est couvert par le pattern `./<couche>/*` des `exports`.

## Détails d'implémentation

- `occurredAt` est une **chaîne ISO 8601**, pas un `Date` : un objet `Date` perd son
  type après un aller-retour JSON, ce qui casse la sérialisation des événements.
- `DomainException` rétablit la chaîne de prototypes (`Object.setPrototypeOf`) pour
  que `instanceof` fonctionne après transpilation.
- `ValueObject.equals()` compare via `JSON.stringify` : correct pour des primitives
  et des objets plats, à surcharger pour des VO contenant des `Date`, `Set`, `Map`
  ou des VO imbriqués.
- `flushDomainEvents()` est **destructif** : il vide la liste. À appeler une seule
  fois, après persistance, juste avant de publier.
