import { connectToDatabase } from './mongodb';
import { Coupon } from '@/models/Coupon';

export async function seedCouponsIfEmpty() {
  await connectToDatabase();
  const count = await Coupon.countDocuments();
  if (count === 0) {
    const initialCoupons = [
      {
        code: 'SKY90',
        discountPercentage: 90,
        type: 'percentage',
        applicableTo: 'all',
        isActive: true,
      },
      {
        code: 'PROMO90',
        discountPercentage: 90,
        type: 'percentage',
        applicableTo: 'all',
        isActive: true,
      },
      {
        code: 'OFF90',
        discountPercentage: 90,
        type: 'percentage',
        applicableTo: 'all',
        isActive: true,
      },
      {
        code: 'SKYRELLA90',
        discountPercentage: 90,
        type: 'percentage',
        applicableTo: 'all',
        isActive: true,
      },
      {
        code: 'SPECIAL90',
        discountPercentage: 90,
        type: 'percentage',
        applicableTo: 'all',
        isActive: true,
      },
    ];

    await Coupon.insertMany(initialCoupons);
    console.log('Seeded default server-side coupons into MongoDB.');
  }
}
