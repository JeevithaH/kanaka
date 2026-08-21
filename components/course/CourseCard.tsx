import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  durationMinutes: number;
  lessonCount: number;
  slug: string;
  priceInr?: number;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const price = 1999;

  return (
    <div className={cn("flex flex-col bg-white border border-[#e0e0e0] hover:shadow-sm transition-shadow rounded-none overflow-hidden", className)}>
      <div className="aspect-[3/2] bg-[#e0e0e0] w-full" />
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-[#525252] mb-2 uppercase tracking-wide">{course.category}</span>
        <h3 className="text-base font-semibold text-[#161616] hover:text-[#80664f] mb-2 line-clamp-1">
          <Link href={`/courses/${course.slug}`}>
            {course.title}
          </Link>
        </h3>
        <p className="text-sm text-[#525252] line-clamp-2 mb-4 flex-grow">
          {course.description}
        </p>
        <div className="flex items-center justify-between text-xs text-[#525252] mb-4">
          <Badge variant={course.difficulty as any}>{course.difficulty}</Badge>
          <div className="flex items-center gap-3">
            <span>{formatDuration(course.durationMinutes)}</span>
            <span>{course.lessonCount} lessons</span>
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-[#e0e0e0] flex items-center justify-between">
          <span className="text-[#161616] text-base font-semibold">₹{price.toLocaleString()}</span>
          <Link href={`/courses/${course.slug}`} className="text-[#80664f] text-sm inline-flex items-center gap-1 hover:underline font-medium">
            Enroll for ₹1,999 →
          </Link>
        </div>
      </div>
    </div>
  );
}
