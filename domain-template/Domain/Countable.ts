/**
 * Implemented by any aggregate or entity that holds named counters (life, mana, buffs...).
 * This interface is card-game-specific and lives in the domain layer.
 * See: Instance, Player, GameZone, CardInstance, Board, Button
 */
export interface Countable {
  getCounter(name: string): number;
  setCounter(name: string, value: number): void;
  incrementCounter(name: string, amount?: number): void;
  decrementCounter(name: string, amount?: number): void;
}
