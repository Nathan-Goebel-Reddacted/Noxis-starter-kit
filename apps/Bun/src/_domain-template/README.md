# `_domain-template` — bounded context backend

Structure à copier pour chaque nouveau bounded context. Elle est **vide** : le kit
fournit le squelette et les conventions, jamais du code à adapter.

```bash
cp -r src/_domain-template src/mon-contexte
```

## Structure

```
<contexte>/
  application/
    command/    ← intentions d'écriture (objets plats, primitives)
    query/      ← intentions de lecture + read models (DTO)
    handler/    ← orchestration : charge → délègue au domaine → persiste → publie
  domain/
    model/         ← agrégats et entités
    value-object/  ← objets sans identité, immuables, égalité par valeur
    event/         ← domain events
    exception/     ← exceptions métier typées
    factory/       ← construction d'agrégats quand elle est non triviale
    port/          ← interfaces vers l'extérieur (repositories, services externes)
    service/       ← règles métier qui n'appartiennent à aucun agrégat
  infra/
    mongodb/     ← adapters de persistance (implémentent les ports)
    event-bus/   ← adapter de publication d'événements
    web-socket/  ← adapter primaire temps réel
    api/         ← adapter primaire HTTP
```

Les dossiers inutiles se suppriment : `factory/` et `service/` sont facultatifs, et
un contexte sans API HTTP n'a pas besoin de `infra/api/`.

## Règle de dépendance

```
infra  →  application  →  domain
```

Les flèches ne vont **jamais** dans l'autre sens.

- `domain/` n'importe rien d'autre que `@app/shared` et lui-même. Aucun `mongodb`,
  aucun `socket.io`, aucun `Request`/`Response`.
- `application/` importe `domain/`, jamais `infra/`.
- `infra/` implémente les interfaces déclarées dans `domain/port/`.

Un import de `infra/` depuis `domain/` ou `application/` est un bug d'architecture,
pas un détail de style.

## Conventions par couche

**`domain/model/`** — les agrégats étendent `AggregateRoot` (`@app/shared`) et
émettent leurs événements via `raise()`. Prévoir deux chemins de construction : une
création qui émet un événement, et une reconstitution depuis la persistance qui n'en
émet aucun.

**`domain/value-object/`** — étendre `ValueObject` et valider dans la fabrique. Dès
qu'un identifiant circule, préférer un value object à un `string` : c'est ce qui
empêche d'intervertir deux identifiants par erreur.

**`domain/port/`** — les interfaces décrivent un besoin du domaine, pas une techno.
`Repository` de `@app/shared` couvre le cas courant ; l'étendre pour les besoins
spécifiques.

**`application/handler/`** — orchestre, ne décide pas. Aucune règle métier ici.

**`infra/mongodb/`** — c'est le seul endroit qui connaît la forme des documents.
`_id` et les types du driver ne doivent jamais franchir la frontière du domaine :
prévoir un mapping explicite document ↔ agrégat dans les deux sens.

**`infra/web-socket/` et `infra/api/`** — adapters primaires. Ils traduisent un
message entrant en commande, puis une exception métier en code de transport (statut
HTTP, payload d'erreur). Les payloads entrants sont hostiles : les valider ici, et
n'exposer au client que les messages d'exceptions métier — jamais une erreur interne.

## Composition root

Chaque contexte expose une fonction unique qui instancie ses adapters et retourne ses
handlers câblés. C'est le seul fichier autorisé à faire `new` sur de l'infrastructure ;
elle reçoit ses dépendances (la connexion MongoDB, par exemple) en argument et est
appelée par `src/index.ts`. Le reste du contexte ignore quel adapter est en place.

Corollaire utile : fournir un second adapter en mémoire pour un même port permet de
tester sans base et prouve que l'hexagone est bien fermé.

## Points d'attention

**Atomicité** — persister l'agrégat puis publier ses événements n'est pas atomique :
si le process meurt entre les deux, l'événement est perdu. Dès que la cohérence entre
contextes compte, passer au pattern outbox (écrire les événements dans la même
écriture MongoDB, puis les relayer).

**Événements** — `flushDomainEvents()` est destructif : l'appeler une seule fois,
après persistance, juste avant publication.
