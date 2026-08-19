import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string; // unique readable ID like CERT-XXXX
  userId: string;
  courseId: string;
  userName: string;
  courseTitle: string;
  issueDate: Date;
  testScore: number;
  testTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema<ICertificate>(
  {
    certificateId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    courseId: { type: String, required: true },
    userName: { type: String, required: true },
    courseTitle: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    testScore: { type: Number, default: 0 },
    testTotal: { type: Number, default: 100 },
  },
  { timestamps: true }
);

export const Certificate: Model<ICertificate> =
  mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
