import type { ExampleRepository } from '../Domain/Repository/ExampleRepository';
import type { ExampleAggregate } from '../Domain/Model/ExampleAggregate';
import { ExampleNotFoundException } from '../Domain/Exception/ExampleException';

// TODO: Rename to match the aggregate and the action (e.g. GetInstance, GetPlayer...)

export interface GetExampleQuery {
  id: string;
  // TODO: add relevant fields
}

export class GetExampleUseCase {
  constructor(private readonly repository: ExampleRepository) {}

  async execute(query: GetExampleQuery): Promise<ExampleAggregate> {
    const aggregate = await this.repository.findById(query.id);
    if (!aggregate) {
      throw new ExampleNotFoundException(query.id);
    }
    return aggregate;
  }
}
