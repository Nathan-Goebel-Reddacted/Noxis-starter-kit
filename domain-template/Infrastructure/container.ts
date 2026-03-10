// Composition root — the single place where concrete dependencies are wired together.
// This file is the only place where `new` is called on infrastructure classes.
// Import this in your entry point (apps/api/src/index.ts) after initializing DB/Redis clients.

// TODO: Initialize your DB and Redis clients, then pass them as constructor arguments.
// e.g.
//   import postgres from 'postgres';
//   import { createClient } from 'redis';
//   const sql = postgres(process.env['DATABASE_URL']!);
//   const redis = createClient({ url: process.env['REDIS_URL'] });
//   await redis.connect();

import { CreateExampleUseCase } from '../Application/CreateExampleUseCase';
import { ExamplePostgresRepository } from './Persistence/ExamplePostgresRepository';
import { RedisEventBus } from './Messaging/RedisEventBus';

const repository = new ExamplePostgresRepository();
const eventBus = new RedisEventBus();

// Export wired use cases — import these in your HTTP controllers and socket handlers
export const createExampleUseCase = new CreateExampleUseCase(repository, eventBus);
