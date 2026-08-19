import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITaskSubmission extends Document {
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
}

const TaskSubmissionSchema: Schema = new Schema<ITaskSubmission>(
  {
    submissionId: { type: String, required: true, unique: true },
    taskId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    courseId: { type: String },
    internshipId: { type: String },
    submissionType: { type: String, enum: ['text', 'link', 'file'], default: 'text' },
    submissionContent: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Completed'],
      default: 'Submitted',
    },
    evaluationScore: { type: Number },
    evaluationFeedback: { type: String, default: '' },
    evaluatedBy: { type: String, default: '' },
    evaluatedAt: { type: Date },
  },
  { timestamps: true }
);

export const TaskSubmission: Model<ITaskSubmission> =
  mongoose.models.TaskSubmission || mongoose.model<ITaskSubmission>('TaskSubmission', TaskSubmissionSchema);
