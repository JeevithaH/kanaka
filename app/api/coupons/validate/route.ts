import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
import { seedCouponsIfEmpty } from '@/lib/seedCoupons';

const BUILTIN_COUPONS: Record<string, number> = {
  SKY90: 90,
  PROMO90: 90,
  OFF90: 90,
  SKYRELLA90: 90,
  SPECIAL90: 90,
  WELCOME90: 90,
  FLAT90: 90,
  SKRELL90: 90,
};

export async function POST(req: Request) {
  try {
    const { code, originalPrice } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Please enter a coupon code.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const price = originalPrice || 1999;

    await connectToDatabase();
    try {
      await seedCouponsIfEmpty();
    } catch {}

    // 1. Check built-in promo codes first (guarantees immediate validity)
    if (BUILTIN_COUPONS[cleanCode]) {
      const discountPct = BUILTIN_COUPONS[cleanCode];
      const discountAmount = Math.round(price * (discountPct / 100));
      const finalPrice = Math.max(0, price - discountAmount);

      return NextResponse.json({
        valid: true,
        code: cleanCode,
        discountPercentage: discountPct,
        discountAmount,
        finalPrice,
        message: `Coupon '${cleanCode}' applied! You save ₹${discountAmount.toLocaleString()}`,
      });
    }

    // 2. Check Database coupons
    let coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
    if (!coupon) {
      coupon = await Coupon.findOne({ code: cleanCode });
    }

    if (!coupon) {
      return NextResponse.json(
        {
          valid: false,
          error: `Invalid coupon code '${cleanCode}'. Try using 'SKY90' for 90% OFF!`,
        },
        { status: 400 }
      );
    }

    // Check expiration
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'This coupon code has expired.' },
        { status: 400 }
      );
    }

    // Calculate discount
    const discountPct = coupon.discountPercentage || 90;
    const discountAmount = Math.round(price * (discountPct / 100));
    const finalPrice = Math.max(0, price - discountAmount);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountPercentage: discountPct,
      discountAmount,
      finalPrice,
      message: `Coupon '${coupon.code}' applied! You save ₹${discountAmount.toLocaleString()}`,
    });
  } catch (error: any) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ valid: false, error: 'Failed to validate coupon code.' }, { status: 500 });
  }
}
