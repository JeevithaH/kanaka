import { createModel } from '@/lib/mongodb';

export interface ITaskSubmission {
  _id: any;
  submissionId: string;
  taskId: string;
  userId: string;
  userName: string;
  courseId?: string;
  internshipId?: string;
  submissionType: 'text' | 'link' | 'file';
  submissionContent: string;
  submittedAt: Date;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  evaluationScore?: number;
  evaluationFeedback?: string;
  evaluatedBy?: string;
  evaluatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const TaskSubmission = createModel<ITaskSubmission>('task_submissions');
