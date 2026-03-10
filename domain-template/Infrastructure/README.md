# Infrastructure

Contient **tous** les adapters — primaires (entrée) et secondaires (sortie).

| Dossier | Type | Contenu |
|---------|------|---------|
| `Persistence/` | Adapter secondaire (driven) | Implémentations Repository (PostgreSQL) |
| `Messaging/` | Adapter secondaire (driven) | EventBus Redis, pub/sub |
| `Http/` | Adapter primaire (driving) | Controllers HTTP |
| `Socket/` | Adapter primaire (driving) | Handlers Socket.IO |

**Règles :**
- Peut importer depuis `Domain/` et `Application/`
- Les Repository reconstituent les agrégats via `Aggregate.reconstitute()`, jamais `create()`
- Les controllers/handlers ne contiennent aucune logique métier — ils délèguent au use case
- Gestion des erreurs : attraper les `DomainException` → mapper en réponse HTTP/WS
