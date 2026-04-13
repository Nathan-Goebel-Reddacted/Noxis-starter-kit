// Composition root — the single place where concrete dependencies are wired together.
// This file is the only place where `new` is called on infrastructure classes.
// Import this in your entry point after initializing your clients.

// TODO: Initialize your clients, then pass them as constructor arguments.

import { CreateExampleUseCase } from '../Application/CreateExampleUseCase';
import { ExampleRepositoryImpl } from './Persistence/ExamplePostgresRepository';
import { ExampleEventBus } from './Messaging/ExampleEventBus';

const repository = new ExampleRepositoryImpl();
const eventBus = new ExampleEventBus();

// Export wired use cases — import these in your controllers and handlers
export const createExampleUseCase = new CreateExampleUseCase(repository, eventBus);
