import { createModel } from '@/lib/mongodb';

export interface ITask {
  _id: any;
  userId: string;
  courseId?: string;
  internshipId?: string;
  courseTitle?: string;
  title: string;
  description?: string;
  instructions?: string;
  priority?: 'low' | 'medium' | 'high';
  assignedBy?: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'submitted' | 'under-review' | 'approved' | 'rejected';
  submissionRequired?: boolean;
  maxScore?: number;
  attachmentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Task = createModel<ITask>('tasks');
