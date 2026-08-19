import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  transactionId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  amount: number;
  currency: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string; // upi, card, netbanking, etc.
  serviceType: 'course' | 'internship-validation' | 'certificate';
  serviceId: string; // courseId or internshipId
  serviceName?: string;
  couponUsed?: string;
  discountAmount?: number;
  gatewayReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    transactionId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
    paymentMethod: { type: String, default: 'upi' },
    serviceType: {
      type: String,
      enum: ['course', 'internship-validation', 'certificate'],
      required: true,
    },
    serviceId: { type: String, required: true },
    serviceName: { type: String, default: '' },
    couponUsed: { type: String, default: '' },
    discountAmount: { type: Number, default: 0 },
    gatewayReference: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
