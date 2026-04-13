import type { DomainEvent } from '@cardgame/shared';

// TODO: Rename to match the fact that occurred (past tense), e.g. GameStarted, CardMoved
export class ExampleCreatedEvent implements DomainEvent {
  readonly eventId: string;
  readonly eventName = 'ExampleCreated';
  readonly occurredAt: string;

  constructor(
    readonly aggregateId: string,
    // TODO: add relevant payload fields
    // Optional params with defaults allow creating new events while still supporting
    // replay from storage (pass stored eventId and occurredAt when reconstituting).
    eventId: string = crypto.randomUUID(),
    occurredAt: string = new Date().toISOString(),
  ) {
    this.eventId = eventId;
    this.occurredAt = occurredAt;
  }
}
