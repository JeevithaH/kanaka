import { createModel } from '@/lib/mongodb';

export interface IFeedback {
  _id: any;
  userId: string;
  courseId: string;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Feedback = createModel<IFeedback>('feedbacks');
