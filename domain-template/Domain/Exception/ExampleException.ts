import { DomainException } from '@cardgame/shared';

// TODO: Create one exception class per business rule violation

export class ExampleNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Example with id "${id}" not found.`);
  }
}

export class ExampleAlreadyExistsException extends DomainException {
  constructor(id: string) {
    super(`Example with id "${id}" already exists.`);
  }
}
