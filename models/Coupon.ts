import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  code: string; // e.g. SKY90
  discountPercentage: number; // e.g. 90
  discountAmount?: number; // e.g. 1800
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
}

const CouponSchema: Schema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountPercentage: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    applicableTo: { type: String, enum: ['course', 'internship-validation', 'all'], default: 'all' },
    maxUses: { type: Number },
    currentUses: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
