'use client';
import { useState } from 'react';
import { CourseCard, Course } from '@/components/course/CourseCard';

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction to Artificial Intelligence',
    description: 'Learn the fundamentals of AI, machine learning, and neural networks in this comprehensive introductory course.',
    category: 'Artificial Intelligence',
    difficulty: 'foundational',
    durationMinutes: 120,
    lessonCount: 12,
    slug: 'intro-to-ai'
  },
  {
    id: '2',
    title: 'Advanced Cybersecurity Practices',
    description: 'Master advanced techniques for securing enterprise systems and preventing modern cyber attacks.',
    category: 'Cybersecurity',
    difficulty: 'advanced',
    durationMinutes: 340,
    lessonCount: 24,
    slug: 'advanced-cybersecurity'
  },
  {
    id: '3',
    title: 'Data Science Fundamentals',
    description: 'A complete guide to data analysis, visualization, and statistical modeling for beginners.',
    category: 'Data Science',
    difficulty: 'foundational',
    durationMinutes: 280,
    lessonCount: 18,
    slug: 'data-science-fundamentals'
  },
  {
    id: '4',
    title: 'Cloud Native Architecture',
    description: 'Design and build scalable, resilient cloud applications using modern microservices patterns.',
    category: 'Cloud Computing',
    difficulty: 'intermediate',
    durationMinutes: 420,
    lessonCount: 32,
    slug: 'cloud-native-architecture'
  }
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Artificial Intelligence', 'Cybersecurity', 'Data Science', 'Cloud Computing'];

  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'All' || course.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1584px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-[#161616] font-semibold text-2xl mb-8">Learning catalog</h1>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#e0e0e0] px-4 py-3 text-sm text-[#161616] focus:outline-2 focus:outline-[#0f62fe] focus:outline-offset-[-2px]"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#e0e0e0]">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                  activeTab === category 
                    ? 'border-[#0f62fe] text-[#0f62fe]' 
                    : 'border-transparent text-[#525252] hover:text-[#161616] hover:border-[#c6c6c6]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
          {filteredCourses.length === 0 && (
            <div className="col-span-full py-12 text-center text-[#525252]">
              No courses found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
