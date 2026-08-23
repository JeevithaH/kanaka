import { createModel } from '@/lib/mongodb';

export interface IInternshipTask {
  taskId: string;
  title: string;
  description: string;
  instructions?: string;
  deadlineDays: number;
  maxScore: number;
}

export interface IInternship {
  _id: any;
  internshipId: string;
  title: string;
  description: string;
  organization: string;
  mode: 'Remote' | 'Hybrid' | 'On-site';
  location: string;
  durationWeeks: number;
  startDate?: Date;
  endDate?: Date;
  type: 'Full-time' | 'Part-time' | 'Project-based';
  requiredSkills: string[];
  tasks: IInternshipTask[];
  validationFee: number;
  certificateEligible: boolean;
  isPublished: boolean;
  maxParticipants?: number;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Internship = createModel<IInternship>('internships');
