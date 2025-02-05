import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import Stripe from 'stripe';


@Module({
  providers: [
    {
      provide: 'STRIPE_CLIENT',

      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2025-01-27.acacia',
        });
      },
    },
    StripeService,
    StripeController,
  ],
  exports: [StripeService],
})

export class StripeModule {} 