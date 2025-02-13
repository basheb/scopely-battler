// Types for our entities
interface Player {
  name: string;
  maxHp: number;
  currentHp: number;
  baseAttack: number;
  luck: number; // chance to dodge
  gold: number;
  id: string;
  wins: number;
  losses: number;
}

interface BattleResult {
  winner: Player;
  loser: Player;
  rounds: BattleRound[];
  stolenGold: number;
}

interface BattleRound {
  attacker: Player;
  defender: Player;
  damage: number;
  missed: boolean;
  turnNumber: number;
}

interface BattleRequest {
  initiatorId: string;
  defenderId: string;
}
