import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build';
const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return new NextResponse('Missing Stripe signature', { status: 400 });
    }

    let event: Stripe.Event;

    try {
      // In development without a real webhook secret, we skip verification
      // For production, this MUST be configured correctly.
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        // Fallback for local testing without proper CLI setup
        console.warn('WARNING: Skipping webhook signature verification because STRIPE_WEBHOOK_SECRET is not set.');
        event = JSON.parse(body);
      }
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // In a real app, update the user's role/subscription status in Supabase
        console.log(`Payment successful for session ID: ${session.id}`);
        // await updateUserRole(session.metadata.userId, 'premium');
        break;
      }
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription status updated: ${subscription.status}`);
        // Handle subscription changes (e.g., cancellation, renewal failure)
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
