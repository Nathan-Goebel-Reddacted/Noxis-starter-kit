// Base class for Value Objects — equality is based on value, not identity.
// Props are frozen at construction to enforce immutability.
//
// NOTE: The default equals() uses JSON.stringify — this works for plain objects
// and primitives. Override it for VOs containing Dates, Sets, Maps, or nested VOs.
//
// Usage:
//   class CardColor extends ValueObject<{ value: string }> {
//     static create(value: string) { return new CardColor({ value }); }
//     get value() { return this.props.value; }
//   }

export abstract class ValueObject<TProps extends Record<string, unknown>> {
  protected readonly props: Readonly<TProps>;

  protected constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  equals(other: ValueObject<TProps>): boolean {
    if (other.constructor !== this.constructor) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
