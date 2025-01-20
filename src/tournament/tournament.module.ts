import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';

@Module({
  imports: [DatabaseModule],
  providers: [TournamentService],
  controllers: [TournamentController],
  exports: [TournamentService]
})
export class TournamentModule {}
