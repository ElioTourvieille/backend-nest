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
import { StripeModule } from './stripe/stripe.module';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from './stripe/stripe.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 60,
      max: 100, 
    }),
    UsersModule, 
    DatabaseModule, 
    TournamentModule, 
    GridModule,
    WebhookModule,
    StripeModule,
  ],
  controllers: [AppController, WebhookController, StripeController],
  providers: [AppService, WebhookService, StripeService],
})


export class AppModule {}
