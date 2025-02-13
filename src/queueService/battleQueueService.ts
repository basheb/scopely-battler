import { IBattleQueue } from "interfaces/IBattleQueue";

class BattleQueue implements IBattleQueue {
  private queue: BattleRequest[] = [];

  async enqueue(battle: BattleRequest): Promise<boolean> {
    try {
      this.queue.push(battle);
      return true;
    } catch (err) {
      console.error("Error enqueuing battle:", err);
      return false;
    }
  }

  async dequeue(): Promise<BattleRequest | undefined> {
    return this.queue.shift();
  }

  async getLength(): Promise<number> {
    return this.queue.length;
  }
}

export default BattleQueue;
