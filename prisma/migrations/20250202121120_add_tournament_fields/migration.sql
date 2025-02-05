/*
  Warnings:

  - You are about to drop the column `format` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `tableSize` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TableSize" AS ENUM ('HEADS_UP', 'SHORT_HANDED', 'FULL_RING');

-- CreateEnum
CREATE TYPE "Variant" AS ENUM ('NO_LIMIT_HOLDEM', 'POT_LIMIT_OMAHA', 'OTHER');

-- CreateEnum
CREATE TYPE "TournamentType" AS ENUM ('STANDARD', 'KNOCKOUT', 'MYSTERY_KNOCKOUT', 'SPACE_KNOCKOUT', 'FREEZOUT');

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "format",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tableSize" "TableSize" NOT NULL,
ADD COLUMN     "type" "TournamentType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "variant" "Variant" NOT NULL;

-- CreateIndex
CREATE INDEX "Tournament_name_idx" ON "Tournament"("name");

-- CreateIndex
CREATE INDEX "Tournament_buyIn_idx" ON "Tournament"("buyIn");

-- CreateIndex
CREATE INDEX "Tournament_startTime_idx" ON "Tournament"("startTime");
