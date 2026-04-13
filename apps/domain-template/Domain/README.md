# Domain

Contient uniquement la logique métier pure. Zéro dépendance vers l'infrastructure.

| Dossier | Contenu |
|---------|---------|
| `Model/` | Agrégats, Entités, Value Objects |
| `Repository/` | Interfaces (ports) — PAS d'implémentation ici |
| `Service/` | Services domaine (logique qui ne rentre pas dans un agrégat) |
| `Event/` | Domain events (faits passés, nommés au passé) |
| `Exception/` | Exceptions métier typées |

**Règles :**
- Aucun import depuis `Application/`, `Infrastructure/`, ou `Interface/`
- Les Repository sont des interfaces — les implémentations sont dans `Infrastructure/Persistence/`
- Les agrégats exposent uniquement des factory methods et des méthodes métier
- Les mutations passent **toujours** par l'agrégat root, jamais directement sur une entité enfant
