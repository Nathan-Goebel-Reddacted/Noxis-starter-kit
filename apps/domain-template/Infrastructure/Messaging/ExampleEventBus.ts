import type { EventBus, DomainEvent } from '@cardgame/shared';

// TODO: Inject your messaging client (e.g. Redis, RabbitMQ, in-memory...)
// TODO: Rename to match your implementation (e.g. RedisEventBus, InMemoryEventBus...)
export class ExampleEventBus implements EventBus {
  async publish(_events: DomainEvent[]): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented');
  }
}
