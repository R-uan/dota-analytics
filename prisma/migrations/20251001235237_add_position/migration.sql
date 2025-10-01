/*
  Warnings:

  - Added the required column `position` to the `MatchHero` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchHero" ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Position" (
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("position")
);

-- AddForeignKey
ALTER TABLE "MatchHero" ADD CONSTRAINT "MatchHero_position_fkey" FOREIGN KEY ("position") REFERENCES "Position"("position") ON DELETE RESTRICT ON UPDATE CASCADE;
