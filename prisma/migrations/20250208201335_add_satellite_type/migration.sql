-- AlterEnum
ALTER TYPE "TournamentType" ADD VALUE 'SATELLITE';

-- AlterTable
ALTER TABLE "_GridToTournament" ADD CONSTRAINT "_GridToTournament_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_GridToTournament_AB_unique";
