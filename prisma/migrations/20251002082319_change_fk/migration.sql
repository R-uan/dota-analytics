/*
  Warnings:

  - You are about to drop the column `position` on the `MatchHero` table. All the data in the column will be lost.
  - Added the required column `positionFk` to the `MatchHero` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."MatchHero" DROP CONSTRAINT "MatchHero_position_fkey";

-- AlterTable
ALTER TABLE "MatchHero" DROP COLUMN "position",
ADD COLUMN     "positionFk" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MatchHero" ADD CONSTRAINT "MatchHero_positionFk_fkey" FOREIGN KEY ("positionFk") REFERENCES "Position"("position") ON DELETE RESTRICT ON UPDATE CASCADE;
