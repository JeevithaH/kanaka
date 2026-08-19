import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
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
}

const TaskSchema: Schema = new Schema<ITask>(
  {
    userId: { type: String, required: true, index: true },
    courseId: { type: String, default: '' },
    internshipId: { type: String, default: '' },
    courseTitle: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    instructions: { type: String, default: '' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    assignedBy: { type: String, default: 'admin' },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'submitted', 'under-review', 'approved', 'rejected'],
      default: 'pending',
    },
    submissionRequired: { type: Boolean, default: true },
    maxScore: { type: Number, default: 100 },
    attachmentUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
