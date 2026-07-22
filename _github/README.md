# \_github/

Template GitHub à copier dans votre projet après avoir cloné le starter kit.

```bash
cp -r _github/ .github/
```

Le préfixe `_` empêche GitHub Actions d'exécuter ces workflows sur le dépôt du
starter kit lui-même. Le kit possède sa propre CI dans `.github/`, dont le contenu
est identique — les deux doivent rester synchronisés lorsqu'un workflow évolue.

## Contenu

| Fichier                    | Rôle                                                           |
| -------------------------- | -------------------------------------------------------------- |
| `workflows/ci.yml`         | Lint, tests, build, build d'images — sur push `main` et sur PR |
| `dependabot.yml`           | Mises à jour npm, GitHub Actions et images Docker              |
| `pull_request_template.md` | Checklist de PR, dont les invariants d'architecture            |

## `ci.yml` en détail

Quatre jobs indépendants :

- **lint** — `bun run typecheck` (trois passes `tsc`, une par package), puis
  `eslint .` et `prettier --check .` en mode lecture seule.
- **test** — démarre MongoDB 7 et Redis 7 en services, avec les mêmes identifiants
  que `docker-compose.yml`, puis lance `bun test`.
- **build** — construit les deux applications via `bun run --filter '<pkg>' build`.
- **docker** — construit les deux images sans les pousser, pour détecter une
  régression de `Dockerfile` avant le déploiement.

La version de Bun est lue depuis `.bun-version` : la CI ne dérive pas quand une
nouvelle version sort.

## À adapter après la copie

- **Scope des packages** — les étapes de build référencent `@app/bun` et
  `@app/react`. Si vous renommez le scope, mettre ces lignes à jour.
- **Identifiants des services** — `app` / `app` en dur : acceptable pour des
  conteneurs éphémères de CI, à ne jamais réutiliser ailleurs.
- **Branche** — le déclencheur cible `main`.
- **Services inutilisés** — le job `test` démarre Redis. Si le projet ne s'en sert
  pas, retirer le service.

## Pas de CD

Ce template ne contient **que** de l'intégration continue. Le job `docker` construit
les images mais ne les pousse nulle part : registre, secrets et cible de déploiement
dépendent entièrement du projet.
