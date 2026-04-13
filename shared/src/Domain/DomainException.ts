export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Restore prototype chain — required for `instanceof` checks to work correctly
    // when targeting ES5 or when transpilers break the native class hierarchy.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
