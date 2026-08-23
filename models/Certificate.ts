import { createModel } from '@/lib/mongodb';

export interface ICertificate {
  _id: any;
  certificateId: string;
  userId: string;
  courseId?: string;
  internshipId?: string;
  userName: string;
  courseTitle: string;
  issueDate: Date;
  completionDate?: Date;
  testScore: number;
  testTotal: number;
  authorizedIssuer: string;
  verificationUrl?: string;
  qrCodeData?: string;
  issuedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Certificate = createModel<ICertificate>('certificates');
