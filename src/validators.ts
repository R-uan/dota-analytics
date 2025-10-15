import {z} from "zod";

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

export const matchSchema = z.object({
  id: z.number().positive(),
  type: z.number().positive().min(1).max(3),
  duration: z.number().positive(),
  date: z.coerce.date(),
  winnerId: z.number().positive().max(2),
  heroes: z.array(heroMatchSchema).min(10),
});