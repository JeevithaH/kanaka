import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string; // unique readable ID like SKY-AI-2026-00123
  userId: string;
  courseId?: string;
  internshipId?: string;
  userName: string;
  courseTitle: string; // Course or Internship Title
  issueDate: Date;
  completionDate?: Date;
  testScore: number;
  testTotal: number;
  authorizedIssuer: string;
  verificationUrl?: string;
  qrCodeData?: string;
  issuedBy?: string; // admin userId
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema<ICertificate>(
  {
    certificateId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    courseId: { type: String, default: '' },
    internshipId: { type: String, default: '' },
    userName: { type: String, required: true },
    courseTitle: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    completionDate: { type: Date, default: Date.now },
    testScore: { type: Number, default: 0 },
    testTotal: { type: Number, default: 100 },
    authorizedIssuer: { type: String, default: 'Skyrellac Academic Certification Board' },
    verificationUrl: { type: String, default: '' },
    qrCodeData: { type: String, default: '' },
    issuedBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

export const Certificate: Model<ICertificate> =
  mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
