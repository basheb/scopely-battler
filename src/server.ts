import BattleEngine from "./battleEngine/battleEngine.js";
import BattleQueue from "./queueService/battleQueueService.js";
import BattleService from "./battleService/battleService.js";
import PlayerCrudService from "./playerService/playerCrudService.js";
import PlayerStatsService from "./playerService/playerService.js";
import createBattleRouter from "./routes/battle.js";
import createPlayerRouter from "./routes/players.js";
import express from "express";

const app = express();
const battleQueue = new BattleQueue();
const platerCrudService = new PlayerCrudService();
const playerService = new PlayerStatsService(platerCrudService);
const battleEngine = new BattleEngine();
const playerRouter = createPlayerRouter(playerService);
const battleRouter = createBattleRouter(battleQueue);

const battleService = new BattleService(
  battleQueue,
  playerService,
  battleEngine
);

app.use(express.json());
app.use("/api/v1/player", playerRouter);
app.use("/api/v1/battle", battleRouter);

battleService.processBattles();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
