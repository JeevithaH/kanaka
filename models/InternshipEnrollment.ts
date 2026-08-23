import { createModel } from '@/lib/mongodb';

export interface IInternshipTaskProgress {
  taskId: string;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  submissionId?: string;
  score?: number;
  feedback?: string;
  updatedAt?: Date;
}

export interface IInternshipEnrollment {
  _id: any;
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
  save: () => Promise<any>;
  toObject: () => any;
}

export const InternshipEnrollment = createModel<IInternshipEnrollment>('internship_enrollments');
