import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestAttempt extends Document {
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
}

const TestAttemptSchema: Schema = new Schema<ITestAttempt>(
  {
    attemptId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    courseId: { type: String },
    internshipId: { type: String },
    testId: { type: String, required: true, index: true },
    answers: { type: [Number], required: true },
    score: { type: Number, required: true, default: 0 },
    totalMarks: { type: Number, required: true, default: 100 },
    percentage: { type: Number, required: true, default: 0 },
    passed: { type: Boolean, required: true, default: false },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TestAttempt: Model<ITestAttempt> =
  mongoose.models.TestAttempt || mongoose.model<ITestAttempt>('TestAttempt', TestAttemptSchema);
