import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';
import { Coupon } from '@/models/Coupon';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay API credentials are not configured on the server.' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { courseId, couponCode } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required.' }, { status: 400 });
    }

    await connectToDatabase();

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    const originalPrice = course.originalPrice || 1999;
    let finalAmount = originalPrice;
    let discountAmount = 0;

    const cleanCoupon = (couponCode || '').trim().toUpperCase();
    if (cleanCoupon) {
      const dbCoupon = await Coupon.findOne({ code: cleanCoupon, isActive: true });
      if (dbCoupon) {
        if (dbCoupon.type === 'percentage') {
          discountAmount = Math.round(originalPrice * (dbCoupon.discountPercentage / 100));
          finalAmount = Math.max(0, originalPrice - discountAmount);
        } else if (dbCoupon.type === 'fixed') {
          discountAmount = dbCoupon.discountAmount || 0;
          finalAmount = Math.max(0, originalPrice - discountAmount);
        }
      }
    }

    // Razorpay requires amount in paise (1 INR = 100 paise)
    const amountInPaise = finalAmount * 100;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Math.random().toString(36).substring(2, 15)}`,
      notes: {
        userId: user!.id,
        courseId: courseId,
        couponCode: couponCode || '',
        discountAmount: discountAmount.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment order.' },
      { status: 500 }
    );
  }
}
