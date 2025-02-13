Scopely Battler!

## Getting Started

To get started, clone the repository and install the dependencies with:

```bash
yarn install
```

To create the Prisma client run:

```bash
npx prisma generate --schema ./prisma/schema.prisma
```

then build the project with:

```bash
yarn run build
```

and finally run the project with:

```bash
yarn run start
```

## Development

The project is using node.js with typescript support and prisma for the database connections. Currently there is no database connected to the project, but the prisma client is generated and ready to be used.

The backend is using express.js for the server. Currently there is no Frontend connected to the project.

The project consist of the following folders:

- `src`: Contains the source code of the project
  - `battleEngine`: Contains the code responsible for the battles logic
  - `battleService`: Contains the code that manages the battles, processing the queue
  - `interfaces`: Contains the interfaces of the project for dependency injection and more decoupling
  - `playerService`: Contains the code that manages the players stats and CRUD operations
  - `queueService`: Contains the code that manages the queue of battles
  - `routes`: Contains the API routes of the project uses express
    - `player`: Contains player routes
    - `battle`: Contains battle enqueueing routes
  - `validation`: Contains the validation logic for the routes
  - `tests`: Contains the test for the project, currently only has a test for the battle engine
  - `server.ts`: Contains the server setup
  - `types.ts`: Contains the types of the project
- `prisma`: Contains the prisma schema

## API

The API has the following routes:

- `GET /api/v1/player/get`: Returns single player based on "id" query parameter
- `POST /api/v1/player/create`: Creates a player based on the following object from the request body
  {
  name: string min(3) max(20),
  maxHp: number int min(1) max(1000),
  currentHp: number int() min(1) max(1000),
  baseAttack: number int() min(0) max(100),
  luck: number min(0) max(100),
  gold: number int min(0) max(100000000000)
  }
- `GET /api/v1/player/leaderboard`: Returns the list of all player rankings based on their wins and losses
