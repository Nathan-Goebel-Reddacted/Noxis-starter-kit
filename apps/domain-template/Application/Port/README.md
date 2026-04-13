# Application/Port

Interfaces vers des **services externes** que l'application consomme — distincts des Repository.

Un port = un contrat que l'Infrastructure implémente. Le domaine n'en dépend jamais directement.

## Exemples typiques

```
Port/
  MailPort.ts        ← envoyer un email (SendGrid, SMTP...)
  StoragePort.ts     ← stocker un fichier (S3, local...)
  NotifierPort.ts    ← notifier un joueur (push, socket...)
  ClockPort.ts       ← abstraire l'heure système (utile pour les tests)
```

## Règles

- Un port = une interface TypeScript uniquement — aucune implémentation ici
- Nommage : `<Action>Port` ou `<Concept>Port`
- L'implémentation concrète va dans `Infrastructure/`
- S'injecte dans les use cases par le constructeur (injection de dépendance)

## Exemple

```typescript
// Application/Port/NotifierPort.ts
export interface NotifierPort {
  notifyPlayer(playerId: string, message: string): Promise<void>;
}

// Application/NotifyPlayerUseCase.ts
export class NotifyPlayerUseCase {
  constructor(private readonly notifier: NotifierPort) {}
  // ...
}
```
