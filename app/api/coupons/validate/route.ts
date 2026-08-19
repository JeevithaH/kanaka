import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
import { seedCouponsIfEmpty } from '@/lib/seedCoupons';

export async function POST(req: Request) {
  try {
    const { code, originalPrice } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    await connectToDatabase();
    await seedCouponsIfEmpty();

    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired coupon code. Original price applies.' },
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

    // Check usage limits
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json(
        { valid: false, error: 'This coupon code usage limit has been reached.' },
        { status: 400 }
      );
    }

    const price = originalPrice || 1999;
    let discountAmount = 0;
    let finalPrice = price;

    if (coupon.type === 'percentage') {
      discountAmount = Math.round(price * (coupon.discountPercentage / 100));
      finalPrice = Math.max(0, price - discountAmount);
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.discountAmount || 0;
      finalPrice = Math.max(0, price - discountAmount);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      discountAmount,
      finalPrice,
      message: `Coupon '${coupon.code}' applied! You save ₹${discountAmount.toLocaleString()}`,
    });
  } catch (error: any) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon code.' }, { status: 500 });
  }
}
