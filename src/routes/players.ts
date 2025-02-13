import { Request, Response } from "express";

import PlayerStatsService from "playerService/playerService";
import express from "express";
import { newPlayerSchema } from "../validation/schemas.js";
import { z } from "zod";

// This function creates a player router with the given player service singleton
const createPlayerRouter = (playerService: PlayerStatsService) => {
  const playerRouter = express.Router();

  playerRouter.get("/get", async (req: Request, res: Response) => {
    try {
      const playerId = req.query.id as string;
      const players = await playerService.getPlayerById(playerId);
      res.status(200).json(players);
    } catch (error) {
      res.status(500).json({ error: "Couldn't find player by id" });
    }
  });

  playerRouter.post("/create", async (req: Request, res: Response) => {
    try {
      const validatedData = newPlayerSchema.parse(req.body);
      const player = await playerService.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(500).json({ error: "Couldn't create player" });
      }
    }
  });

  playerRouter.get("/leaderboard", async (req: Request, res: Response) => {
    try {
      const leaderboard = await playerService.getLeaderboard();
      res.status(200).json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Couldn't get leaderboard" });
    }
  });

  return playerRouter;
};

export default createPlayerRouter;
