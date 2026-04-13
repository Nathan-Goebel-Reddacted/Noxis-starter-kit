import type { ExampleRepository } from '../../Domain/Repository/ExampleRepository';
import type { ExampleAggregate } from '../../Domain/Model/ExampleAggregate';

// In-memory implementation — for tests and local development only.
// Swap for ExamplePostgresRepository in production.
// TODO: Rename to match your aggregate (e.g. InstanceInMemoryRepository)
export class ExampleInMemoryRepository implements ExampleRepository {
  private readonly store = new Map<string, ExampleAggregate>();

  async findById(id: string): Promise<ExampleAggregate | null> {
    return this.store.get(id) ?? null;
  }

  async save(aggregate: ExampleAggregate): Promise<void> {
    this.store.set(aggregate.id, aggregate);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
