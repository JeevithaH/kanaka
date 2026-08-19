import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInternshipTaskProgress {
  taskId: string;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  submissionId?: string;
  score?: number;
  feedback?: string;
  updatedAt?: Date;
}

export interface IInternshipEnrollment extends Document {
  userId: string;
  internshipId: string;
  enrollmentDate: Date;
  status: 'active' | 'completed' | 'withdrawn';
  progressPercentage: number;
  validationStatus: 'pending' | 'paid' | 'validated';
  validationAmountPaid: number;
  validationPaymentDate?: Date;
  taskProgress: IInternshipTaskProgress[];
  certificateStatus: {
    eligible: boolean;
    issued: boolean;
    certificateId?: string;
    issuedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const InternshipEnrollmentSchema: Schema = new Schema<IInternshipEnrollment>(
  {
    userId: { type: String, required: true, index: true },
    internshipId: { type: String, required: true, index: true },
    enrollmentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'completed', 'withdrawn'], default: 'active' },
    progressPercentage: { type: Number, default: 0 },
    validationStatus: { type: String, enum: ['pending', 'paid', 'validated'], default: 'pending' },
    validationAmountPaid: { type: Number, default: 0 },
    validationPaymentDate: { type: Date },
    taskProgress: [
      {
        taskId: { type: String, required: true },
        status: {
          type: String,
          enum: ['Not Started', 'In Progress', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Completed'],
          default: 'Not Started',
        },
        submissionId: { type: String },
        score: { type: Number },
        feedback: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    certificateStatus: {
      eligible: { type: Boolean, default: false },
      issued: { type: Boolean, default: false },
      certificateId: { type: String, default: '' },
      issuedAt: { type: Date },
    },
  },
  { timestamps: true }
);

InternshipEnrollmentSchema.index({ userId: 1, internshipId: 1 }, { unique: true });

export const InternshipEnrollment: Model<IInternshipEnrollment> =
  mongoose.models.InternshipEnrollment ||
  mongoose.model<IInternshipEnrollment>('InternshipEnrollment', InternshipEnrollmentSchema);
