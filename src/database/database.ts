import { PrismaClient } from "@prisma/client";
import {Calculations} from "./helpers";

const prisma = new PrismaClient();

export class Database {
  // -- /heroes?gamemode=:number
  // --- Get all heroes stats
  // ---- gamemode (0 - All Pick; 1 - Ranked; 2 - Turbo)
  public static async getHeroesStats(gamemode: number | null = null) {
    const totalMatches = await prisma.match.count();
    const matchWhere = gamemode !== null ? { type: gamemode } : {};

    const heroes = await prisma.hero.findMany({
      include: {
        matches: {
          where: {
            match: matchWhere,
          },
          include: {
            match: {
              select: {
                winnerId: true,
              },
            },
          },
        },
      },
    });

    return heroes.map((hero) => {
      const draftedAmount = hero.matches.length;

      return {
        heroId: hero.id,
        heroName: hero.name,
        pickRate: (draftedAmount * 100) / totalMatches,
        ...Calculations.calculateHeroesMatchAggregates(hero.matches),
      };
    });
  }

  // -- /heroes?id=number&&gamemode=:number
  // --- Get the stats of a single hero.
  // ---- gamemode (0 - All Pick; 1 - Ranked; 2 - Turbo)
  public static async getHeroStats(id: number, gamemode: number | null = null) {
    const totalMatches = await prisma.match.count();
    const matchWhere = gamemode !== null ? { type: gamemode } : {};

    // -- Get hero entry and matches associated with it.
    const hero = await prisma.hero.findUnique({
      where: { id: id },
      include: {
        matches: {
          where: {
            match: matchWhere,
          },
          include: {
            match: {
              select: {
                winnerId: true,
              },
            },
          },
        },
      },
    });

    if (hero === null) return null;

    const draftedAmount = hero.matches.length;

    return {
      heroId: hero.id,
      heroName: hero.name,
      pickRate: Math.round((draftedAmount * 100) / totalMatches),
      ...Calculations.calculateHeroesMatchAggregates(hero.matches),
    };
  }

  // -- /matches?gamemode=:number
  // --- Get all matches stats
  // ---- gamemode (0 - All Pick; 1 - Ranked; 2 - Turbo)
  public static async getMatchStats(gamemode: number | null = null) {
    const matchWhere = gamemode !== null ? { type: gamemode } : {};

    const totalMatches = await prisma.match.count();
    const totalMatchesFound = await prisma.match.count({
        where: matchWhere
    });
    const duration = (
      await prisma.match.aggregate({ _sum: { duration: true } })
    )._sum.duration;

    const stats = await prisma.matchHero.aggregate({
      where: { match: matchWhere },
      _sum: {
        kills: true,
        deaths: true,
        assists: true,
        gold: true,
        creepScore: true,
        denyScore: true,
      },
    });

    return {
      ...(gamemode != null && {
        gamemode:
          gamemode === 1
            ? "All Picks"
            : gamemode === 2
            ? "Ranked"
            : "Turbo",
      }),
      matchCount: totalMatchesFound ?? 0,
      distribution: Math.round((totalMatchesFound * 100) / totalMatches),
      ...Calculations.calculateMatchStats(stats._sum, totalMatchesFound, duration ?? 0),
    };
  }

  // -- /factions?gamemode=:number
  // ---- gamemode (0 - All Pick; 1 - Ranked; 2 - Turbo)
  public static async getFactionStats(gamemode: number | null = null) {
    const matchWhere = gamemode !== null ? { type: gamemode } : {};
    const matchAmount = await prisma.match.count({ where: matchWhere });
    const factionStats = await prisma.matchHero.groupBy({
      by: ["factionId"],
      _count: { matchId: true },
      _sum: { kills: true, gold: true, creepScore: true, denyScore: true },
      where: { match: matchWhere },
    });

    const wins = await prisma.match.groupBy({
      by: ["winnerId"],
      _count: { winnerId: true },
      where: matchWhere,
    });

    const radiantWins =
      wins.find((w) => w.winnerId === 0)?._count.winnerId ?? 0;
    const direWins = wins.find((w) => w.winnerId === 1)?._count.winnerId ?? 0;

    const radiantData = factionStats.find((w) => w.factionId === 0)?._sum;
    const direData = factionStats.find((w) => w.factionId === 1)?._sum;

    return {
      radiant: {
        wins: radiantWins,
        winRate: (radiantWins * 100) / matchAmount,
        ...Calculations.calculateFactionStats(radiantData, matchAmount),
      },
      dire: {
        wins: wins.find((w) => w.winnerId === 1)?._count.winnerId ?? 0,
        winRate: Math.round((direWins * 100) / matchAmount),
        ...Calculations.calculateFactionStats(direData, matchAmount),
      },
    };
  }
}
