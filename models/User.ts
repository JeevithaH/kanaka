import { createModel } from '@/lib/mongodb';

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

export interface IUser {
  _id: any;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
  profile: IUserProfile;
  accountStatus: 'active' | 'suspended' | 'deactivated';
  isActive: boolean;
  registrationDate: Date;
  lastLogin?: Date;
  isEmailVerified?: boolean;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
  save: () => Promise<any>;
  toObject: () => any;
}

export const User = createModel<IUser>('users');
