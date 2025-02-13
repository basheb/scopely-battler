import BattleEngine from "../../battleEngine/battleEngine";

describe("BattleEngine", () => {
  let battleEngine: BattleEngine;

  // Mock characters for testing
  const mockWarrior = {
    name: "Warrior",
    maxHp: 1000,
    currentHp: 100,
    baseAttack: 200,
    luck: 0, // Setting to 0 for predictable tests, nobody can dodge
    gold: 1000,
  };

  const mockMage = {
    name: "Mage",
    maxHp: 800,
    currentHp: 80,
    baseAttack: 250,
    luck: 0,
    gold: 800,
  };

  beforeEach(() => {
    battleEngine = new BattleEngine();
    // Reset characters before each test
    mockWarrior.currentHp = mockWarrior.maxHp;
    mockMage.currentHp = mockMage.maxHp;
    // Mock random number generation for consistent tests, used to calculate stolen gold
    jest.spyOn(global.Math, "random").mockReturnValue(0.15);
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });

  describe("Battle Execution", () => {
    test("should execute a battle and return valid result", () => {
      const result = battleEngine.executeBattle(mockWarrior, mockMage);

      expect(result).toHaveProperty("winner");
      expect(result).toHaveProperty("loser");
      expect(result).toHaveProperty("rounds");
      expect(result).toHaveProperty("stolenGold");
      expect(Array.isArray(result.rounds)).toBe(true);
      expect(result.rounds.length).toBeGreaterThan(0);
    });

    test("should not modify original character objects", () => {
      const originalWarriorHp = mockWarrior.currentHp;
      const originalMageHp = mockMage.currentHp;

      battleEngine.executeBattle(mockWarrior, mockMage);

      expect(mockWarrior.currentHp).toBe(originalWarriorHp);
      expect(mockMage.currentHp).toBe(originalMageHp);
    });

    test("battle should end when one character reaches 0 HP", () => {
      const weakCharacter = {
        ...mockMage,
        maxHp: 10,
        currentHp: 10,
      };

      const result = battleEngine.executeBattle(mockWarrior, weakCharacter);

      expect(result.loser.currentHp).toBeLessThanOrEqual(0);
      expect(result.winner.currentHp).toBeGreaterThan(0);
    });
  });

  describe("Attack Calculation", () => {
    test("should calculate reduced attack at full health", () => {
      const result = battleEngine.executeBattle(mockWarrior, mockMage);
      const firstRound = result.rounds[0];

      // At 100% health, warrior should do full base attack
      expect(firstRound.damage).toBe(mockWarrior.baseAttack);
    });

    test("should reduce attack based on current HP percentage", () => {
      const injuredWarrior = {
        ...mockWarrior,
        currentHp: 600, // 60% health
      };

      const result = battleEngine.executeBattle(injuredWarrior, mockMage);
      const firstRound = result.rounds[0];

      // At 60% health, attack should be 60% of base
      expect(firstRound.damage).toBe(Math.floor(mockWarrior.baseAttack * 0.6));
    });

    test("should cap attack at 50% when HP is below 50%", () => {
      const criticalWarrior = {
        ...mockWarrior,
        currentHp: 400, // 40% health
      };

      const result = battleEngine.executeBattle(criticalWarrior, mockMage);
      const firstRound = result.rounds[0];

      // At 40% health, attack should be capped at 50% of base
      expect(firstRound.damage).toBe(Math.floor(mockWarrior.baseAttack * 0.5));
    });
  });

  describe("Luck and Miss Chance", () => {
    test("should miss when luck check succeeds", () => {
      const luckyMage = {
        ...mockMage,
        luck: 100, // 100% chance to dodge
      };

      jest.spyOn(global.Math, "random").mockReturnValue(0.5);
      const result = battleEngine.executeBattle(mockWarrior, luckyMage);
      const firstRound = result.rounds[0];

      expect(firstRound.missed).toBe(true);
      expect(firstRound.damage).toBe(0);
    });

    test("should hit when luck check fails", () => {
      const unluckyMage = {
        ...mockMage,
        luck: 0, // 0% chance to dodge
      };

      const result = battleEngine.executeBattle(mockWarrior, unluckyMage);
      const firstRound = result.rounds[0];

      expect(firstRound.missed).toBe(false);
      expect(firstRound.damage).toBeGreaterThan(0);
    });
  });

  describe("Gold Stealing", () => {
    test("should steal between 10% and 20% of loser's gold", () => {
      const result = battleEngine.executeBattle(mockWarrior, mockMage);
      const loserGold = result.loser.gold;

      expect(result.stolenGold).toBeGreaterThanOrEqual(loserGold * 0.1);
      expect(result.stolenGold).toBeLessThanOrEqual(loserGold * 0.2);
    });

    test("should round down stolen gold amount", () => {
      const poorMage = {
        ...mockMage,
        gold: 105,
      };

      const result = battleEngine.executeBattle(mockWarrior, poorMage);

      expect(Number.isInteger(result.stolenGold)).toBe(true);
    });
  });

  describe("Turn Order", () => {
    test("initiator should attack first", () => {
      const result = battleEngine.executeBattle(mockWarrior, mockMage);
      const firstRound = result.rounds[0];

      expect(firstRound.attacker.name).toBe(mockWarrior.name);
      expect(firstRound.defender.name).toBe(mockMage.name);
    });

    test("should alternate turns between characters", () => {
      const result = battleEngine.executeBattle(mockWarrior, mockMage);
      console.log("result", result);
      // Check first two rounds for turn alternation
      expect(result.rounds[0].attacker.name).toBe(mockWarrior.name);
      expect(result.rounds[1].attacker.name).toBe(mockMage.name);
    });
  });

  describe("Edge Cases", () => {
    test("should handle characters with 1 HP", () => {
      const fragileWarrior = {
        ...mockWarrior,
        maxHp: 1,
        currentHp: 1,
      };

      const result = battleEngine.executeBattle(fragileWarrior, mockMage);
      expect(result).toHaveProperty("winner");
      expect(result).toHaveProperty("loser");
    });

    test("should handle characters with 0 base attack", () => {
      const pacifistWarrior = {
        ...mockWarrior,
        baseAttack: 0,
      };

      const result = battleEngine.executeBattle(pacifistWarrior, mockMage);
      const firstRound = result.rounds[0];
      expect(firstRound.damage).toBe(0);
    });

    test("should handle characters with negative luck", () => {
      const unluckyWarrior = {
        ...mockWarrior,
        luck: -10,
      };

      const result = battleEngine.executeBattle(unluckyWarrior, mockMage);
      const firstRound = result.rounds[0];
      expect(firstRound.missed).toBe(false);
    });
  });
});
