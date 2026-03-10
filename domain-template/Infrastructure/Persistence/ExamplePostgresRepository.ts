import type { ExampleRepository } from '../../Domain/Repository/ExampleRepository';
import { ExampleAggregate } from '../../Domain/Model/ExampleAggregate';
import { ExampleNotFoundException } from '../../Domain/Exception/ExampleException';

// TODO: Inject your DB client (e.g. pg Pool, Drizzle, Prisma...)
export class ExamplePostgresRepository implements ExampleRepository {
  async findById(id: string): Promise<ExampleAggregate | null> {
    // TODO: query postgres
    throw new Error('Not implemented');
  }

  async save(aggregate: ExampleAggregate): Promise<void> {
    // TODO: upsert into postgres
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    // TODO: delete from postgres
    throw new Error('Not implemented');
  }
}
