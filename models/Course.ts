import mongoose, { Schema, Document, Model } from 'mongoose';

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

export interface ICourse extends Document {
  courseId: string; // Unique slug/code e.g. ai-fundamentals
  title: string;
  description: string;
  instructor: {
    name: string;
    title: string;
    avatarUrl?: string;
  };
  image: string;
  originalPrice: number; // 1999
  discountedPrice: number; // 199
  discountPercentage: number; // 90
  rating: number; // 4.8
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
}

const CourseSchema: Schema = new Schema<ICourse>(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      name: { type: String, required: true, default: 'Skyrellac Expert' },
      title: { type: String, default: 'Senior Tech Lead' },
      avatarUrl: { type: String, default: '' },
    },
    image: {
      type: String,
      default: '',
    },
    originalPrice: {
      type: Number,
      default: 1999,
    },
    discountedPrice: {
      type: Number,
      default: 199,
    },
    discountPercentage: {
      type: Number,
      default: 90,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    studentsCount: {
      type: Number,
      default: 1240,
    },
    category: {
      type: String,
      required: true,
      default: 'Artificial Intelligence',
    },
    difficulty: {
      type: String,
      enum: ['Foundational', 'Intermediate', 'Advanced'],
      default: 'Foundational',
    },
    durationMinutes: {
      type: Number,
      default: 240,
    },
    lessonCount: {
      type: Number,
      default: 12,
    },
    certificateEligible: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    modules: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        lessons: [
          {
            id: { type: String, required: true },
            title: { type: String, required: true },
            duration: { type: String, default: '15 mins' },
            contentType: {
              type: String,
              enum: ['video', 'text', 'quiz', 'project'],
              default: 'video',
            },
            videoUrl: { type: String, default: '' },
            contentText: { type: String, default: '' },
            resourceUrl: { type: String, default: '' },
          },
        ],
      },
    ],
    tests: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        durationMinutes: { type: Number, default: 30 },
        passingScorePct: { type: Number, default: 70 },
        totalMarks: { type: Number, default: 100 },
        questions: [
          {
            id: { type: String, required: true },
            questionText: { type: String, required: true },
            options: { type: [String], required: true },
            correctOptionIndex: { type: Number, required: true },
            explanation: { type: String, default: '' },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
