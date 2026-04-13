import type { ExampleRepository } from '../../Domain/Repository/ExampleRepository';
import { ExampleAggregate } from '../../Domain/Model/ExampleAggregate';

// TODO: Inject your persistence client (e.g. pg Pool, Drizzle, Prisma...)
// TODO: Rename to match your implementation (e.g. ExamplePostgresRepository, ExampleInMemoryRepository...)
export class ExampleRepositoryImpl implements ExampleRepository {
  async findById(_id: string): Promise<ExampleAggregate | null> {
    // TODO: implement
    throw new Error('Not implemented');
  }

  async save(_aggregate: ExampleAggregate): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented');
  }

  async delete(_id: string): Promise<void> {
    // TODO: implement
    throw new Error('Not implemented');
  }
}
