import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';
import { TournamentModule } from './tournament/tournament.module';
import { GridModule } from './grid/grid.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    UsersModule, 
    DatabaseModule, 
    TournamentModule, 
    GridModule,
    WebhookModule,
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService, WebhookService],
})
export class AppModule {}
