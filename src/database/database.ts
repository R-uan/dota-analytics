import { PrismaClient } from "@prisma/client";
import { calculateHeroStats, calculatePositionFrequency } from "./helpers";

const prisma = new PrismaClient();

export class Database {
    // -- /heroes
    // --- Get all heroes stats
    public static async getHeroesStats() {
        const matchAmount = await prisma.match.count();
        const heroes = await prisma.hero.findMany({ include: { matches: true }});

        const heroesWins: Record<number, number> = {}; 
        const matches = await prisma.match.findMany({
            include: { heroes: true, },
        });
                
        matches.forEach(match => {
            match.heroes.forEach(hero => {
                if (hero.factionId === match.winnerId) {
                    heroesWins[hero.heroId] = (heroesWins[hero.heroId] || 0) +1 
                }
            })
        });
        
        return heroes.map(hero => {
            const win = heroesWins[hero.id] ?? 0;
            const draftedAmount = hero.matches.length;

            return {
                heroId: hero.id,
                heroName: hero.name,

                totalWins: win,
                winRate: (win * 100) / draftedAmount,

                ...calculateHeroStats(hero.matches),

                pickRate: (draftedAmount * 100) / matchAmount,
                positions: calculatePositionFrequency(hero.matches, draftedAmount)
            }
        });
    }

    // -- /heroes?id=number
    // --- Get the stats of a single hero.
    public static async getHeroStats(id: number) {
        const matchesAmount = await prisma.match.count();
        const hero = await prisma.hero.findUnique({where: { id: id }, include: { matches: true }});
        if (hero === null) return null;
        
        const matchesDrafted = await prisma.match.findMany({
            include: { heroes: true },
            where: { heroes: {some: { heroId: id }}}
        });
        const draftedAmount = matchesDrafted.length;
        
        let wins = 0;
        matchesDrafted.forEach(match => {
            if (match.heroes.some(h => h.heroId === id && h.factionId === match.winnerId)) {
                wins++;
            }
        });

        return {
                heroId: hero.id,
                heroName: hero.name,

                totalWins: wins,
                winRate: (wins * 100) / draftedAmount,

                ...calculateHeroStats(hero.matches),

                pickRate: (draftedAmount * 100) / matchesAmount,
                positions: calculatePositionFrequency(hero.matches, draftedAmount)
            }
    }
    
    // -- /factions
    public static async getFactionStats() {
        const matchAmount = await prisma.match.count();
        const factionStats = await prisma.matchHero.groupBy({
            by: ["factionId"],
            _sum: { kills:true, gold: true, creepScore: true, denyScore: true },
        });

        const wins = await prisma.match.groupBy({
            by: ["winnerId"],
            _count: { winnerId: true }
        });

        const radiantWins = wins.find(w=>w.winnerId === 0)?._count.winnerId ?? 0;
        const direWins = wins.find(w=>w.winnerId === 1)?._count.winnerId ?? 0;

        return {
            radiant: {
                wins: radiantWins,
                winRate: (radiantWins * 100) / matchAmount, 
                kills: factionStats.find(w => w.factionId === 0)?._sum.kills ?? 0,
                gold: factionStats.find(w => w.factionId === 0)?._sum.gold ?? 0,
                creepScore: factionStats.find(w => w.factionId === 0)?._sum.creepScore ?? 0,
                denyScore: factionStats.find(w => w.factionId === 0)?._sum.denyScore ?? 0,               
            },
            dire: {
                wins: wins.find(w => w.winnerId === 1)?._count.winnerId ?? 0,
                winRate: (direWins * 100) / matchAmount, 
                kills: factionStats.find(w => w.factionId === 1)?._sum.kills ?? 0,
                gold: factionStats.find(w => w.factionId === 1)?._sum.gold ?? 0,
                creepScore: factionStats.find(w => w.factionId === 1)?._sum.creepScore ?? 0,
                denyScore: factionStats.find(w => w.factionId === 1)?._sum.denyScore ?? 0,               
            }
        }
    }
    
    // -- /matches
    public static async getAllMatchesStats() {
        const totalMatches = await prisma.match.count();
        const matches = await prisma.match.aggregate({_sum: {duration: true}});
        const types = await prisma.match.groupBy({by: ["type"], _count: {type: true}})

        const stats = await prisma.matchHero.aggregate({
            _sum: { 
                kills: true, 
                deaths: true,
                assists: true, 
                gold: true, 
                creepScore: true, 
                denyScore: true, 
            }
        });
        
        const turboCount = types.find(m => m.type === 1)?._count.type ?? 0;
        const rankedCount = types.find(m => m.type === 2)?._count.type ?? 0;
        const allPickCount = types.find(m => m.type === 1)?._count.type ?? 0;
        
        return {
            matchCount: totalMatches ?? 0,
            
            totalDuration: matches._sum?.duration ?? 0,
            totalKills: stats._sum?.kills ?? 0,
            totalAssists: stats._sum?.assists ?? 0,
            totalGold: stats._sum?.gold ?? 0,
            totalCreepScore: stats._sum?.creepScore ?? 0,
            totalDenyScore: stats._sum?.denyScore ?? 0,

            avgKills: Math.round((stats._sum?.kills ?? 0) / totalMatches),
            avgDeaths: Math.round((stats._sum?.deaths ?? 0) / totalMatches),
            avgAssists: Math.round((stats._sum?.assists ?? 0) / totalMatches),
            avgDuration: Math.round((matches._sum?.duration ?? 0) / totalMatches),

            types: {
                allPick: {
                    matchCount: allPickCount,
                    distribution: Math.round(((allPickCount * 100) / totalMatches))
                },
                ranked: {
                    matchCount: rankedCount,
                    distribution: Math.round((rankedCount * 100) / totalMatches)
                },
                turbo: {
                    matchCount: turboCount,
                    distribution: Math.round((turboCount * 100) / totalMatches)
                }
            },
        }
    }

    // -- /matches?type=:matchType
    public static async getMatchStatsByType(matchType: number) {
        const matches = await prisma.match.aggregate({
            where: { type: matchType },
            _sum: { duration: true },
            _count: { _all: true }
        });

        const totalMatches = matches._count?._all ?? 0;

        const stats = await prisma.matchHero.aggregate({
            where: { match: { type: matchType } },
            _sum: { 
                kills: true, 
                deaths: true,
                assists: true, 
                gold: true, 
                creepScore: true, 
                denyScore: true, 
            }
        });
        
        return {
            type: matchType === 1 ? "All Picks" : matchType === 2 ? "Ranked" : "Turbo",
            kills: stats._sum?.kills ?? 0,
            matchCount: matches._count._all ?? 0,
            gold: stats._sum?.gold ?? 0,

            creepScore: stats._sum?.creepScore ?? 0,
            denyScore: stats._sum?.denyScore ?? 0,
            duration: matches._sum?.duration ?? 0,

            avgKills: Math.round((stats._sum?.kills ?? 0) / totalMatches),
            avgDeaths: Math.round((stats._sum?.deaths ?? 0) / totalMatches),
            avgAssists: Math.round((stats._sum?.assists ?? 0) / totalMatches),
            avgDuration: Math.round((matches._sum?.duration ?? 0) / totalMatches),
        }
    }
}