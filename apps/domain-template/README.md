# Domain Template

Template à copier-coller pour chaque nouveau domaine.

```bash
cp -r apps/domain-template/ apps/MonNouveauDomaine/

# Workflows GitHub CI (optionnel) :
cp -r _github/ .github/
```

Puis renommer tous les fichiers `Example*` → `MonAgregat*` et supprimer les commentaires `TODO`.

## Structure

```
MonDomaine/
  package.json        ← @cardgame/[domain-name] (workspace Bun)
  tsconfig.json
  Domain/
    Model/            ← Agrégat principal + entités enfants
    Repository/       ← Interface du repository (port secondaire)
    Service/          ← Services domaine (logique hors agrégat)
    Event/            ← Domain events (nommés au passé : GameStarted, CardMoved...)
    Exception/        ← Exceptions métier typées
  Application/
    *.UseCase.ts      ← Un use case par action
    Port/             ← Interfaces vers services externes
  Infrastructure/
    Persistence/      ← Adapters secondaires — Repository PostgreSQL
    Messaging/        ← Adapters secondaires — EventBus Redis
    Http/             ← Adapters primaires — Controllers HTTP
    Socket/           ← Adapters primaires — Handlers Socket.IO
    container.ts      ← Composition root — câblage des dépendances
```

## Flux standard

```
Interface → UseCase → Aggregate.action() → raise(Event)
         ↓
     Repository.save()
         ↓
     flushDomainEvents() → EventBus.publish()
```

## Règle des couches

```
Interface → Application → Domain ← Infrastructure
```

`Domain` ne dépend de rien. `Infrastructure` implémente les interfaces du `Domain`.

## ⚠️ Workspaces Bun

Le dossier `domain-template/` n'est **pas** dans les workspaces Bun (voir `package.json` racine).
Une fois copié dans `apps/[domaine]/`, le domaine est résolu via le workspace `apps/*`.

L'import `@cardgame/shared` dans le template sera résolu correctement dès que le domaine
est placé sous un package workspace. **Ne pas tenter d'importer directement depuis `domain-template/`.**

> **Note tsconfig** : le `"extends": "../../tsconfig.json"` dans `domain-template/tsconfig.json`
> est intentionnellement prévu pour sa destination `apps/[domaine]/`. Depuis `domain-template/`
> en place le chemin est invalide, mais `domain-template/` n'est pas dans les workspaces donc
> TypeScript ne le compile jamais en place.
