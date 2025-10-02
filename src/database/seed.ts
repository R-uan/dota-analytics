import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  // Factions
  await prisma.faction.createMany({
    data: [
      { id: 0, name: "Radiant" },
      { id: 1, name: "Dire" },
    ],
    skipDuplicates: true,
  });

  // Positions
  await prisma.position.createMany({
    data: [
      { name: "Hard Carry", position: 1 },
      { name: "Midlane", position: 2 },
      { name: "Offlane", position: 3 },
      { name: "Support", position: 4 },
      { name: "Hard Support", position: 5 },
    ],
    skipDuplicates: true,
  });

  // Heroes
  await generateHeroes();

  // Matches and MatchHeroes
  const matchData = await generateMatches(20);
  await prisma.$transaction([
    // Create all matches
    prisma.match.createMany({
      data: matchData.map((match) => ({
        id: match.id,
        type: match.type,
        duration: match.duration,
        date: match.date,
        winnerId: match.winnerId,
      })),
      skipDuplicates: true,
    }),
    // Create all MatchHero records
    prisma.matchHero.createMany({
      data: matchData.flatMap((match) =>
        match.heroes.map((hero) => ({
          matchId: match.id,
          heroId: hero.heroId,
          factionId: hero.factionId,
          positionFk: hero.positionFk,
          kills: hero.kills,
          assists: hero.assists,
          deaths: hero.deaths,
          gold: hero.gold,
          creepScore: hero.creepScore,
          denyScore: hero.denyScore,
        }))
      ),
      skipDuplicates: true,
    }),
  ]);
}

async function generateHeroes() {
  await prisma.hero.createMany({
    data: [
      { id: 1, name: "Anti-Mage" },
      { id: 2, name: "Axe" },
      { id: 3, name: "Bane" },
      { id: 4, name: "Bloodseeker" },
      { id: 5, name: "Crystal Maiden" },
      { id: 6, name: "Drow Ranger" },
      { id: 7, name: "Earthshaker" },
      { id: 8, name: "Juggernaut" },
      { id: 9, name: "Mirana" },
      { id: 10, name: "Morphling" },
      { id: 11, name: "Shadow Fiend" },
      { id: 12, name: "Phantom Lancer" },
      { id: 13, name: "Puck" },
      { id: 14, name: "Pudge" },
      { id: 15, name: "Razor" },
      { id: 16, name: "Sand King" },
      { id: 17, name: "Storm Spirit" },
      { id: 18, name: "Sven" },
      { id: 19, name: "Tiny" },
      { id: 20, name: "Vengeful Spirit" },
      { id: 21, name: "Windranger" },
      { id: 22, name: "Zeus" },
      { id: 23, name: "Kunkka" },
      { id: 24, name: "Ringmaster" },
      { id: 25, name: "Lina" },
      { id: 26, name: "Lion" },
      { id: 27, name: "Shadow Shaman" },
      { id: 28, name: "Slardar" },
      { id: 29, name: "Tidehunter" },
      { id: 30, name: "Witch Doctor" },
      { id: 31, name: "Lich" },
      { id: 32, name: "Riki" },
      { id: 33, name: "Enigma" },
      { id: 34, name: "Tinker" },
      { id: 35, name: "Sniper" },
      { id: 36, name: "Necrophos" },
      { id: 37, name: "Warlock" },
      { id: 38, name: "Beastmaster" },
      { id: 39, name: "Queen of Pain" },
      { id: 40, name: "Venomancer" },
      { id: 41, name: "Faceless Void" },
      { id: 42, name: "Wraith King" },
      { id: 43, name: "Death Prophet" },
      { id: 44, name: "Phantom Assassin" },
      { id: 45, name: "Pugna" },
      { id: 46, name: "Templar Assassin" },
      { id: 47, name: "Viper" },
      { id: 48, name: "Luna" },
      { id: 49, name: "Dragon Knight" },
      { id: 50, name: "Dazzle" },
      { id: 51, name: "Clockwerk" },
      { id: 52, name: "Leshrac" },
      { id: 53, name: "Nature's Prophet" },
      { id: 54, name: "Lifestealer" },
      { id: 55, name: "Dark Seer" },
      { id: 56, name: "Clinkz" },
      { id: 57, name: "Omniknight" },
      { id: 58, name: "Enchantress" },
      { id: 59, name: "Huskar" },
      { id: 60, name: "Night Stalker" },
      { id: 61, name: "Broodmother" },
      { id: 62, name: "Bounty Hunter" },
      { id: 63, name: "Weaver" },
      { id: 64, name: "Jakiro" },
      { id: 65, name: "Batrider" },
      { id: 66, name: "Chen" },
      { id: 67, name: "Spectre" },
      { id: 68, name: "Ancient Apparition" },
      { id: 69, name: "Doom" },
      { id: 70, name: "Ursa" },
      { id: 71, name: "Spirit Breaker" },
      { id: 72, name: "Gyrocopter" },
      { id: 73, name: "Alchemist" },
      { id: 74, name: "Invoker" },
      { id: 75, name: "Silencer" },
      { id: 76, name: "Outworld Destroyer" },
      { id: 77, name: "Lycan" },
      { id: 78, name: "Brewmaster" },
      { id: 79, name: "Shadow Demon" },
      { id: 80, name: "Lone Druid" },
      { id: 81, name: "Chaos Knight" },
      { id: 82, name: "Meepo" },
      { id: 83, name: "Treant Protector" },
      { id: 84, name: "Ogre Magi" },
      { id: 85, name: "Undying" },
      { id: 86, name: "Rubick" },
      { id: 87, name: "Disruptor" },
      { id: 88, name: "Nyx Assassin" },
      { id: 89, name: "Naga Siren" },
      { id: 90, name: "Keeper of the Light" },
      { id: 91, name: "Io" },
      { id: 92, name: "Visage" },
      { id: 93, name: "Slark" },
      { id: 94, name: "Medusa" },
      { id: 95, name: "Troll Warlord" },
      { id: 96, name: "Centaur Warrunner" },
      { id: 97, name: "Magnus" },
      { id: 98, name: "Timbersaw" },
      { id: 99, name: "Bristleback" },
      { id: 100, name: "Tusk" },
      { id: 101, name: "Skywrath Mage" },
      { id: 102, name: "Abaddon" },
      { id: 103, name: "Elder Titan" },
      { id: 104, name: "Legion Commander" },
      { id: 105, name: "Techies" },
      { id: 106, name: "Ember Spirit" },
      { id: 107, name: "Earth Spirit" },
      { id: 108, name: "Underlord" },
      { id: 109, name: "Terrorblade" },
      { id: 110, name: "Phoenix" },
      { id: 111, name: "Oracle" },
      { id: 112, name: "Winter Wyvern" },
      { id: 113, name: "Arc Warden" },
      { id: 114, name: "Monkey King" },
      { id: 115, name: "Muerta" },
      { id: 116, name: "Dark Willow" },
      { id: 117, name: "Pangolier" },
      { id: 118, name: "Grimstroke" },
      { id: 119, name: "Hoodwink" },
      { id: 120, name: "Void Spirit" },
      { id: 121, name: "Snapfire" },
      { id: 122, name: "Mars" },
      { id: 123, name: "Dawnbreaker" },
      { id: 124, name: "Marci" },
      { id: 125, name: "Primal Beast" },
    ],
    skipDuplicates: true,
  });
}

