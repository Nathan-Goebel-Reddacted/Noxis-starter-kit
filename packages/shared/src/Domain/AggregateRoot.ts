import type { DomainEvent } from './DomainEvent';

export abstract class AggregateRoot {
  private readonly _domainEvents: DomainEvent[] = [];

  protected raise(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Returns all pending domain events and clears the internal list.
   * Call this after persisting the aggregate, then publish the returned events.
   */
  flushDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
