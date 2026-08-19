import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeedback extends Document {
  userId: string;
  courseId: string;
  rating: number; // 1-5
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema<IFeedback>(
  {
    userId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: '' },
  },
  { timestamps: true }
);

FeedbackSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Feedback: Model<IFeedback> =
  mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
