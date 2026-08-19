import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
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
}

const NotificationSchema: Schema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'task-assigned',
        'deadline',
        'test-available',
        'result',
        'enrollment',
        'payment',
        'internship',
        'certificate',
        'feedback',
      ],
      default: 'enrollment',
    },
    relatedId: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
