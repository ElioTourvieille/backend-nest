import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { STRIPE_CLIENT } from 'src/stripe/stripe.constants';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly databaseService: DatabaseService,
  ) {}

  async createCheckoutSession(priceId: string, userId: string) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      client_reference_id: userId,
    });

    return session;
  }

  // Handle webhook events from Stripe
  async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleSuccessfulSubscription(session);
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleCancelledSubscription(subscription);
        break;
    }
  }

  private async handleSuccessfulSubscription(session: Stripe.Checkout.Session) {
    const userId = session.client_reference_id;
    if (!userId) return;

    // Update user role according to price/product
    const subscription = await this.stripe.subscriptions.retrieve(session.subscription as string);
    const priceId = subscription.items.data[0].price.id;
    
    let role: 'free' | 'premium' | 'elite';
    switch (priceId) {
      case process.env.STRIPE_PREMIUM_PRICE_ID:
        role = 'premium';
        break;
      case process.env.STRIPE_ELITE_PRICE_ID:
        role = 'elite';
        break;
      default:
        role = 'free';
    }

    await this.databaseService.user.update({
      where: { kindeId: userId },
      data: { role },
    });
  }

  private async handleCancelledSubscription(subscription: Stripe.Subscription) {
    const userId = subscription.customer as string;
    
    await this.databaseService.user.update({
      where: { kindeId: userId },
      data: { role: 'free' },
    });
  }
} 