# Application

Orchestre le domaine. Un fichier = un cas d'usage.

| Dossier | Contenu |
|---------|---------|
| *(racine)* | Use cases — injectent Repository + EventBus, appelent le domaine |
| `Port/` | Interfaces vers des services externes (ex: MailPort, StoragePort) |

**Règles :**
- Peut importer depuis `Domain/` uniquement
- Ne contient aucune logique métier — délègue tout à l'agrégat
- Toujours : `save()` → `pullDomainEvents()` → `publish()`
- Un use case = une seule responsabilité
