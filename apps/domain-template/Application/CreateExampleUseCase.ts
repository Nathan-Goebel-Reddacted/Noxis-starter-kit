import type { EventBus } from '@cardgame/shared';
import type { ExampleRepository } from '../Domain/Repository/ExampleRepository';
import { ExampleAggregate } from '../Domain/Model/ExampleAggregate';

// TODO: Rename to the action it performs (e.g. CreateInstance, JoinGame...)
// TODO: One file per use case

export interface CreateExampleCommand {
  id: string;
  // TODO: add relevant fields
}

export class CreateExampleUseCase {
  constructor(
    private readonly repository: ExampleRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateExampleCommand): Promise<void> {
    const aggregate = ExampleAggregate.create(command.id);
    await this.repository.save(aggregate);

    // WARNING: if publish() throws after save(), events are silently lost.
    // For production systems, consider the Transactional Outbox pattern:
    // https://microservices.io/patterns/data/transactional-outbox.html
    await this.eventBus.publish(aggregate.flushDomainEvents());
  }
}
