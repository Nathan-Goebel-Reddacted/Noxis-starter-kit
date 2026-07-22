import { describe, expect, it } from 'bun:test';
import { AggregateRoot } from './AggregateRoot';
import type { DomainEvent } from './DomainEvent';

const event = (name: string): DomainEvent => ({
  eventId: crypto.randomUUID(),
  eventName: name,
  occurredAt: new Date().toISOString(),
});

class TestAggregate extends AggregateRoot {
  emit(name: string): void {
    this.raise(event(name));
  }
}

describe('AggregateRoot', () => {
  it('accumulates raised events', () => {
    const aggregate = new TestAggregate();

    aggregate.emit('first');
    aggregate.emit('second');

    expect(aggregate.flushDomainEvents().map((e) => e.eventName)).toEqual(['first', 'second']);
  });

  it('clears the list once flushed', () => {
    const aggregate = new TestAggregate();
    aggregate.emit('first');

    aggregate.flushDomainEvents();

    expect(aggregate.flushDomainEvents()).toHaveLength(0);
  });

  it('returns a copy, not the internal list', () => {
    const aggregate = new TestAggregate();
    aggregate.emit('first');

    const events = aggregate.flushDomainEvents();
    events.push(event('injected'));

    aggregate.emit('second');
    expect(aggregate.flushDomainEvents()).toHaveLength(1);
  });
});
