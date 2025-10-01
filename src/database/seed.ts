import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Factions
  await prisma.faction.createMany({
    data: [
      { id: 0, name: "Radiant" },
      { id: 1, name: "Dire" },
    ],
    skipDuplicates: true
  });

  // Heroes
  await prisma.hero.createMany({
    data: [
        { id: 1, name: "Anti-Mage" },
        { id: 2, name: "Axe" },
        { id: 3, name: "Crystal Maiden" },
      // add more heroes as needed
    ],
    skipDuplicates: true
  });

  // Example match + heroes
  await prisma.match.create({
    data: {
      id: 1,
      duration: 2400,
      type: 2,
      date: new Date(),
      winner: { connect: { id: 0 } }, // Radiant wins
      heroes: {
        create: [
          {
            faction: { connect: { id: 0 } },
            hero: { connect: { id: 1 } },
            kills: 10,
            deaths: 2,
            assists: 5,
            gold: 15000,
            creepScore: 200,
            denyScore: 10
          },
          {
            faction: { connect: { id: 1 } },
            hero: { connect: { id: 2 } },
            kills: 7,
            deaths: 6,
            assists: 8,
            gold: 14000,
            creepScore: 180,
            denyScore: 5
          }
        ]
      }
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
