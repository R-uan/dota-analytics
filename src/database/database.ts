import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class Database {
    //
    // - Aggregates overall status from all heroes.
    // --- K/D/A     (Amount for each)
    // --- K/D/A     (Average)
    // --- Gold
    // --- Pick      (Matches Amount)
    // --- Pick Rate (Percentage)
    // --- Creep Score
    // --- Deny Score
    public static async getHeroesStats() {
        const matchAmount = await prisma.match.count();
        const heroes = await prisma.hero.findMany({ include: { matches: true }});
        return heroes.map(hero => {
            const kills = hero.matches.reduce((sum, m) => sum + m.kills, 0);
            const deaths = hero.matches.reduce((sum, m) => sum + m.deaths, 0);
            const assists = hero.matches.reduce((sum, m) => sum + m.assists, 0);
            const gold = hero.matches.reduce((sum, m) => sum + m.gold, 0);
            const creepScore = hero.matches.reduce((sum, m) => sum + m.creepScore, 0);
            const denyScore = hero.matches.reduce((sum, m) => sum + m.denyScore, 0);
            
            const matchesPresent = hero.matches.length;
            const pickRate = (matchesPresent * 100) / matchAmount;
            
            return {
                heroId: hero.id,
                heroName: hero.name,
                kills,
                deaths, 
                assists,
                gold,
                picks: matchesPresent,
                pickRate,
                creepScore,
                denyScore,
                avgKda: deaths ? (kills + assists) / deaths : kills + assists
            }
        });
    }
    
    //
    // - Agregates overall stats from both factions from all matches
    // --- Wins        (Amount)
    // --- Win Rate    (Percentage)
    // --- Total Kills 
    // --- Total Gold 
    // --- Total Creep 
    // --- Total Deny 
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
    //
    // - Overall match stats
    // --- Kills
    // --- Gold
    // --- Creep Score
    // --- Deny Score
    // --- Duration (Total duration)
    // --- Duration (Average duration)
    // --- Types    (Amout of each type)
    public static async getMatchesStats() {
        const count = await prisma.match.count();
        const matches = await prisma.match.aggregate({_sum: { duration: true }});
        const types = await prisma.match.groupBy({by: ["type"], _count: { type: true }})
        const avgDuration = matches._sum?.duration ? matches._sum.duration / count : 0;
        const stats = await prisma.matchHero.aggregate({
            _sum: { kills: true, gold: true, creepScore: true, denyScore: true }
        });

        
        return {
            count: count ?? 0,
            kills: stats._sum?.kills ?? 0,
            gold: stats._sum?.gold ?? 0,
            creepScore: stats._sum?.creepScore ?? 0,
            denyScore: stats._sum?.denyScore ?? 0,
            duration: matches._sum?.duration ?? 0,
            avgDuration,
            types: {
                turbo: types.find(m => m.type === 1)?._count.type ?? 0,
                allPick: types.find(m => m.type === 2)?._count.type ?? 0,
                competitive: types.find(m => m.type === 3)?._count.type ?? 0,
            }
        }
    }

    public static async getHeroesPickRate() {
        const matchAmount = await prisma.match.count();

        const heroPicks = await prisma.matchHero.groupBy({
            by: ["heroId"],
            _count: { heroId: true }
        });
        
        const heroes = await prisma.hero.findMany({select: { id: true, name: true }});

        return heroes.map(hero => {
            const count = heroPicks.find(h => h.heroId === hero.id)?._count.heroId ?? 0;
            const pickRate = matchAmount > 0 ? (count * 100) / matchAmount : 0;
            
            return {
                heroId: hero.id,
                heroName: hero.name,
                pickRate
            }
        })
    }
}
