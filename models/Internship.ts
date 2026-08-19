import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInternshipTask {
  taskId: string;
  title: string;
  description: string;
  instructions?: string;
  deadlineDays: number; // e.g. 7 days after start
  maxScore: number;
}

export interface IInternship extends Document {
  internshipId: string; // unique slug e.g. ai-ml-engineering-intern
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
  validationFee: number; // e.g. 499 for certification/validation
  certificateEligible: boolean;
  isPublished: boolean;
  maxParticipants?: number;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSchema: Schema = new Schema<IInternship>(
  {
    internshipId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    organization: { type: String, required: true, default: 'Skyrellac Innovation Labs' },
    mode: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], default: 'Remote' },
    location: { type: String, default: 'Global / Remote' },
    durationWeeks: { type: Number, required: true, default: 8 },
    startDate: { type: Date },
    endDate: { type: Date },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Project-based'], default: 'Project-based' },
    requiredSkills: { type: [String], default: [] },
    tasks: [
      {
        taskId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        instructions: { type: String, default: '' },
        deadlineDays: { type: Number, default: 7 },
        maxScore: { type: Number, default: 100 },
      },
    ],
    validationFee: { type: Number, default: 499 },
    certificateEligible: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    maxParticipants: { type: Number, default: 500 },
  },
  { timestamps: true }
);

export const Internship: Model<IInternship> =
  mongoose.models.Internship || mongoose.model<IInternship>('Internship', InternshipSchema);
