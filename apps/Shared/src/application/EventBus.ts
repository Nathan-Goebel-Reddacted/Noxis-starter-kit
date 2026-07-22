import type { DomainEvent } from '../domain/DomainEvent';

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
}
