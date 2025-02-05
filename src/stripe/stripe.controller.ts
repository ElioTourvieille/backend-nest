import { Controller, Post, Body, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() body: { priceId: string; userId: string },
  ) {
    const session = await this.stripeService.createCheckoutSession(
      body.priceId,
      body.userId,
    );
    return { url: session.url };
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const webhook = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia',
    });


    const event = webhook.webhooks.constructEvent(
      request.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    await this.stripeService.handleWebhookEvent(event);
    return { received: true };
  }
} 