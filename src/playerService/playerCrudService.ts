import IPlayerCRUD from "interfaces/IPlayerCRUD";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This class communicates with the database to perform CRUD operations on the Player entity
class PlayerCrudService implements IPlayerCRUD {
  async create(
    player: Omit<Player, "id" | "wins" | "losses">
  ): Promise<Player> {
    try {
      return await prisma.player.create({
        data: {
          ...player,
          wins: 0,
          losses: 0,
        },
      });
    } catch (error) {
      console.error("Error creating player:", error);
      throw new Error("Could not create player.");
    }
  }
  async findById(id: string): Promise<Player | null> {
    try {
      return await prisma.player.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error finding player with id ${id}:`, error);
      throw new Error("Could not retrieve player.");
    }
  }
  async update(player: Player): Promise<void> {
    try {
      await prisma.player.update({
        where: { id: player.id },
        data: {
          name: player.name,
          wins: player.wins,
          losses: player.losses,
        },
      });
    } catch (error) {
      console.error(`Error updating player with id ${player.id}:`, error);
      throw new Error("Could not update player.");
    }
  }
  async findAll(): Promise<Player[]> {
    throw new Error("Method not implemented.");
  }
}

export default PlayerCrudService;
