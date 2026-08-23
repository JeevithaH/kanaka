import { createModel } from '@/lib/mongodb';

export interface ITestAttempt {
  _id: any;
  attemptId: string;
  userId: string;
  courseId?: string;
  internshipId?: string;
  testId: string;
  answers: number[];
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const TestAttempt = createModel<ITestAttempt>('test_attempts');
