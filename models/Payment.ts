import { createModel } from '@/lib/mongodb';

export interface IPayment {
  _id: any;
  transactionId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  amount: number;
  currency: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  serviceType: 'course' | 'internship-validation' | 'certificate';
  serviceId: string;
  serviceName?: string;
  couponUsed?: string;
  discountAmount?: number;
  gatewayReference?: string;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Payment = createModel<IPayment>('payments');
