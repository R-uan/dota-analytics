import type { IFactionData, IMatches, IMatchStats } from "./interfaces";

export class Calculations {
  public static calculateHeroesMatchAggregates(
    matches: (IMatches & { match: { winnerId: number } })[],
  ) {
    const totalMatches = matches.length;

    let totalKills = 0,
      totalDeaths = 0,
      totalAssists = 0,
      totalGold = 0,
      totalCS = 0,
      totalDS = 0,
      wins = 0;


    let pos1 = { played: 0, wins: 0 };
    let pos2 = { played: 0, wins: 0 };
    let pos3 = { played: 0, wins: 0 };
    let pos4 = { played: 0, wins: 0 };
    let pos5 = { played: 0, wins: 0 };
    
    let pos1Stats = { kills: 0, deaths: 0, assists: 0, gold: 0, CS: 0, DS: 0 };
    let pos2Stats = { kills: 0, deaths: 0, assists: 0, gold: 0, CS: 0, DS: 0 };
    let pos3Stats = { kills: 0, deaths: 0, assists: 0, gold: 0, CS: 0, DS: 0 };
    let pos4Stats = { kills: 0, deaths: 0, assists: 0, gold: 0, CS: 0, DS: 0 };
    let pos5Stats = { kills: 0, deaths: 0, assists: 0, gold: 0, CS: 0, DS: 0 };

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
          pos1.played++;
          pos1Stats.kills += mh.kills;
          pos1Stats.deaths += mh.deaths;
          pos1Stats.assists += mh.assists;
          pos1Stats.gold += mh.gold;
          pos1Stats.CS += mh.creepScore;
          pos1Stats.DS += mh.denyScore;
          if (won) pos1.wins++;
          break;
        case 2:
          pos2.played++;
          pos2Stats.kills += mh.kills;
          pos2Stats.deaths += mh.deaths;
          pos2Stats.assists += mh.assists;
          pos2Stats.gold += mh.gold;
          pos2Stats.CS += mh.creepScore;
          pos2Stats.DS += mh.denyScore;
          if (won) pos2.wins++;
          break;
        case 3:
          pos3.played++;
          pos3Stats.kills += mh.kills;
          pos3Stats.deaths += mh.deaths;
          pos3Stats.assists += mh.assists;
          pos3Stats.gold += mh.gold;
          pos3Stats.CS += mh.creepScore;
          pos3Stats.DS += mh.denyScore;
          if (won) pos3.wins++;
          break;
        case 4:
          pos4.played++;
          pos4Stats.kills += mh.kills;
          pos4Stats.deaths += mh.deaths;
          pos4Stats.assists += mh.assists;
          pos4Stats.gold += mh.gold;
          pos4Stats.CS += mh.creepScore;
          pos4Stats.DS += mh.denyScore;
          if (won) pos4.wins++;
          break;
        case 5:
          pos5.played++;
          pos5Stats.kills += mh.kills;
          pos5Stats.deaths += mh.deaths;
          pos5Stats.assists += mh.assists;
          pos5Stats.gold += mh.gold;
          pos5Stats.CS += mh.creepScore;
          pos5Stats.DS += mh.denyScore;
          if (won) pos5.wins++;
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
        picks: pos1.played,
        pickRate: totalMatches ? Math.round((pos1.played * 100) / totalMatches) : 0,
        wins: pos1.wins,
        winRate: totalMatches ? Math.round((pos1.wins * 100) / totalMatches) : 0,
        stats: pos1Stats,
      },
      pos2: {
        name: "Midlane",
        picks: pos2.played,
        pickRate: totalMatches ? Math.round((pos2.played * 100) / totalMatches) : 0,
        wins: pos2.wins,
        winRate: totalMatches ? Math.round((pos2.wins * 100) / totalMatches) : 0,
        stats: pos2Stats,
      },
      pos3: {
        name: "Offlane",
        picks: pos3.played,
        pickRate: totalMatches ? Math.round((pos3.played * 100) / totalMatches) : 0,
        wins: pos3.wins,
        winRate: totalMatches ? Math.round((pos3.wins * 100) / totalMatches) : 0,
                stats: pos3Stats,

      },
      pos4: {
        name: "Support",
        picks: pos4.played,
        pickRate: totalMatches ? Math.round((pos4.played * 100) / totalMatches) : 0,
        wins: pos4.wins,
        winRate: totalMatches ? Math.round((pos4.wins * 100) / totalMatches) : 0,
                stats: pos4Stats,

      },
      pos5: {
        name: "Hard Support",
        picks: pos5.played,
        pickRate: totalMatches ? Math.round((pos5.played * 100) / totalMatches) : 0,
        wins: pos5.wins,
        winRate: totalMatches ? Math.round((pos5.wins * 100) / totalMatches) : 0,
                stats: pos5Stats,

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
    data: IFactionData | undefined,
    totalMatches: number,
  ) {
    const total = {
      totalKills: data?.kills ?? 0,
      totalGold: data?.gold ?? 0,
      totalCreepScore: data?.creepScore ?? 0,
      totalDenyScore: data?.denyScore ?? 0,
    };

    const averages = {
      avgKills: Math.round((data?.kills ?? 0) / totalMatches),
      avgGold: Math.round((data?.gold ?? 0) / totalMatches),
      avgCreepScore: Math.round((data?.creepScore ?? 0) / totalMatches),
      avgDenyScore: Math.round((data?.denyScore ?? 0) / totalMatches),
    };

    return { total, averages };
  }

  public static calculateMatchStats(
    data: IMatchStats,
    totalMatches: number,
    duration: number,
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

  public static calculateTotalAverage(
    data: IMatchStats | undefined,
    total: number,
  ) {
    return {
      total: {
        totalKills: data?.kills ?? 0,
        totalDeaths: data?.deaths ?? 0,
        totalAssists: data?.assists ?? 0,
        totalGold: data?.gold ?? 0,
        totalCreepScore: data?.creepScore ?? 0,
        totalDenyScore: data?.denyScore ?? 0,
      },
      average: {
        avgKda: (data?.deaths
          ? ((data?.kills ?? 0) + (data?.assists ?? 0)) / data?.deaths
          : (data?.kills ?? 0) + (data?.assists ?? 0)
        ).toPrecision(2),
        avgKills: Math.round((data?.kills ?? 0) / total),
        avgDeaths: Math.round((data?.deaths ?? 0) / total),
        avgAssists: Math.round((data?.assists ?? 0) / total),
        avgGold: Math.round((data?.gold ?? 0) / total),
        avgCreepScore: Math.round((data?.creepScore ?? 0) / total),
        avgDenyScore: Math.round((data?.denyScore ?? 0) / total),
      },
    };
  }
}
