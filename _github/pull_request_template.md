## Contexte

<!-- Quel besoin cette PR adresse-t-elle ? Lien vers le ticket le cas échéant. -->

## Changements

<!-- Ce qui a été fait, pas comment. -->

## Vérifications

- [ ] `bun run lint` passe
- [ ] `bun test` passe
- [ ] La règle de dépendance est respectée : `infra → application → domain`
- [ ] Aucun type d'infrastructure (driver, transport) n'a fuité dans `domain/`
- [ ] Les payloads entrants sont validés dans l'adapter primaire
