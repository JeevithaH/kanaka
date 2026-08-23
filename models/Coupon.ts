import { createModel } from '@/lib/mongodb';

export interface ICoupon {
  _id: any;
  code: string;
  discountPercentage: number;
  discountAmount?: number;
  type: 'percentage' | 'fixed';
  applicableTo: 'course' | 'internship-validation' | 'all';
  maxUses?: number;
  currentUses: number;
  validFrom?: Date;
  validUntil?: Date;
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Coupon = createModel<ICoupon>('coupons');
