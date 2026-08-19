import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestAttemptStatus {
  testId: string;
  testTitle: string;
  score: number;
  totalMarks: number;
  passed: boolean;
  attemptedAt: Date;
}

export interface ICertificateStatus {
  eligible: boolean;
  issued: boolean;
  certificateId?: string;
  issuedAt?: Date;
}

export interface IEnrollment extends Document {
  userId: string;
  courseId: string;
  enrollmentDate: Date;
  status: 'active' | 'completed';
  paymentStatus: 'pending' | 'paid';
  amountPaid: number;
  paymentDate?: Date;
  couponUsed?: string;
  progressPercentage: number;
  completedLessons: string[]; // array of lesson IDs
  testStatus: ITestAttemptStatus[];
  certificateStatus: ICertificateStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema: Schema = new Schema<IEnrollment>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    courseId: {
      type: String,
      required: true,
      index: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
    },
    couponUsed: {
      type: String,
      default: '',
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
    completedLessons: {
      type: [String],
      default: [],
    },
    testStatus: [
      {
        testId: { type: String, required: true },
        testTitle: { type: String, default: '' },
        score: { type: Number, default: 0 },
        totalMarks: { type: Number, default: 100 },
        passed: { type: Boolean, default: false },
        attemptedAt: { type: Date, default: Date.now },
      },
    ],
    certificateStatus: {
      eligible: { type: Boolean, default: false },
      issued: { type: Boolean, default: false },
      certificateId: { type: String, default: '' },
      issuedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only be enrolled in a course once
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
