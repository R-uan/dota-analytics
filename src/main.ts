import { Database } from "./database/database";
import express from "express";

const app = express();

// -- /matches?gamemode=number
// ---- queries
// ------ gamemode : number
app.get("/matches", async (req, res) => {
  const query = req.query.gamemode;
  const gamemode = parseInt(query as string, 10) || null;
  if (gamemode != null && ![1, 2, 3].includes(gamemode))
    return res.sendStatus(400);
  return res.json(await Database.getMatchStats(gamemode));
});

// -- /heroes?id=number&gamemode=number
// ---- queries
// ------ id : number
// ------ gamemode : number
app.get("/heroes", async (req, res) => {
  const queryId = req.query.id;
  const id = parseInt(queryId as string, 10) || null;

  const queryGamemode = req.query.gamemode;
  const gamemode = parseInt(queryGamemode as string, 10) || null;
  if (gamemode != null && ![1, 2, 3].includes(gamemode))
    return res.sendStatus(400);

  if (id != null) {
    const result = await Database.getHeroStats(id, gamemode);
    return result == null ? res.sendStatus(404) : res.json(result);
  }

  return res.json(await Database.getHeroesStats(gamemode));
});

// -- /factions?gamemode=number
// ---- queries
// ------ gamemode : number
app.get("/factions", async (req, res) => {
  const queryGamemode = req.query.gamemode;
  const gamemode = parseInt(queryGamemode as string, 10) || null;
  if (gamemode != null && ![1, 2, 3].includes(gamemode))
    return res.sendStatus(400);
  let response = await Database.getFactionStats(gamemode);
  res.json(response);
});

app.listen(3000, () => {
  console.log("Listening to 3000");
});

