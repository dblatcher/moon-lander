import { sql } from "@vercel/postgres";
import { Score, ScoreData } from "./types";

export const scoreToInsertStatement = (score: ScoreData) => sql<Score>`
INSERT INTO ArcadeWorldScores (name, score, "gameId")
VALUES (${score.name}, ${Math.floor(score.score)}, ${score.gameId});
`

export const selectAllScoresStatement = () => sql<Score>`SELECT * FROM ArcadeWorldScores;`

export const selectScoresForGameIdStatement = (gameId: string) =>
  sql<Score>`SELECT * FROM ArcadeWorldScores WHERE "gameId" = ${gameId};`

export const createTable = () => sql<Score>`
CREATE TABLE IF NOT EXISTS ArcadeWorldScores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  "gameId" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`