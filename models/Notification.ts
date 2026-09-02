import { createModel } from '@/lib/mongodb';

export interface INotification {
  _id: any;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  linkUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Notification = createModel<INotification>('notifications');
