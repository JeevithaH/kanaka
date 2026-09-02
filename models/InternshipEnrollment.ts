import { createModel } from '@/lib/mongodb';

export interface IInternshipEnrollment {
  _id: any;
  userId: string;
  internshipId: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  appliedAt: Date;
  certificateIssued: boolean;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const InternshipEnrollment = createModel<IInternshipEnrollment>('internship_enrollments');
