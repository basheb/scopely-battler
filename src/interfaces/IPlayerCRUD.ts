interface IPlayerCRUD {
  create(player: Omit<Player, "id" | "wins" | "losses">): Promise<Player>;
  findById(id: string): Promise<Player | null>;
  update(player: Player): Promise<void>;
  findAll(): Promise<Player[]>;
}

export default IPlayerCRUD;
