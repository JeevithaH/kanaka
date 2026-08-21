import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build';
const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(request: Request) {
  try {
    // In a real app, you would fetch the user's session from cookies/Supabase
    // const user = await getUser(request);
    // if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const { priceId } = await request.json();

    if (!priceId) {
      return new NextResponse('Price ID is required', { status: 400 });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Skyrellac Premium Subscription',
              description: 'Full access to all premium courses and certifications.',
            },
            unit_amount: 2900, // $29.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${protocol}://${host}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${protocol}://${host}/pricing`,
      // metadata: { userId: user.id } // useful for webhooks later
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
