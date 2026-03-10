import type { DomainEvent } from '../Domain/DomainEvent';

export interface EventBus {
  /**
   * Publishes a batch of domain events.
   * Typically called after pulling events from an aggregate and persisting it.
   */
  publish(events: DomainEvent[]): Promise<void>;
}
