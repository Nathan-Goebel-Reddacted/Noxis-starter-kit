import type { EventBus, DomainEvent } from '@cardgame/shared';

// TODO: Inject your Redis client
export class RedisEventBus implements EventBus {
  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      // TODO: redis.publish(event.eventName, JSON.stringify(event))
      console.log(`[EventBus] ${event.eventName}`, event);
    }
  }
}
