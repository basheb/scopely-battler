import { Request, Response } from "express";

import { IBattleQueue } from "interfaces/IBattleQueue";
import express from "express";

/* This function creates a battle router with the given queue service singleton
 * This enqueues incoming battles
 */
const createBattleRouter = (queueService: IBattleQueue) => {
  const battleRouter = express.Router();

  battleRouter.get("/enqueue", async (req: Request, res: Response) => {
    try {
      const battle = req.body;
      const enqueued = await queueService.enqueue(battle);
      if (!enqueued) {
        res.status(400).json({ error: "Couldn't enqueue the battle" });
      }
      res.status(201).json({ message: "Battle enqueued" });
    } catch (error) {
      res.status(500).json({ error: "Couldn't enqueue the battle" });
    }
  });

  return battleRouter;
};

export default createBattleRouter;
