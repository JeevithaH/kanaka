import { createModel } from '@/lib/mongodb';

export interface IInternship {
  _id: any;
  internshipId: string;
  title: string;
  domain: string;
  durationWeeks: number;
  stipendText: string;
  description: string;
  skills: string[];
  responsibilities: string[];
  perks: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Internship = createModel<IInternship>('internships');
