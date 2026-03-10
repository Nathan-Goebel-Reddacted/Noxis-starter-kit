export interface DomainEvent {
  readonly eventId: string;
  readonly eventName: string;
  /** ISO 8601 string — safe for JSON serialization/deserialization (Date objects lose their type after JSON.parse). */
  readonly occurredAt: string;
}
