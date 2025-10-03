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

interface FactionData {
  kills: number | null;
  gold: number | null;
  creepScore: number | null;
  denyScore: number | null;
}

interface MatchStats {
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  gold: number | null;
  creepScore: number | null;
  denyScore: number | null;
}

export class Calculations {
  public static calculateHeroesMatchAggregates(
    matches: (Matches & { match: { winnerId: number } })[]
  ) {
    const totalMatches = matches.length;

    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0,
      pos5 = 0;

    let pos1Win = 0,
      pos2Win = 0,
      pos3Win = 0,
      pos4Win = 0,
      pos5Win = 0;

    let totalKills = 0,
      totalDeaths = 0,
      totalAssists = 0,
      totalGold = 0,
      totalCS = 0,
      totalDS = 0,
      wins = 0;

    for (const mh of matches) {
      // Total general stats
      totalKills += mh.kills;
      totalDeaths += mh.deaths;
      totalAssists += mh.assists;
      totalGold += mh.gold;
      totalCS += mh.creepScore;
      totalDS += mh.denyScore;

      let won = false;
      if (mh.factionId === mh.match.winnerId) {
        wins++;
        won = true;
      }

      switch (mh.positionFk) {
        case 1:
          pos1++;
          if (won) pos1Win++;
          break;
        case 2:
          pos2++;
          if (won) pos2Win++;
          break;
        case 3:
          pos3++;
          if (won) pos3Win++;
          break;
        case 4:
          pos4++;
          if (won) pos4Win++;
          break;
        case 5:
          pos5++;
          if (won) pos5Win++;
          break;
      }
    }

    const totals = {
      totalKills,
      totalDeaths,
      totalAssists,
      totalGold,
      totalCS,
      totalDS,
      totalWins: wins,
    };

    const averages =
      totalMatches > 0
        ? {
            avgKda: (totalDeaths
              ? (totalKills + totalAssists) / totalDeaths
              : totalKills + totalAssists
            ).toPrecision(2),
            avgKills: Math.round(totalKills / totalMatches),
            avgDeaths: Math.round(totalDeaths / totalMatches),
            avgAssists: Math.round(totalAssists / totalMatches),
            avgGold: Math.round(totalGold / totalMatches),
            avgCreepScore: Math.round(totalCS / totalMatches),
            avgDenyScore: Math.round(totalDS / totalMatches),
          }
        : {
            avgKda: "0",
            avgKills: 0,
            avgDeaths: 0,
            avgAssists: 0,
            avgGold: 0,
            avgCreepScore: 0,
            avgDenyScore: 0,
          };

    const positions = {
      pos1: {
        name: "Hard Carry",
        picks: pos1,
        pickRate: totalMatches ? Math.round((pos1 * 100) / totalMatches) : 0,
        wins: pos1Win,
        winRate: totalMatches ? Math.round((pos1Win * 100) / totalMatches) : 0,
      },
      pos2: {
        name: "Midlane",
        picks: pos2,
        pickRate: totalMatches ? Math.round((pos2 * 100) / totalMatches) : 0,
        wins: pos2Win,
        winRate: totalMatches ? Math.round((pos2Win * 100) / totalMatches) : 0,
      },
      pos3: {
        name: "Offlane",
        picks: pos3,
        pickRate: totalMatches ? Math.round((pos3 * 100) / totalMatches) : 0,
        wins: pos3Win,
        winRate: totalMatches ? Math.round((pos3Win * 100) / totalMatches) : 0,
      },
      pos4: {
        name: "Support",
        picks: pos4,
        pickRate: totalMatches ? Math.round((pos4 * 100) / totalMatches) : 0,
        wins: pos4Win,
        winRate: totalMatches ? Math.round((pos4Win * 100) / totalMatches) : 0,
      },
      pos5: {
        name: "Hard Support",
        picks: pos5,
        pickRate: totalMatches ? Math.round((pos5 * 100) / totalMatches) : 0,
        wins: pos5Win,
        winRate: totalMatches ? Math.round((pos5Win * 100) / totalMatches) : 0,
      },
    };

    return {
      totalPicks: totalMatches,
      winRate: (wins * 100) / totalMatches,

      total: totals,
      averages,
      positions,
    };
  }

  public static calculateFactionStats(
    data: FactionData | undefined,
    totalMatches: number
  ) {
    const total = {
      kills: data?.kills ?? 0,
      gold: data?.gold ?? 0,
      creepScore: data?.creepScore ?? 0,
      denyScore: data?.denyScore ?? 0,
    };

    const averages = {
      kills: Math.round((data?.kills ?? 0) / totalMatches),
      gold: Math.round((data?.gold ?? 0) / totalMatches),
      creepScore: Math.round((data?.creepScore ?? 0) / totalMatches),
      denyScore: Math.round((data?.denyScore ?? 0) / totalMatches),
    };

    return { total, averages };
  }

  public static calculateMatchStats(
    data: MatchStats,
    totalMatches: number,
    duration: number
  ) {
    const total = {
      totalKills: data.kills ?? 0,
      totalGold: data.gold ?? 0,
      totalAssists: data.assists ?? 0,
      totalCreepScore: data.creepScore ?? 0,
      totalDenyScore: data.denyScore ?? 0,
      totalDuration: duration ?? 0,
    };

    const averages = {
      avgKills: Math.round((data.kills ?? 0) / totalMatches),
      avgDeaths: Math.round((data.deaths ?? 0) / totalMatches),
      avgAssists: Math.round((data.assists ?? 0) / totalMatches),
      avgDuration: Math.round((duration ?? 0) / totalMatches),
    };

    return { total, averages };
  }
}
