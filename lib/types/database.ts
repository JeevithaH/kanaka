export type UserRole = 'student' | 'admin';
export type StudentType = 'University student' | 'College student' | 'Graduate' | 'Working professional' | 'Job seeker' | 'Other';
export type CourseDifficulty = 'Foundational' | 'Intermediate' | 'Advanced';
export type ContentType = 'video' | 'text' | 'quiz' | 'project';
export type InternshipMode = 'Remote' | 'Hybrid' | 'On-site';
export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'Withdrawn';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  student_type?: StudentType;
  headline?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  college?: string;
  degree?: string;
  graduation_year?: number;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url?: string;
  category_id?: string;
  category_name?: string;
  difficulty: CourseDifficulty;
  duration_minutes: number;
  lesson_count: number;
  credential_available: boolean;
  price_inr: number;
  is_published: boolean;
  skills?: string[];
  created_at: string;
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  estimated_hours: number;
  is_published: boolean;
  courses?: Course[];
}

export interface Internship {
  id: string;
  title: string;
  slug: string;
  organization_name: string;
  organization_logo?: string;
  mode: InternshipMode;
  location: string;
  duration_weeks: number;
  description: string;
  responsibilities?: string;
  eligibility?: string;
  required_skills?: string[];
  application_deadline?: string;
  is_published: boolean;
  created_at: string;
}

export interface InternshipApplication {
  id: string;
  internship_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  graduation_year: number;
  skills_summary?: string;
  resume_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  cover_letter?: string;
  status: ApplicationStatus;
  applied_at: string;
  internship_title?: string;
  organization_name?: string;
}

export interface Credential {
  id: string;
  credential_id: string; // e.g. SKY-AI-2026-00123
  user_id: string;
  user_name?: string;
  course_id: string;
  title: string;
  issue_date: string;
  skills_list: string[];
}

export interface Test {
  id: string;
  course_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  passing_score_pct: number;
  total_marks: number;
  questions_count?: number;
}
