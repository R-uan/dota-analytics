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
