'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Category = 'Most Popular' | 'AI' | 'Data Science' | 'Cybersecurity' | 'Cloud' | 'Web Dev';

const CATEGORIES: Category[] = ['Most Popular', 'AI', 'Data Science', 'Cybersecurity', 'Cloud', 'Web Dev'];

interface Course {
  id: number;
  title: string;
  provider: string;
  rating: number;
  reviews: string;
  level: string;
  type: string;
  skills: string[];
  duration: string;
  isFree: boolean;
  category: Category[];
  image: string;
}

const COURSES: Course[] = [
  {
    id: 1,
    title: 'AI Fundamentals for Everyone',
    provider: 'Skyrellac',
    rating: 4.8,
    reviews: '12,453',
    level: 'Beginner',
    type: 'Course',
    skills: ['Machine Learning', 'AI Ethics', 'Neural Networks'],
    duration: '3 months',
    isFree: true,
    category: ['Most Popular', 'AI'],
    image: '/images/ai.jpg',
  },
  {
    id: 2,
    title: 'Data Science & Analytics Bootcamp',
    provider: 'Skyrellac',
    rating: 4.7,
    reviews: '9,812',
    level: 'Intermediate',
    type: 'Professional Certificate',
    skills: ['Python', 'SQL', 'Data Visualization'],
    duration: '2 months',
    isFree: true,
    category: ['Most Popular', 'Data Science'],
    image: '/images/data_science.jpg',
  },
  {
    id: 3,
    title: 'Cybersecurity Essentials',
    provider: 'Skyrellac',
    rating: 4.9,
    reviews: '7,234',
    level: 'Beginner',
    type: 'Course',
    skills: ['Network Security', 'Ethical Hacking', 'Firewalls'],
    duration: '2 months',
    isFree: true,
    category: ['Most Popular', 'Cybersecurity'],
    image: '/images/cyber_security.jpg',
  },
  {
    id: 4,
    title: 'Cloud Computing with AWS & Azure',
    provider: 'Skyrellac',
    rating: 4.6,
    reviews: '5,678',
    level: 'Intermediate',
    type: 'Specialization',
    skills: ['AWS', 'Azure', 'DevOps', 'Kubernetes'],
    duration: '4 months',
    isFree: true,
    category: ['Most Popular', 'Cloud'],
    image: '/images/cloud_security.jpg',
  },
  {
    id: 5,
    title: 'Generative AI & Prompt Engineering',
    provider: 'Skyrellac',
    rating: 4.9,
    reviews: '15,002',
    level: 'Beginner',
    type: 'Course',
    skills: ['ChatGPT', 'LLMs', 'Prompt Design'],
    duration: '1 month',
    isFree: true,
    category: ['AI', 'Most Popular'],
    image: '/images/genai.jpg',
  },
  {
    id: 6,
    title: 'Full-Stack Web Development',
    provider: 'Skyrellac',
    rating: 4.7,
    reviews: '8,321',
    level: 'Beginner',
    type: 'Professional Certificate',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    duration: '6 months',
    isFree: true,
    category: ['Web Dev', 'Most Popular'],
    image: '/images/web.jpg',
  },
  {
    id: 7,
    title: 'Machine Learning with Python',
    provider: 'Skyrellac',
    rating: 4.8,
    reviews: '10,456',
    level: 'Intermediate',
    type: 'Specialization',
    skills: ['Scikit-learn', 'TensorFlow', 'Data Wrangling'],
    duration: '5 months',
    isFree: true,
    category: ['AI', 'Data Science'],
    image: '/images/ai.jpg',
  },
  {
    id: 8,
    title: 'SQL for Data Analysis',
    provider: 'Skyrellac',
    rating: 4.6,
    reviews: '6,123',
    level: 'Beginner',
    type: 'Course',
    skills: ['SQL', 'PostgreSQL', 'Data Querying'],
    duration: '2 months',
    isFree: true,
    category: ['Data Science'],
    image: '/images/data_science.jpg',
  },
  {
    id: 9,
    title: 'UX Design for Digital Products',
    provider: 'Skyrellac',
    rating: 4.8,
    reviews: '4,920',
    level: 'Beginner',
    type: 'Course',
    skills: ['User Research', 'Wireframing', 'Accessibility'],
    duration: '6 weeks',
    isFree: true,
    category: ['Most Popular', 'Web Dev'],
    image: '/images/ux.jpg',
  },
  {
    id: 10,
    title: 'Data Storytelling with Dashboards',
    provider: 'Skyrellac',
    rating: 4.7,
    reviews: '5,416',
    level: 'Beginner',
    type: 'Course',
    skills: ['Power BI', 'Data Visualization', 'Business Insights'],
    duration: '5 weeks',
    isFree: true,
    category: ['Most Popular', 'Data Science'],
    image: '/images/data_science.jpg',
  },
  {
    id: 11,
    title: 'Cloud Security Foundations',
    provider: 'Skyrellac',
    rating: 4.8,
    reviews: '3,876',
    level: 'Intermediate',
    type: 'Specialization',
    skills: ['Identity Access', 'Risk Management', 'Cloud Security'],
    duration: '8 weeks',
    isFree: true,
    category: ['Most Popular', 'Cloud', 'Cybersecurity'],
    image: '/images/cloud_security.jpg',
  },
  {
    id: 12,
    title: 'AI for Business Decision Making',
    provider: 'Skyrellac',
    rating: 4.9,
    reviews: '6,218',
    level: 'Beginner',
    type: 'Course',
    skills: ['Generative AI', 'Strategy', 'Responsible AI'],
    duration: '4 weeks',
    isFree: true,
    category: ['Most Popular', 'AI'],
    image: '/images/genai.jpg',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-[#f5a623]' : 'text-[#d6d6d6]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link href="/courses" className="group bg-white border border-[#c8c8c8] overflow-hidden hover:border-[#80664f] hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Course Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#f4f4f4]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Type Badge */}
        <span className="absolute top-2 left-2 bg-white text-[#80664f] text-[10px] font-bold px-2 py-0.5 rounded border border-[#80664f]">
          {course.type}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Provider */}
        <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 relative overflow-hidden">
            <Image src={course.image} alt={course.provider} fill className="object-cover" />
          </div>
          <span className="text-xs text-[#595959] font-medium">{course.provider}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-[#1f1f1f] mb-2 leading-snug line-clamp-2 group-hover:text-[#80664f] transition-colors">
          {course.title}
        </h3>

        {/* Skills */}
        <p className="text-xs text-[#595959] mb-3 line-clamp-1">
          Skills: {course.skills.join(', ')}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-sm font-bold text-[#1f1f1f]">{course.rating}</span>
          <StarRating rating={course.rating} />
          <span className="text-xs text-[#595959]">({course.reviews})</span>
        </div>

        {/* Level + Duration */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-[#595959] border border-[#c8c8c8] px-2 py-0.5">
            {course.level}
          </span>
          <span className="text-xs text-[#595959]">· {course.duration}</span>
        </div>

        {/* Enroll Button */}
        <div className="mt-auto">
          {course.isFree && (
            <span className="block text-[10px] text-[#80664f] font-semibold mb-1.5">
              Free to enroll
            </span>
          )}
          <span className="w-full bg-[#80664f] group-hover:bg-[#5f4938] text-white text-sm font-semibold py-2 text-center transition-colors">
            Enroll for Free
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedCoursesSection() {
  const [activeCategory, setActiveCategory] = useState<Category>('Most Popular');

  const filtered = COURSES.filter((c) => c.category.includes(activeCategory));

  return (
    <section className="bg-[#f5f2ef] py-14 lg:py-20 border-y border-[#c8c8c8]">
      <div className="max-w-[1584px] mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#5f4938] mb-3">START WHERE YOU ARE</p>
            <h2 className="text-3xl lg:text-[2.5rem] leading-tight font-semibold text-[#161616] tracking-[-0.02em]">
              Find a course that feels made for you
            </h2>
            <p className="text-sm text-[#595959] mt-1">
              Practical learning for the work you want to do next.
            </p>
          </div>
          <Link
            href="/courses"
            className="text-[#80664f] text-sm font-semibold hover:underline inline-flex items-center gap-1 shrink-0"
          >
            View all courses
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z" />
            </svg>
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border transition-colors ${
                activeCategory === cat
                  ? 'bg-[#80664f] text-white border-[#80664f]'
                  : 'bg-white text-[#595959] border-[#e0e0e0] hover:border-[#80664f] hover:text-[#80664f]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 border-2 border-[#80664f] text-[#80664f] font-semibold px-8 py-3 rounded hover:bg-[#80664f] hover:text-white transition-colors text-sm"
          >
            Explore all courses
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
