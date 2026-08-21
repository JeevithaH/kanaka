'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface CheckoutButtonProps {
  priceId: string;
  planName: string;
}

export function CheckoutButton({ priceId, planName }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        console.error('Checkout error:', error);
        alert(error);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error: stripeError } = await (stripe as any).redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        console.error('Stripe redirect error:', stripeError);
        alert(stripeError.message);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full bg-[#80664f] text-white px-4 py-3.5 text-sm hover:bg-[#5f4938] transition-colors disabled:opacity-50 inline-flex justify-center items-center gap-2"
    >
      {isLoading ? 'Processing...' : `Subscribe to ${planName}`}
      {!isLoading && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"/>
        </svg>
      )}
    </button>
  );
}
