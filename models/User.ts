import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserProfile {
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  phone?: string;
  college?: string;
  degree?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
  profile: IUserProfile;
  accountStatus: 'active' | 'suspended' | 'deactivated';
  isActive: boolean;
  registrationDate: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    profile: {
      avatarUrl: { type: String, default: '' },
      headline: { type: String, default: 'Student Learner' },
      bio: { type: String, default: '' },
      phone: { type: String, default: '' },
      college: { type: String, default: '' },
      degree: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedinUrl: { type: String, default: '' },
      githubUrl: { type: String, default: '' },
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deactivated'],
      default: 'active',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
