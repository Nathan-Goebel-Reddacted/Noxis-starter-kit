// Domain
export { AggregateRoot } from './Domain/AggregateRoot';
export type { DomainEvent } from './Domain/DomainEvent';
export { DomainException } from './Domain/DomainException';
export type { Repository } from './Domain/Repository';
// NOTE: Countable is card-game-specific — not exported from @cardgame/shared.
// See domain-template/Domain/Countable.ts

// Application
export type { EventBus } from './Application/EventBus';
