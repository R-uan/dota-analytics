interface Matches {
    matchId: number;
    heroId: number;
    factionId: number;
    positionFk: number;
    kills: number;
    assists: number;
    deaths: number;
    gold: number;
    creepScore: number;
    denyScore: number;
}

// Para conseguir a frequencia em quer o heroi é escolhido em pos1-5:
// Checar todas as entradas de `matchHero` e fazer a contagem de aparições.
export function calculatePositionFrequency(matches: Matches[], matchesPresent: number) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, pos5 = 0;
    matches.forEach(match => {
        switch (match.positionFk) {
            case 1: pos1++; break;
            case 2: pos2++; break;
            case 3: pos3++; break;
            case 4: pos4++; break;
            case 5: pos5++; break;
        }
    });

    return {
        pos1: {
            name: "Hard Carry",
            picks: pos1,
            pickRate: Math.round((pos1 * 100) / matchesPresent)
        },
        pos2 : {
            name: "Midlane",
            picks: pos2,
            pickRate: Math.round((pos2 * 100) / matchesPresent) 
        },
        pos3: {
            name: "Offlane",
            picks: pos3,
            pickRate: Math.round((pos3 * 100) / matchesPresent)
        },
        pos4: {
            name: "Support",
            picks: pos4,
            pickRate: Math.round((pos4 * 100) / matchesPresent)    
        },
        pos5: {
            name: "Hard Support",
            picks: pos5,
            pickRate: Math.round((pos5 * 100) / matchesPresent)
        }
    }
}

// Sum all values across all matches to get total.
export function calculateHeroStats(matches: Matches[]) {
    const matchAmount = matches.length;
    const totalKills = matches.reduce((sum, m) => sum + m.kills, 0);
    const totalDeaths = matches.reduce((sum, m) => sum + m.deaths, 0);
    const totalAssists = matches.reduce((sum, m) => sum + m.assists, 0);

    const totalGold = matches.reduce((sum, m) => sum + m.gold, 0);
    const totalCS = matches.reduce((sum, m) => sum + m.creepScore, 0);
    const totalDS = matches.reduce((sum, m) => sum + m.denyScore, 0);

    const total = {
        totalKills,
        totalDeaths, 
        totalAssists,
        totalGold,
        totalCS, 
        totalDS
    };
    
    const avg  = {
        avgKda: (totalDeaths ? (totalKills + totalAssists) / totalDeaths : totalKills + totalAssists).toPrecision(2),
        avgKills: totalKills / matchAmount,
        avgDeaths: totalDeaths / matchAmount,
        avgAssists: totalAssists / matchAmount,
        avgGold: totalGold / matchAmount,
        avgCreepScore: totalCS / matchAmount,
        avgDenyScore: totalDS / matchAmount
    }

    return {
        totalPicks: matchAmount,
        total: total,
        avgs: avg
    }
}
