import { createModel } from '@/lib/mongodb';

export interface INotification {
  _id: any;
  userId: string;
  title: string;
  message: string;
  type:
    | 'task-assigned'
    | 'deadline'
    | 'test-available'
    | 'result'
    | 'enrollment'
    | 'payment'
    | 'internship'
    | 'certificate'
    | 'feedback';
  relatedId?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Notification = createModel<INotification>('notifications');
