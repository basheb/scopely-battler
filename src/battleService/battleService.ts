import BattleEngine from "battleEngine/battleEngine";
import { IBattleQueue } from "interfaces/IBattleQueue";
import PlayerStatsService from "playerService/playerService";

/*
 * Manages the queue of battles and the battles themselves
 */
class BattleService {
  constructor(
    private battleQueue: IBattleQueue,
    private playerStatsService: PlayerStatsService,
    private battleEngine: BattleEngine
  ) {}

  async dequeueBattle(): Promise<BattleRequest | undefined> {
    return this.battleQueue.dequeue();
  }

  async commenceNextBattle(): Promise<BattleResult | undefined> {
    const nextBattleRequest = await this.dequeueBattle();
    if (!nextBattleRequest) return;

    const [initiator, defender] = await Promise.all([
      this.playerStatsService.getPlayerById(nextBattleRequest.initiatorId),
      this.playerStatsService.getPlayerById(nextBattleRequest.defenderId),
    ]);

    if (!initiator || !defender) {
      throw new Error("Player not found");
    }

    const result = this.battleEngine.executeBattle(initiator, defender);

    await Promise.all([
      this.playerStatsService.updatePlayerStats(
        nextBattleRequest.initiatorId,
        result.winner.id === initiator.id,
        result.winner.id === initiator.id
          ? result.stolenGold
          : -result.stolenGold
      ),
      this.playerStatsService.updatePlayerStats(
        nextBattleRequest.defenderId,
        result.winner.id === defender.id,
        result.winner.id === defender.id
          ? result.stolenGold
          : -result.stolenGold
      ),
    ]);

    return result;
  }

  getQueueLength(): Promise<number> {
    return this.battleQueue.getLength();
  }

  processBattles(): void {
    setInterval(async () => {
      const queueLength = await this.getQueueLength();
      if (queueLength === 0) {
        console.log("Queue is empty");
      } else {
        console.log(`Queue length: ${queueLength}, commencing next battle`);
        const result = await this.commenceNextBattle();
        console.log("Battle Report!\n\n", result);
      }
    }, 1000);
  }
}

export default BattleService;
