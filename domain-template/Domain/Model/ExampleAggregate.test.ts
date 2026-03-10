import { describe, it, expect } from 'bun:test';
import { ExampleAggregate } from './ExampleAggregate';

describe('ExampleAggregate', () => {
  describe('create', () => {
    it('creates an aggregate with the given id', () => {
      const aggregate = ExampleAggregate.create('123');
      expect(aggregate.id).toBe('123');
    });

    it('raises an ExampleCreatedEvent', () => {
      const aggregate = ExampleAggregate.create('123');
      const events = aggregate.flushDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]?.eventName).toBe('ExampleCreated');
    });

    it('flushDomainEvents clears the pending event list', () => {
      const aggregate = ExampleAggregate.create('123');
      aggregate.flushDomainEvents();
      expect(aggregate.flushDomainEvents()).toHaveLength(0);
    });
  });

  describe('reconstitute', () => {
    it('reconstitutes without raising events', () => {
      const aggregate = ExampleAggregate.reconstitute({ id: '456' });
      expect(aggregate.id).toBe('456');
      expect(aggregate.flushDomainEvents()).toHaveLength(0);
    });
  });
});