async function generateMatches(amount: number) {
  const heroPool = Array.from({ length: 125 }, (_, i) => i + 1);
  const matches = [];

  for (let i = 0; i < amount; i++) {
    const matchId = i + 1; // Start match IDs at 1
    const availableHeroes = [...heroPool]; // Copy to avoid reusing heroes in a match
    const teamRadiant = generateTeam(0, availableHeroes);
    // Remove Radiant heroes from available pool to prevent duplicates
    availableHeroes.splice(
      0,
      availableHeroes.length,
      ...availableHeroes.filter((id) => !teamRadiant.some((h) => h.heroId === id))
    );
    const teamDire = generateTeam(1, availableHeroes);

    const radiantKills = teamRadiant.reduce((sum, h) => sum + h.kills, 0);
    const direKills = teamDire.reduce((sum, h) => sum + h.kills, 0);
    const winnerId = radiantKills >= direKills ? 0 : 1;

    matches.push({
      id: matchId,
      type: getRandomInt(1, 3), // 1: Turbo, 2: All Pick, 3: Competitive
      date: new Date(getRandomInt(1609459200, 1759396688) * 1000), // Jan 1 2021 to now
      duration: getRandomInt(1200, 3600), // 20-60 min
      winnerId: winnerId,
      heroes: [...teamRadiant, ...teamDire],
    });
  }

  return matches;
}

function generateTeam(factionId: number, heroPool: number[]) {
  const heroes = shuffle(heroPool).slice(0, 5);
  const positions = [1, 2, 3, 4, 5];

  return heroes.map((heroId, index) => ({
    heroId,
    factionId,
    positionFk: positions[index],
    kills: getRandomInt(1, 20),
    deaths: getRandomInt(0, 10),
    assists: getRandomInt(5, 30),
    gold: getRandomInt(11000, 35000),
    creepScore: getRandomInt(50, 450),
    denyScore: getRandomInt(0, 50),
  }));
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
