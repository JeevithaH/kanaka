import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
import { seedCouponsIfEmpty } from '@/lib/seedCoupons';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    await seedCouponsIfEmpty();

    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json({ coupons });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { code, discountPercentage, discountAmount, type, applicableTo, maxUses } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    await connectToDatabase();

    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json({ error: 'A coupon with this code already exists.' }, { status: 409 });
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      discountPercentage: discountPercentage || 90,
      discountAmount: discountAmount || 0,
      type: type || 'percentage',
      applicableTo: applicableTo || 'all',
      maxUses: maxUses || undefined,
      isActive: true,
      createdBy: user!.name,
    });

    return NextResponse.json({ message: 'Coupon created successfully!', coupon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create coupon' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { errorResponse } = await requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { couponId, isActive } = await req.json();

    await connectToDatabase();
    const coupon = await Coupon.findByIdAndUpdate(couponId, { isActive }, { new: true });

    return NextResponse.json({ message: 'Coupon status updated', coupon });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update coupon status' }, { status: 500 });
  }
}
