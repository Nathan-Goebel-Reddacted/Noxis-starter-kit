# `_domain-template` — bounded context front

Structure à copier pour chaque nouveau contexte React. Elle est **vide** : le kit
fournit le squelette et les conventions, jamais du code à adapter.

```bash
cp -r src/_domain-template src/mon-contexte
```

Même découpage en trois couches que le backend, avec une infra adaptée au
navigateur : pas de base de données ici, mais le client temps réel, les appels HTTP,
l'état et les composants.

## Structure

```
<contexte>/
  application/
    command/    ← intentions d'écriture
    query/      ← intentions de lecture
    handler/    ← orchestration, sans React
  domain/
    model/         ← modèle de données côté front (≠ payload serveur)
    value-object/  ← règles de validation immédiates
    event/         ← noms d'événements serveur écoutés
    exception/     ← erreurs métier typées
    port/          ← interface du gateway
    service/       ← règles d'affichage / métier pures
  infra/
    socket-client/ ← adapter temps réel (implémente le port)
    api/           ← adapter HTTP (implémente le même port)
    store/         ← état applicatif
    ui/            ← composants et hooks React
```

## Règle de dépendance

```
infra (React, socket, fetch)  →  application  →  domain
```

`domain/` et `application/` ne contiennent **aucun import React**. C'est le critère
qui rend ces couches testables sans DOM et réutilisables si la vue change.

## Conventions par couche

**`domain/model/`** — le modèle que manipule l'interface, distinct du payload
serveur. Si le backend renomme un champ, seul le mapping dans `infra/` change.

**`domain/port/`** — l'interface du gateway. `application/` en dépend ; il n'appelle
jamais `fetch` ni le socket directement. Un adapter HTTP et un adapter temps réel
implémentant ce même port sont interchangeables sans toucher au reste.

**`domain/value-object/`** — validation immédiate côté client, pour le retour
utilisateur. Ce n'est jamais une garantie de sécurité : le serveur revalide tout.

**`infra/ui/`** — les hooks sont les adapters primaires : ils traduisent une
intention utilisateur en commande. Les composants lisent l'état et affichent, rien
de plus.

**`infra/store/`** — l'état applicatif vit ici, et uniquement ici. Le choix de la
librairie (ou son absence) est un détail d'infrastructure, invisible depuis
`application/` et `domain/`.

## Composition root

Chaque contexte expose un provider qui instancie ses adapters et met les handlers à
disposition de l'arbre React. L'API Context sert de mécanisme d'injection de
dépendances — pas de stockage d'état applicatif.

## Points d'attention

**Désabonnement** — un abonnement à un événement serveur doit retourner sa fonction
de nettoyage, à appeler dans le `return` du `useEffect`. Sans cela, les listeners
s'accumulent à chaque montage.

**Contrat avec le backend** — les noms d'événements de `domain/event/` doivent
correspondre aux `eventName` des domain events backend. C'est le seul couplage
assumé entre les deux runtimes : le garder explicite et centralisé.
