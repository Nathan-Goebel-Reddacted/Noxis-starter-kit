import { describe, expect, it } from 'bun:test';
import { DomainException } from './DomainException';

class NotFoundException extends DomainException {}

describe('DomainException', () => {
  it('keeps instanceof working through the hierarchy', () => {
    const error = new NotFoundException('missing');

    expect(error).toBeInstanceOf(NotFoundException);
    expect(error).toBeInstanceOf(DomainException);
    expect(error).toBeInstanceOf(Error);
  });

  it('names itself after the concrete subclass', () => {
    expect(new NotFoundException('missing').name).toBe('NotFoundException');
  });

  it('carries its message', () => {
    expect(new NotFoundException('missing').message).toBe('missing');
  });
});
