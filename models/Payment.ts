import { createModel } from '@/lib/mongodb';

export interface IPayment {
  _id: any;
  paymentId: string;
  orderId: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Payment = createModel<IPayment>('payments');
