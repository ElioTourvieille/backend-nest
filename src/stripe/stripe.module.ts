import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { DatabaseModule } from '../database/database.module';
import { STRIPE_CLIENT } from './stripe.constants';
import Stripe from 'stripe';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: STRIPE_CLIENT,
      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2025-01-27.acacia',
        });
      },
    },
    StripeService,
  ],
  controllers: [StripeController],
  exports: [StripeService, STRIPE_CLIENT],
})
export class StripeModule {} 