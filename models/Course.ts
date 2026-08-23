import { createModel } from '@/lib/mongodb';

export interface ILesson {
  id: string;
  title: string;
  duration: string;
  contentType: 'video' | 'text' | 'quiz' | 'project';
  videoUrl?: string;
  contentText?: string;
  resourceUrl?: string;
}

export interface IModule {
  id: string;
  title: string;
  description: string;
  lessons: ILesson[];
}

export interface IQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface ITest {
  id: string;
  title: string;
  durationMinutes: number;
  passingScorePct: number;
  totalMarks: number;
  questions: IQuestion[];
}

export interface ICourse {
  _id: any;
  courseId: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    title: string;
    avatarUrl?: string;
  };
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  rating: number;
  studentsCount: number;
  category: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  lessonCount: number;
  certificateEligible: boolean;
  isPublished: boolean;
  skills: string[];
  modules: IModule[];
  tests: ITest[];
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const Course = createModel<ICourse>('courses');
