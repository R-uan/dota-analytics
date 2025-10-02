import { Database } from "./database/database";
import express from 'express';

const app = express();

app.get("/matches", async (req, res) => {
  const query = req.query.type;
  const type = parseInt(query as string, 10) || null;
  const response = type === null ?
    await Database.getAllMatchesStats() :
    await Database.getMatchStatsByType(type);
  res.json(response);
});

app.get("/heroes", async (req, res) => {
  let response = await Database.getHeroesStats();
  res.json(response);
});

app.get("/heroes/pick", async (req, res) => {
  let response = await Database.getHeroesPickRate();
  res.json(response);
});

console.log(Database.getAllMatchesStats());
console.log(Database.getMatchStatsByType(2));

app.listen(3000, () => {
  console.log("Listening to 3000");
});
