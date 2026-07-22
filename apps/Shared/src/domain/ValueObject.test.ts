import { describe, expect, it } from 'bun:test';
import { ValueObject } from './ValueObject';

class Money extends ValueObject<{ amount: number; currency: string }> {
  static of(amount: number, currency: string): Money {
    return new Money({ amount, currency });
  }
}

class Weight extends ValueObject<{ amount: number; currency: string }> {
  static of(amount: number, currency: string): Weight {
    return new Weight({ amount, currency });
  }
}

describe('ValueObject', () => {
  it('considers two instances with the same props equal', () => {
    expect(Money.of(10, 'EUR').equals(Money.of(10, 'EUR'))).toBe(true);
  });

  it('considers different props not equal', () => {
    expect(Money.of(10, 'EUR').equals(Money.of(11, 'EUR'))).toBe(false);
  });

  it('considers different classes not equal even with identical props', () => {
    expect(Money.of(10, 'EUR').equals(Weight.of(10, 'EUR'))).toBe(false);
  });

  it('freezes props at construction', () => {
    const money = Money.of(10, 'EUR') as unknown as { props: { amount: number } };

    expect(Object.isFrozen(money.props)).toBe(true);
  });
});
