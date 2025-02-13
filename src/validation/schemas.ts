import { z } from "zod";

export const newPlayerSchema = z.object({
  name: z.string().min(3).max(20),
  maxHp: z.number().int().min(1).max(1000),
  currentHp: z.number().int().min(1).max(1000),
  baseAttack: z.number().int().min(0).max(100),
  luck: z.number().min(0).max(100),
  gold: z.number().int().min(0).max(100000000000), // JS Number can take up to 2^53 - 1 safely
});

export const battleRequestSchema = z.object({
  initiatorId: z.string().uuid(),
  defenderId: z.string().uuid(),
});
