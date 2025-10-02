import { Database } from "./database/database";
import express from 'express';

const app = express();

app.get("/matches", async (req, res) => {
  const query = req.query.type;
  const type = parseInt(query as string, 10) || null;
  if (type != null) {
    if (![1, 2, 3].includes(type)) return res.sendStatus(400);
    return res.json(await Database.getMatchStatsByType(type));
  }
  return res.json(await Database.getAllMatchesStats());
});

app.get("/heroes", async (req, res) => {
  const query = req.query.id;
  const id = parseInt(query as string, 10) || null;
  if (id != null) {
    const result = await Database.getHeroStats(id);
    return result == null ? res.sendStatus(404) : res.json(result);
  }
  return res.json(await Database.getHeroesStats());
});

app.get("/factions", async (req, res) => {
  let response = await Database.getFactionStats();
  res.json(response);
} )

app.listen(3000, () => {
  console.log("Listening to 3000");
});
