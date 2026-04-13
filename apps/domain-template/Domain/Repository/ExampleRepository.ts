import type { Repository } from '@cardgame/shared';
import type { ExampleAggregate } from '../Model/ExampleAggregate';

// Port (interface) — implemented in Infrastructure/Persistence/
// TODO: Rename and add domain-specific query methods if needed
export interface ExampleRepository extends Repository<ExampleAggregate, string> {
  // e.g. findByPlayerId(playerId: string): Promise<ExampleAggregate[]>;
}
