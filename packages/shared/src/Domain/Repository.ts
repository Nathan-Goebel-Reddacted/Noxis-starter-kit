export interface Repository<TAggregate, TId = string> {
  findById(id: TId): Promise<TAggregate | null>;
  save(aggregate: TAggregate): Promise<void>;
  delete(id: TId): Promise<void>;
}
