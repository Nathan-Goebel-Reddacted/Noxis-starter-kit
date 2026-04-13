import { describe, it, expect, mock } from 'bun:test';
import { CreateExampleUseCase } from './CreateExampleUseCase';
import type { ExampleRepository } from '../Domain/Repository/ExampleRepository';
import type { EventBus } from '@cardgame/shared';

describe('CreateExampleUseCase', () => {
  it('saves the aggregate and publishes its events', async () => {
    const save = mock(async () => {});
    const publish = mock(async () => {});

    const repository = {
      findById: mock(async () => null),
      save,
      delete: mock(async () => {}),
    } satisfies ExampleRepository;

    const eventBus = { publish } satisfies EventBus;

    const useCase = new CreateExampleUseCase(repository, eventBus);
    await useCase.execute({ id: '123' });

    expect(save).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledTimes(1);
  });
});
