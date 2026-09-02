import { createModel } from '@/lib/mongodb';

export interface ICoupon {
  _id: any;
  code: string;
  discountPercentage: number;
  maxUses?: number;
  usedCount: number;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Coupon = createModel<ICoupon>('coupons');
