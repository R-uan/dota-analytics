export interface IMatch {
  id: number;
  type: number;
  duration: number;
  date: Date;
  winnerId: number;

  heroes: IMatchHero[];
}

export interface IMatchHero {
  heroId: number;
  factionFk: number;
  positionFk: number;

  kills: number;
  assists: number;
  deaths: number;
  gold: number;
  creepScore: number;
  denyScore: number;
}

export interface IMatches {
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

export interface IFactionData {
  kills: number | null;
  gold: number | null;
  creepScore: number | null;
  denyScore: number | null;
}

export interface IMatchStats {
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  gold: number | null;
  creepScore: number | null;
  denyScore: number | null;
}