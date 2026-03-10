import { AggregateRoot } from '@cardgame/shared';
import { ExampleCreatedEvent } from '../Event/ExampleCreatedEvent';

// TODO: Rename to your aggregate name (e.g. Instance, Player...)
export class ExampleAggregate extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    // TODO: add your fields here
  ) {
    super();
  }

  // Factory method — the only way to create a new aggregate
  static create(id: string): ExampleAggregate {
    const aggregate = new ExampleAggregate(id);
    aggregate.raise(new ExampleCreatedEvent(id));
    return aggregate;
  }

  // Reconstitute from a persistence snapshot — does NOT raise events
  static reconstitute(snapshot: { id: string }): ExampleAggregate {
    return new ExampleAggregate(snapshot.id);
  }

  get id(): string {
    return this._id;
  }
}
