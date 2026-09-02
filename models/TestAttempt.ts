import { createModel } from '@/lib/mongodb';

export interface ITestAttempt {
  _id: any;
  userId: string;
  courseId: string;
  testId: string;
  answers: number[];
  score: number;
  totalMarks: number;
  passed: boolean;
  attemptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const TestAttempt = createModel<ITestAttempt>('test_attempts');
