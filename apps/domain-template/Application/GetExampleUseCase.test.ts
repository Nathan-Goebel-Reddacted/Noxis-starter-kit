import { describe, it, expect, beforeEach } from 'bun:test';
import { GetExampleUseCase } from './GetExampleUseCase';
import { ExampleInMemoryRepository } from '../Infrastructure/Persistence/ExampleInMemoryRepository';
import { ExampleAggregate } from '../Domain/Model/ExampleAggregate';
import { ExampleNotFoundException } from '../Domain/Exception/ExampleException';

describe('GetExampleUseCase', () => {
  let repository: ExampleInMemoryRepository;
  let useCase: GetExampleUseCase;

  beforeEach(() => {
    repository = new ExampleInMemoryRepository();
    useCase = new GetExampleUseCase(repository);
  });

  it('returns the aggregate when it exists', async () => {
    const aggregate = ExampleAggregate.create('abc');
    aggregate.flushDomainEvents(); // discard events — we are reconstituting
    await repository.save(aggregate);

    const result = await useCase.execute({ id: 'abc' });
    expect(result.id).toBe('abc');
  });

  it('throws ExampleNotFoundException when the aggregate does not exist', async () => {
    await expect(useCase.execute({ id: 'unknown' })).rejects.toBeInstanceOf(
      ExampleNotFoundException,
    );
  });
});
