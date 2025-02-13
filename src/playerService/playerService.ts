import IPlayerCRUD from "interfaces/IPlayerCRUD";

/**
 * Player Storage class handles player data CRUD operations with the database
 * Following Single Responsibility Principle - this class only handles player data CRUD logic
 */
class PlayerStatsService {
  constructor(private playerCrudService: IPlayerCRUD) {}

  async createPlayer(
    playerData: Omit<Player, "id" | "wins" | "losses">
  ): Promise<Player> {
    const newPlayer = {
      ...playerData,
      wins: 0,
      losses: 0,
      id: Date.now().toString(),
    };
    return this.playerCrudService.create(newPlayer);
  }

  async getLeaderboard(): Promise<Player[]> {
    const players = await this.playerCrudService.findAll();

    return players
      .sort((a, b) => {
        const scoreA = a.wins - a.losses;
        const scoreB = b.wins - b.losses;
        return scoreB - scoreA; // Sort in descending order
      })
      .map((player, index) => ({
        ...player,
        rank: index + 1, // Assign rank based on position
      }));
  }

  async getPlayerById(playerId: string): Promise<Player | null> {
    return this.playerCrudService.findById(playerId);
  }

  async updatePlayerStats(
    playerId: string,
    isWinner: boolean,
    goldChange: number
  ): Promise<void> {
    const player = await this.playerCrudService.findById(playerId);
    if (!player) throw new Error("Player not found");

    const updatedPlayer = {
      ...player,
      gold: player.gold + goldChange,
      wins: isWinner ? player.wins + 1 : player.wins,
      losses: isWinner ? player.losses : player.losses + 1,
    };

    await this.playerCrudService.update(updatedPlayer);
  }
}
export default PlayerStatsService;
