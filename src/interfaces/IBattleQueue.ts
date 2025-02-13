export interface IBattleQueue {
  enqueue(battle: BattleRequest): Promise<boolean>;
  dequeue(): Promise<BattleRequest | undefined>;
  getLength(): Promise<number>;
}
