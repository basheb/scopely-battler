/**
 * BattleEngine class handles the core battle mechanics
 * Following Single Responsibility Principle - this class only handles battle logic
 */
class BattleEngine {
  private static readonly MIN_GOLD_STEAL_PERCENTAGE = 0.1;
  private static readonly MAX_GOLD_STEAL_PERCENTAGE = 0.2;

  /**
   * Initiates and processes a battle between two characters
   * @param initiator The character who started the battle
   * @param defender The character being attacked
   * @returns BattleResult containing the outcome and battle details
   */
  public executeBattle(initiator: Player, defender: Player): BattleResult {
    // Create copies to avoid modifying original objects
    const attacker = this.cloneCharacter(initiator);
    const opponent = this.cloneCharacter(defender);
    const rounds: BattleRound[] = [];
    let turnNumber = 1;

    // Battle continues until one character's HP drops to 0 or below
    while (attacker.currentHp > 0 && opponent.currentHp > 0) {
      const isEvenTurn = turnNumber % 2 === 0;
      const currentAttacker = isEvenTurn ? opponent : attacker;
      const currentDefender = isEvenTurn ? attacker : opponent;

      const round = this.processBattleRound(
        currentAttacker,
        currentDefender,
        turnNumber
      );
      rounds.push(round);
      turnNumber++;
    }

    const winner = attacker.currentHp > 0 ? attacker : opponent;
    const loser = attacker.currentHp > 0 ? opponent : attacker;
    const stolenGold = this.calculateStolenGold(loser.gold);

    return {
      winner,
      loser,
      rounds,
      stolenGold,
    };
  }

  /**
   * Processes a single round of battle
   * @param attacker The character performing the attack
   * @param defender The character defending against the attack
   * @param turnNumber The current turn number
   * @returns BattleRound containing the details of the round
   */
  private processBattleRound(
    attacker: Player,
    defender: Player,
    turnNumber: number
  ): BattleRound {
    const missed = this.checkIfAttackMisses(defender.luck);
    let damage = 0;

    if (!missed) {
      const attackValue = this.calculateEffectiveAttack(attacker);
      damage = attackValue;
      defender.currentHp -= damage;
    }

    return {
      attacker,
      defender,
      damage,
      missed,
      turnNumber,
    };
  }

  /**
   * Calculates the effective attack value based on current HP percentage
   * @param character The attacking character
   * @returns The modified attack value
   */
  private calculateEffectiveAttack(character: Player): number {
    const healthPercentage = character.currentHp / character.maxHp;
    // If health is 50% or below, attack is capped at 50% of base
    if (healthPercentage <= 0.5) {
      return Math.floor(character.baseAttack * 0.5);
    }
    return Math.floor(character.baseAttack * healthPercentage);
  }

  /**
   * Determines if an attack misses based on defender's luck
   * @param defenderLuck The defender's luck value, 0 - 100
   * @returns boolean indicating if the attack missed
   */
  private checkIfAttackMisses(defenderLuck: number): boolean {
    // Generate random number between 0 and 100
    const randomValue = Math.random() * 100;
    return randomValue < defenderLuck;
  }

  /**
   * Calculates the amount of gold stolen from the loser
   * @param loserGold The total amount of gold the loser has
   * @returns The amount of gold stolen
   */
  private calculateStolenGold(loserGold: number): number {
    const stealPercentage =
      Math.random() *
        (BattleEngine.MAX_GOLD_STEAL_PERCENTAGE -
          BattleEngine.MIN_GOLD_STEAL_PERCENTAGE) +
      BattleEngine.MIN_GOLD_STEAL_PERCENTAGE;

    return Math.floor(loserGold * stealPercentage);
  }

  /**
   * Creates a deep copy of a character to avoid modifying the original
   * @param character The character to clone
   * @returns A new Player object with the same properties
   */
  private cloneCharacter(character: Player): Player {
    return {
      ...character,
    };
  }
}

export default BattleEngine;
