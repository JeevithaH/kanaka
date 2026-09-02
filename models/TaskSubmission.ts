import { createModel } from '@/lib/mongodb';

export interface ITaskSubmission {
  _id: any;
  taskId: string;
  userId: string;
  submissionText?: string;
  submissionUrl?: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  score?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const TaskSubmission = createModel<ITaskSubmission>('task_submissions');
