import { Database } from "./database/database";
import express, { type Request } from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

// -- /matches?gamemode=number
// ---- queries
// ------ gamemode : number
app.get("/matches", async (req, res) => {
  const gamemode = parseInt(req.query.gamemode as string, 10) || null;
  if (gamemode != null && ![1, 2, 3].includes(gamemode))
    return res.sendStatus(400);
  return res.json(await Database.getMatchStats(gamemode));
});

app.get("/matches/:id", async (req, res) => {
  const matchId = parseInt(req.params.id, 10) || null;
  if (matchId === null)
    return res.status(400).json({ error: "invalid match id" });

  const match = await Database.getMatchById(matchId);
  return match === null ? res.status(404) : res.json(match);
});

const heroMatchSchema = z.object({
  heroId: z.number().positive(),
  factionFk: z.number().min(0).max(1),
  positionFk: z.number().positive().max(5),
  kills: z.number().positive(),
  assists: z.number().positive(),
  deaths: z.number().positive(),
  gold: z.number().positive(),
  creepScore: z.number().positive(),
  denyScore: z.number().positive(),
});

const matchSchema = z.object({
  id: z.number().positive(),
  type: z.number().positive().min(1).max(3),
  duration: z.number().positive(),
  date: z.coerce.date(),
  winnerId: z.number().positive().max(2),
  heroes: z.array(heroMatchSchema).min(10),
});

type MatchBody = z.infer<typeof matchSchema>;

app.post("/matches", async (req, res) => {
  console.log(req.body);
  const parse = matchSchema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ errors: parse.error.flatten() });
  const result = await Database.storeMatch(parse.data);
  return res.json(result);
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
