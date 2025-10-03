import { Database } from "./database/database";
import express from "express";

const app = express();

// -- /matches?gamemode=number
// ---- queries
// ------ gamemode : number
app.get("/matches", async (req, res) => {
  const gamemode = parseInt(req.query.gamemode as string, 10) || null;
  if (gamemode != null && ![1, 2, 3].includes(gamemode))
    return res.sendStatus(400);
  return res.json(await Database.getMatchStats(gamemode));
});

// -- /heroes?id=number&gamemode=number
// ---- queries
// ------ id : number
// ------ gamemode : number
app.get("/heroes", async (req, res) => {
  const id = parseInt(req.query.id as string, 10) || null;
  const gamemode = parseInt(req.query.gamemode as string, 10) || null;
  if (gamemode !== null && ![1, 2, 3].includes(gamemode))
    return res.sendStatus(400);
  if (id === null) return res.json(await Database.getHeroesStats(gamemode));
  const result = await Database.getHeroStats(id, gamemode);
  return result === null ? res.sendStatus(404) : res.json(result);
});

// -- /factions?gamemode=number
// ---- queries
// ------ gamemode : number
app.get("/factions", async (req, res) => {
  const gamemode = parseInt(req.query.gamemode as string, 10) || null;
  if (gamemode !== null && ![1, 2, 3].includes(gamemode))
    return res.sendStatus(400);
  let response = await Database.getFactionStats(gamemode);
  return res.json(response);
});

// -- /positions?gamemode=number
// ---- queries
// ------ gamemode : number
app.get("/positions", async (req, res) => {
  const gamemode = parseInt(req.query.gamemode as string, 10) || null;
  if (gamemode !== null && ![1, 2, 3].includes(gamemode))
    return res.sendStatus(400);
  let response = await Database.getPositionStats(gamemode);
  res.json(response);
});

app.listen(3000, () => {
  console.log("Listening to 3000");
});
