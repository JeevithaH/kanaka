import { createModel } from '@/lib/mongodb';

export interface ITestAttemptStatus {
  testId: string;
  testTitle: string;
  score: number;
  totalMarks: number;
  passed: boolean;
  attemptedAt: Date;
}

export interface ICertificateStatus {
  eligible: boolean;
  issued: boolean;
  certificateId?: string;
  issuedAt?: Date;
}

export interface IEnrollment {
  _id: any;
  userId: string;
  courseId: string;
  enrollmentDate: Date;
  status: 'active' | 'completed';
  paymentStatus: 'pending' | 'paid';
  amountPaid: number;
  paymentDate?: Date;
  couponUsed?: string;
  progressPercentage: number;
  completedLessons: string[];
  testStatus: ITestAttemptStatus[];
  certificateStatus: ICertificateStatus;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Enrollment = createModel<IEnrollment>('enrollments');
